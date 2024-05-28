"use server";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/db";
import { Channel, MemberRole, Server } from "@prisma/client";


export async function deleteChannel(serverId: string | undefined, channelId: string | undefined) {
    try {
        const currentUser =  await getCurrentUser();

        if (!currentUser) {
            throw new Error("Unauthorized Action");
        }

        if (!serverId || !channelId) {
            throw new Error("Server ID or Channel ID not provided");
        }

        // Only Admin and Moderator can delete channel. 
        // General Channel cannot be deleted.
        const deletedChannel = await prisma.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: currentUser.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    deleteMany: { 
                        id: channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        })

        // console.log("Deleted Channel:", deletedChannel);

        return { data: "Channel deleted successfully" };

    } catch (error: any) {
        console.error("[DELETE_CHANNEL_ACTION]", error);
        return { error: error.message };
    }
}