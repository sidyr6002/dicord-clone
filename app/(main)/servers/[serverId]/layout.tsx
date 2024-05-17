import React from "react";
import prisma from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";

import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

import ServerSideBar from "@/components/server/server-sidebar";

const ServerIdLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { serverId: string };
}) => {
    const user = await getCurrentUser();

    if (!user) {
        return redirectToSignIn();
    }

    const server = await prisma.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: user.id,
                },
            },
        },
    });

    if (!server) {
        return redirect("/");
    }

    return (
        <div className="h-full">
            <div className="min-h-screen h-full w-52 fixed">
                <ServerSideBar serverId={params.serverId}/>
            </div>
            <main className="h-full ml-52 flex justify-center items-center">
                {children}
            </main>
        </div>
    );
};

export default ServerIdLayout;
