"use server";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function generateNewInvitelink(serverId: string | undefined) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            throw new Error("User not found");
        }

        if (!serverId) {
            throw new Error("Server not found");
        }
        
        const server = await prisma.server.update({
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
                inviteCode: uuidv4(),
            },
        });

        //console.log("Updated Server:", server);

        return { data: server };
    } catch (error: any) {
        console.log("[GENERATE_NEW_INVITELINK_ACTION]", error);
        return { error: error.message };
    }
}
