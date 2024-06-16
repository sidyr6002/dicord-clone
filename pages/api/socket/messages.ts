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
        const { serverId, channelId } = req.query;

        console.log(req.body);

        if (!serverId) {
            throw new AppError("Missing serverId", 400);
        }

        if (!channelId) {
            throw new AppError("Missing channelId", 400);
        }

        const server = await prisma.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: currentUser.id
                    }
                }
            },
            include: {
                members: true
            }
        })

        if (!server) {
            throw new AppError("Server not found", 404);
        }

        const channel = await prisma.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            }
        })

        if (!channel) {
            throw new AppError("Channel not found", 404);
        }

        const memeber = server.members.find(member => member.profileId === currentUser.id);

        if (!memeber) {
            throw new AppError("User not a member of the server", 403);
        }

        if (!content) {
            throw new AppError("Missing content", 400);
        }

        const message = await prisma.message.create({
            data: {
                content,
                fileURL,
                memberId: memeber.id,
                channelId: channel.id,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        const channelKey = `chat:${channelId}:messages`;

        res.socket.server.io.emit(channelKey, message); 
        
        return res.status(200).json({
            success: true,
            message: message,
        })

    } catch (error: any) {
        console.log("[SOCKET_MESSAGES]", error);

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