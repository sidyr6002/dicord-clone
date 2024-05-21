"use server";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/db";

export async function deleteSever(serverId: string | undefined) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        if (!serverId) {
            throw new Error("Server ID not provided");
        }

        const server = await prisma.server.delete({
            where: {
                id: serverId,
                profileId: currentUser.id,
            },
        });

        console.log("Deleted Server:", server);

        return { data: "Server deleted successfully" };
    } catch (error: any) {
        console.log("[DELETE_SERVER_ACTION]", error);
        return { error: error.message };
    }
}
