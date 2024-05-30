"use server";

import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

import { ChannelType, MemberRole } from "@prisma/client";

export async function editChannel(serverId: string | undefined, channelId: string | undefined, channelName: string, channelType: ChannelType) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        if (!serverId || !channelId) {
            throw new Error("Server ID or Channel ID not provided");
        }

        if (channelName === "general") {
            throw new Error("Channel name cannot be 'general'");
        }

        const editedChannel = await prisma.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: currentUser.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        }
                    }
                }
            },
            data: {
                channels: {
                    updateMany: {
                        where: {
                            id: channelId,
                            name: {
                                not: "general"
                            }
                        },
                        data: {
                            name: channelName,
                            type: channelType
                        }
                    }
                }
            }
        })

        //console.log("Edited Channel", editedChannel);
        return { data: "Channel data updated" };

    } catch (error: any) {
        console.error("[EDIT_CHANNEL_ACTION]", error);
        return { error: error.message };
    }
}