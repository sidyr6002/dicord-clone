"use client";
import React from "react";
import { ServerWithChannelesWithMembers } from "@/types";
import { MemberRole } from "@prisma/client";

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
                <button className="w-full px-3 text-base font-semibold capitalize h-10 flex items-center justify-between bg-stone-300/60 dark:bg-stone-700/80 border-b-2 border-stone-300 dark:border-stone-700 shadow-md hover:bg-neutral-400/30 dark:hover:bg-zinc-700/80 transition-colors duration-150">
                    {server.name}
                    <ChevronDown className="w-4 h-4 ml-auto" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 text-xs py-2 text-black dark:text-neutral-400 space-y-2">
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
                    <DropdownMenuItem className="text-sm px-2 py-1">
                        Server Settings
                        <Settings className="w-4 h-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem className="text-sm px-2 py-1">
                        Manage Members
                        <Users className="w-4 h-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem className="text-sm px-2 py-1">
                        Create Channel
                        <PlusCircle className="w-4 h-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && <DropdownMenuSeparator />}
                {isAdmin && (
                    <DropdownMenuItem className="text-sm text-rose-600 px-2 py-1">
                        Delete Channel
                        <Trash2 className="w-4 h-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem className="text-sm px-2 py-1">
                        Leave Channel
                        <ArrowRight className="w-4 h-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ServerHeader;
