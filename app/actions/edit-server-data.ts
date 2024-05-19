"use server";
import { getCurrentUser } from "@/lib/current-user";
import { formSchema } from "@/schema/form-schema";
import { z } from "zod";
import prisma from "@/lib/db";

export async function editServerData(
    serverId: string | undefined,
    inputValues: z.infer<typeof formSchema>
) {
    try {
        if (!serverId) {
            throw new Error("ServerId not provided");
        }

        const currentUser = await getCurrentUser();
        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        const server = await prisma.server.update({
            where: {
                id: serverId,
            },
            data: {
                name: inputValues.serverName,
                imageURL: inputValues.serverImage,
            },
        });

        //console.log("Updated Server:", server);

        return { data: "Server updated successfully" };
    } catch (error: any) {
        console.log("[EDIT_SERVER_DATA_ACTION]", error);
        return { error: error.message };
    }
}
