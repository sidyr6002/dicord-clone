import { getCurrentUserPages } from "@/lib/current-user-pages";
import prisma from "@/lib/db";
import AppError from "@/lib/error/app-error";
import { NextApiResponseWithSocket } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseWithSocket
) {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }

    try {
        const currentUser = await getCurrentUserPages(req);
        const { messageId, conversationId } = req.query;
        const { message } = req.body;

        if (!currentUser) {
            throw new AppError("User not authenticated", 401);
        }

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
            throw new AppError("Conversation not found", 404);
        }

        const member = conversation.memberOne.profileId === currentUser.id ? conversation.memberOne : conversation.memberTwo;

        if (!member) {
            throw new AppError("User not found", 404);
        }

        let messageByUser = await prisma.directMessage.findFirst({
            where: {
                id: messageId as string,
                conversationId: conversation.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        if (!messageByUser || messageByUser.deleted) {
            throw new AppError("Message not found", 404);
        }

        const isMessageOwner = messageByUser.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;

        if (req.method === "DELETE") {
            const canDelete = isMessageOwner || isAdmin || isModerator;

            if (!canDelete) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized permission to delete this message",
                })
            }

            messageByUser = await prisma.directMessage.update({
                where: {
                    id: messageId as string
                },
                data: {
                    fileURL: null,
                    content: "[This message has been deleted]",
                    deleted: true
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }

        if (req.method === "PATCH") {
            const canEdit = isMessageOwner;

            if (!canEdit) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized permission to edit this message",
                })
            } 

            messageByUser = await prisma.directMessage.update({
                where: {
                    id: messageId as string
                },
                data: {
                    content: message
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }

        const updatedKey = `chat:${conversationId}:messages:update`;

        res.socket.server.io.emit(updatedKey, messageByUser);


        return res.status(200).json({
            message: messageByUser
        })

    } catch (error) {
        console.log("[SOCKET_MESSAGE_ID]", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}
