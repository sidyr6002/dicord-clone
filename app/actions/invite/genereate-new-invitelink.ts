"use server";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/db";

export async function generateNewInvitelink(serverId: string | undefined) {
    try {
        if (!serverId) {
            throw new Error("Server not found");
        }

        const user = await getCurrentUser();
        if (!user) {
            throw new Error("User not found");
        }

        const server = await prisma.server.update({
            where: {
                id: serverId,
                profileId: user.id,
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
