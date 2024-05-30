import React from "react";
import prisma from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";

import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

import ServerSideBar from "@/components/server/server-sidebar";

interface ServerIdPageParams {
    serverId: string;
}

interface ServerIdLayoutProps {
    params: ServerIdPageParams;
    children: React.ReactNode;
}

const ServerIdLayout = async ({
    params,
    children,
}: ServerIdLayoutProps) => {
    const { serverId } = params;
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
            <div className="min-h-screen h-full w-56 hidden md:block fixed">
                <ServerSideBar serverId={serverId}/>
            </div>
            <main className="h-full ml-0 md:ml-56 flex">
                {children}
            </main>
        </div>
    );
};

export default ServerIdLayout;
