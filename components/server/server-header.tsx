"use client";
import React from "react";
import { ServerWithChannelesWithMembers } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    ArrowRight,
    ArrowRightFromLine,
    ChevronDown,
    PlusCircle,
    Settings,
    Trash2,
    UserPlus2,
    Users,
} from "lucide-react";
import useServerStore from "@/hooks/use-server-store";

interface ServerHeaderProps {
    server: ServerWithChannelesWithMembers;
    role?: MemberRole;
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
    const {onOpen} = useServerStore();

    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="w-full px-3 h-9 focus:outline-none text-sm font-semibold capitalize flex items-center justify-between hover:bg-neutral-400/70 hover:dark:bg-stone-800/50 border-b-2 border-stone-600/80 dark:border-neutral-950/50 transition duration-150 ease-in-out">
                    <span className="truncate">{server.name}</span>
                    <ChevronDown className="w-[18px] h-[18px] ml-2" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 text-xs py-2 text-black dark:text-neutral-400 space-y-2">
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen("invitePeople", { server })}
                        className="text-sm text-blue-600 dark:text-blue-400 px-2 py-1"
                    >
                        Invite People
                        <UserPlus2 className="w-4 h-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("editServer", { server })}
                        className="text-sm px-2 py-1"
                    >
                        Server Settings
                        <Settings className="w-4 h-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("manageMembers", { server })}
                        className="text-sm px-2 py-1"
                    >
                        Manage Members
                        <Users className="w-4 h-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen("createChannel", { server })}
                        className="text-sm px-2 py-1"
                    >
                        Create Channel
                        <PlusCircle className="w-4 h-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && <DropdownMenuSeparator />}
                {isAdmin && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("deleteServer", { server })}
                        className="text-sm text-rose-600 px-2 py-1"
                    >
                        Delete Channel
                        <Trash2 className="w-4 h-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("leaveServer", { server })}
                        className="text-sm px-2 py-1"
                    >
                        Leave Channel
                        <ArrowRight className="w-4 h-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ServerHeader;
