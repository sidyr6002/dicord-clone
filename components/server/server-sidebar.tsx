import React from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import ServerHeader from "./server-header";
import ServerSearchArea from "./server-search";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash, Mic, ShieldAlert, ShieldCheck, UserCog, Video } from "lucide-react";

interface ServerSideBarProps {
    serverId: string;
}

const channelIconMap = {
    [ChannelType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
    [ChannelType.AUDIO]: <Mic className="w-4 h-4 mr-2" />,
    [ChannelType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
};

const memberIconMap = {
    [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
    [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 mr-2 text-blue-400" />,
    [MemberRole.USER]: null,
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
        <div className="h-full flex flex-col bg-zinc-300 dark:bg-neutral-700">
            <ServerHeader server={serverData} role={role} />
            <ScrollArea className="flex-1 px-2">
                <div className="mt-2">
                    <ServerSearchArea data = {[
                        {
                            label: "Text Channels",
                            type: "channel",
                            data: textChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: channelIconMap[channel.type],
                            }))
                        }, 
                        {
                            label: "Audio Channels",
                            type: "channel",
                            data: audioChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: channelIconMap[channel.type],
                            }))
                        },
                        {
                            label: "Video Channels",
                            type: "channel",
                            data: videoChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: channelIconMap[channel.type],
                            }))
                        },
                        {
                            label: "Members",
                            type: "member",
                            data: members?.map((member) => ({
                                id: member.id,
                                name: member.profile.name,
                                icon: memberIconMap[member.role],
                            }))
                        }
                    ]}/>
                </div>
            </ScrollArea>
        </div>
    );
};

export default ServerSideBar;
