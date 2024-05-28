"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";

import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";

import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import useServerStore from "@/hooks/use-server-store";

interface ServerChannelProps {
    channel: Channel;
    server: Server;
    role?: MemberRole;
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
};

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
    const {onOpen} = useServerStore();
    const params = useParams();
    const router = useRouter();

    const Icon = iconMap[channel.type];

    const handleChannelEdit = () => {
        console.log("Edit Channel, in", server.name, ", named as", channel.name);
        onOpen("editChannel", { server, channel });
    }

    const handleChannelDelete = () => {
        console.log("Delete Channel, in", server.name, ", named as", channel.name);
        onOpen("deleteChannel", { server, channel });
    }

    return (
        <button className={cn("w-full group px-2 py-1 mb-1 rounded-md flex items-center gap-x-2 hover:bg-neutral-600/20 hover:dark:bg-stone-800/40 transition duration-200 ease-in", params?.channelId === channel.id && "bg-neutral-600/30 dark:bg-stone-800/60")}>
            <Icon className="flex-shrink-0 text-sm font-semibold w-4 h-4 text-neutral-700/60 dark:text-neutral-400/70"/>
            <p className={cn("max-w-28 truncate text-sm text-stone-800/70 dark:text-stone-300/70 group-hover:text-stone-800 group-hover:dark:text-stone-300 transition duration-150 ease-out", params?.channelId === channel.id && "text-stone-900 dark:text-stone-200 ho")}>{channel.name}</p>
            {
                channel.name !== "general" && role !== MemberRole.USER && (
                    <div className="ml-auto flex items-center gap-x-2">
                        <ActionTooltip label="Edit Channel" side="top" align="center">
                            <Edit className="hidden group-hover:block w-4 h-4 text-neutral-700/50 hover:text-neutral-800 dark:text-neutral-400/80 hover:dark:text-neutral-300 transition duration-150 ease-in-out" onClick={handleChannelEdit}/>
                        </ActionTooltip>
                        <ActionTooltip label="Delete Channel" side="top" align="center">
                            <Trash className="hidden group-hover:block w-4 h-4 text-neutral-700/50 hover:text-neutral-800 dark:text-neutral-400/80 hover:dark:text-neutral-300 transition duration-150 ease-in-out" onClick={handleChannelDelete}/>
                        </ActionTooltip>
                    </div>
                )
            }
            {
                channel.name === "general" && (
                    <Lock className="ml-auto w-3.5 h-3.5 text-neutral-700/50 group-hover:text-neutral-800 dark:text-neutral-400/80 group-hover:dark:text-neutral-300"/>
                )
            }
        </button>
    );
};

export default ServerChannel;
