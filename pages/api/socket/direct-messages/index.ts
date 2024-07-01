import { NextApiResponseWithSocket } from "@/types";
import { NextApiRequest } from "next";

import { getCurrentUserPages } from "@/lib/current-user-pages";

import AppError from "@/lib/error/app-error";
import prisma from "@/lib/db";


export default async function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {

    if (req.method !== "POST") {
        res.status(405).json({
            success: false,
            message: "Method not allowed",
        })
    }

    try {
        const currentUser = await getCurrentUserPages(req);

        if (!currentUser) {
            throw new AppError("User not authenticated", 401);
        }

        const { message: content, fileURL } = req.body;
        const { conversationId } = req.query;

        //console.log(req.body);

        if (!conversationId) {
            throw new AppError("Missing conversationId", 400);
        }

        const conversation = await prisma.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: currentUser.id
                        }
                    },
                    {
                        memberTwo: {
                            profileId: currentUser.id
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        if (!conversation) {
            throw new AppError("Server not found", 404);
        }

        const memeber = conversation.memberOne.profileId === currentUser.id ? conversation.memberOne : conversation.memberTwo;

        if (!memeber) {
            throw new AppError("User not a member of the server", 403);
        }

        if (!content) {
            throw new AppError("Missing content", 400);
        }

        const message = await prisma.directMessage.create({
            data: {
                content,
                fileURL,
                memberId: memeber.id,
                conversationId: conversation.id,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        const channelKey = `chat:${conversationId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message); 
        
        return res.status(200).json({
            success: true,
            message: message,
        })

    } catch (error: any) {
        console.log("[DIRECT_SOCKET_MESSAGES]", error);

        if (error instanceof AppError) {
            return res.status(error.status).json({
                success: false,
                message: error.message,
            })
        }

        return res.status(401).json({
            success: false,
            message: "Internal server error",
        })
    }
}