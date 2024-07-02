"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";

import UserAvatar from "@/components/user-avatar";

interface ServerMemberProps {
    member: Member & { profile: Profile };
    server: Server;
}

const iconMap = {
    [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 ml-auto text-rose-500" />,
    [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 ml-auto text-blue-500 dark:text-blue-400" />,
    [MemberRole.USER]: null,
}

const ServerMember = ({ member, server }: ServerMemberProps) => {
    const params = useParams();
    const router = useRouter();

    const Icon = iconMap[member.role];

    const onClick = () => {
        router.push(`/servers/${server.id}/conversations/${member.id}`);
    }

    return (
        <button
            className={cn(
                "group w-full flex items-center gap-x-2 px-2 py-1 hover:bg-neutral-500/30 hover:dark:bg-stone-900/30 rounded-lg transition duration-150 ease-in",
                params?.memberId === member.id && "bg-neutral-500/40 dark:bg-stone-900/40 "
            )}
            onClick={onClick}
        >
            <UserAvatar
                src={member.profile.imageURL ? member.profile.imageURL : ""}
                className="md:w-5 md:h-5"
            />
            <p
                className={cn(
                    "text-sm font-medium max-w-[133px] truncate text-stone-800/70 dark:text-neutral-200/70 group-hover:text-stone-800 group-hover:dark:text-neutral-200 transition duration-150 ease-out",
                    params?.memberId === member.id && "text-stone-900 dark:text-neutral-100"
                )}
            >
                {member.profile.name}
            </p>
            {Icon}
        </button>
    );
};

export default ServerMember;
