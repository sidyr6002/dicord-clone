"use server";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";

export async function addNewChannel(
    serverId: string | undefined,
    name: string,
    type: ChannelType
) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            throw new Error("Unauthorized Action");
        }

        if (!serverId) {
            throw new Error("Server ID not found");
        }

        const existingChannel = await prisma.channel.findFirst({
            where: {
                name,
                serverId
            }
        })

        if (existingChannel) {
            throw new Error("Channel already exists");
        }

        const server = await prisma.server.update({
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
                    create: {
                        name,
                        type,
                        profileId: currentUser.id
                    }
                }
            }
        })

        console.log("[ADD_NEW_CHANNEL_ACTION]", server);

        return { data: "Channel added successfully" };

    } catch (error: any) {
        console.log("[ADD_NEW_CHANNEL_ACTION]", error);
        return { error: error.message };
    }
}