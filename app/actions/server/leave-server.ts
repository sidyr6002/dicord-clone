"use server";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/db";

export async function leaveServer(serverId: string | undefined) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        if (!serverId) {
            throw new Error("ServerId not provided");
        }

        const server = await prisma.server.update({
            where: {
                id: serverId,
                profileId: {
                    not: currentUser.id 
                },
                members: {
                    some: {
                        profileId: currentUser.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: currentUser.id
                    }
                }
            }
        });

        return { data: "Server leaved successfully" };
    } catch (error: any) {
        console.log("[LEAVE_SERVER_ACTION]", error);
        return { error: error.message };
    }
}