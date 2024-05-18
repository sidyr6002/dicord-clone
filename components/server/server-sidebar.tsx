import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./server-header";

interface ServerSideBarProps {
    serverId: string;
}
const ServerSideBar = async ({ serverId }: ServerSideBarProps) => {
    const user = await getCurrentUser();
    if (!user) {
        return redirect("/");
    }

    const serverData = await prisma.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            }, 
            members: {
                include: {
                    profile: true
                }, 
                orderBy: {
                    role: 'asc'
                }
            }
        }
    })

    // console.log("User", user);
    // console.log("ServerData", serverData);

    const textChannels = serverData?.channels.filter((channel) => {
        return channel.type === ChannelType.TEXT
    })

    const audioChannels = serverData?.channels.filter((channel) => {
        return channel.type === ChannelType.AUDIO
    })

    const videoChannels = serverData?.channels.filter((channel) => {
        return channel.type === ChannelType.VIDEO
    })

    const members = serverData?.members.filter((member) => {
        return member.profileId !== user.id
    })
    
    if (!serverData) {
        return redirect("/");
    }

    const role = serverData.members.find((member) => member.profileId === user.id)?.role;



    return (
        <div className="h-full bg-zinc-300 dark:bg-neutral-700">
            <ServerHeader server={serverData} role={role}   />
        </div>
    );
};

export default ServerSideBar;
