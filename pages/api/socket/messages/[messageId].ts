import { getCurrentUserPages } from "@/lib/current-user-pages";
import prisma from "@/lib/db";
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
        const { messageId, serverId, channelId } = req.query;
        const { message } = req.body;

        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            })
        }

        if (!serverId) {
            return res.status(400).json({
                success: false,
                message: "Missing serverId",
            })
        }

        if (!channelId) {
            return res.status(400).json({
                success: false,
                message: "Missing channelId",
            })
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
            return res.status(404).json({
                success: false,
                message: "Server not found",
            })
        }

        const channel = await prisma.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string
            }
        })

        if (!channel) {
            return res.status(404).json({
                success: false,
                message: "Channel not found",
            })
        }

        const member = server.members.find(member => member.profileId === currentUser.id);

        if (!member) {
            return res.status(403).json({
                success: false,
                message: "User not a member of the server",
            })
        }

        let messageByUser = await prisma.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channel.id
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
            return res.status(404).json({
                success: false,
                message: "Message not found or deleted",
            })
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

            messageByUser = await prisma.message.update({
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

            messageByUser = await prisma.message.update({
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

        const updatedKey = `chat:${channelId}:messages:updated`;

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
