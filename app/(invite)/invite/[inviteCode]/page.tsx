import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
}
const InviteCodePage = async ({ params }: InviteCodePageProps) => {
    const { inviteCode } = params;
    if (!inviteCode) {
        redirect("/");
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return redirectToSignIn();
    }

    // -------------- Check if user is already the server -------------------
    const existingServer = await prisma.server.findFirst({
        where: {
            inviteCode,
            members: {
                some: {
                    profileId: currentUser.id,
                },
            },
        },
    });

    if (existingServer) {
        // console.log("User already exists in the server");
        redirect(`/servers/${existingServer.id}`);
    }

    // ---------------- Server not found ----------------------

    const server = await prisma.server.update({
        where: {
            inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: currentUser.id
                    },
                ],
            },
        },
    });

    if (server) {
        //console.log("User added to the server");
        redirect(`/servers/${server.id}`);
    }

    return null;
};

export default InviteCodePage;
