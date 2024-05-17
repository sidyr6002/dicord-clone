"use server";
import { formSchema } from "@/schema/form-schema";
import { z } from "zod";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";
import { v4 as uuidv4 } from 'uuid';

export async function saveServerData(inputValues: z.infer<typeof formSchema>) {
    try {
        const validData = await formSchema.safeParseAsync(inputValues);

        if (!validData.success) {
            throw new Error("Invalid data");
        }

        const serverData = validData.data;
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            throw new Error("User not found");
        }

        const serverExists = await prisma.server.findFirst({
            where: {
                members: {
                    some: {
                        profileId: currentUser.id
                    }
                }
            }
        })

        if (serverExists?.name.toLowerCase() === serverData.serverName.toLowerCase()) {
            throw new Error("Server already exists");
        }

        const server = await prisma.server.create({
            data: {
                name: serverData.serverName,
                imageURL: serverData.serverImage,
                inviteCode: uuidv4(),
                profileId: currentUser.id,
                channels: {
                    create: {
                        profileId: currentUser.id,
                        name: "general",
                    },
                },
                members: {
                    create: {
                        profileId: currentUser.id,
                        role: "ADMIN",
                    },
                },
            },
        });

        console.log(server);

        return { data: "Server created successfully" };
    } catch (error: any) {
        console.log("[SERVER_DATA_ACTION]", error);
        return { error: error.message };
    }
}
