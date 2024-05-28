"use client";
import React from "react";

import { Plus, Settings } from "lucide-react";

import { ServerWithChannelesWithMembers } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "@/components/action-tooltip";
import useServerStore from "@/hooks/use-server-store";

interface ServerSectionProps {
    label: string;
    role?: MemberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithChannelesWithMembers;
}

const ServerSection = ({
    label,
    role,
    sectionType,
    channelType,
    server,
}: ServerSectionProps) => {
    const { onOpen } = useServerStore();
    return (
        <div className="flex justify-between items-center py-1">
            <p className="font-semibold uppercase text-[10px] text-zinc-500 dark:text-gray-300/80">
                {label}
            </p>
            {role !== MemberRole.USER && sectionType === "channels" && (
                <ActionTooltip
                    label="Add new channel"
                    side="top"
                    align="center"
                >
                    <button 
                        onClick={() => onOpen("createChannel", { server, channelType })}
                        className="text-zinc-600/70 dark:text-gray-300/70 hover:text-blue-400 hover:dark:text-blue-600 transition ease-out duration-100"
                    >
                        <Plus className="w-3.5 h-3.5 " />
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.ADMIN && sectionType === "members" && (
                <ActionTooltip label="Manage members" side="top" align="center">
                    <button
                        onClick={() => onOpen("manageMembers", { server })}
                        className="text-zinc-600/70 dark:text-gray-300/70 hover:text-blue-400 hover:dark:text-blue-600 transition ease-out duration-100"
                    >
                        <Settings className="w-3.5 h-3.5 " />
                    </button>
                </ActionTooltip>
            )}
        </div>
    );
};

export default ServerSection;
