"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import queryString from "query-string";
import axios from "axios";
import useServerStore from "@/hooks/use-server-store";

import { Member, MemberRole, Profile } from "@prisma/client";
import { messageEditSchema } from "@/schema/form-schema";
import { Edit, File, ShieldAlert, ShieldCheck, Trash } from "lucide-react";

import UserAvatar from "@/components/user-avatar";
import { ActionTooltip } from "../action-tooltip";
import Image from "next/image";
import { cn } from "@/lib/utils";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button }  from "@/components/ui/button"


interface ChatItemProps {
    id: string;
    content: string;
    member: Member & { profile: Profile };
    currentMember: Member;
    timestamp: string;
    fileURL: string | null;
    deleted: boolean;
    isUpdated: boolean;
    socketURL: string;
    socketQuery: Record<string, string>;
}

const iconMap = {
    [MemberRole.ADMIN]: (
        <ShieldAlert className="w-4 h-4 ml-auto text-rose-500" />
    ),
    [MemberRole.MODERATOR]: (
        <ShieldCheck className="w-4 h-4 ml-auto text-blue-500 dark:text-blue-400" />
    ),
    [MemberRole.USER]: null,
};

const ChatItem = ({
    id,
    content,
    member,
    currentMember,
    timestamp,
    fileURL,
    deleted,
    isUpdated,
    socketURL,
    socketQuery,
}: ChatItemProps) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const { onOpen } = useServerStore();

    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === "Escape" || event.key === "Esc") {
                setIsEditing(false);
            }
        }

        window.addEventListener("keydown", handleKeydown);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
        }
    }, [])

    const form = useForm<z.infer<typeof messageEditSchema>>({
        resolver: zodResolver(messageEditSchema),
        defaultValues: {
            message: content
        }
    })

    const isLoading = form.formState.isSubmitting;
    const onMessageEdit = async (data: z.infer<typeof messageEditSchema>) => {
        if (!data.message || data.message === content) {
            setIsEditing(false);
            return;
        }

        try {
            const url = queryString.stringifyUrl({
                url: `${socketURL}/${id}`,
                query: socketQuery
            });
            
            await axios.patch(url, data);

            form.reset();
            setIsEditing(false);
        } catch (error) {
            console.error("[ChatItem]", error);
        }
    }

    const onMemberClick = () => {
        if (member.id === currentMember.id) {
            return;
        }

        window.open(`/servers/${member.serverId}/conversations/${member.id}`)
    }

    useEffect(() => {
        form.reset({ message: content });
    }, [content]);


	const isAdmin = currentMember.role === MemberRole.ADMIN;
	const isModerator = currentMember.role === MemberRole.MODERATOR;
	const isOwner = currentMember.id === member.id;	

	const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
	const canUpdateMessage = !deleted && isOwner && !fileURL;

	const fileType = fileURL?.split(".").pop();

	const isPDF = fileURL && fileType === "pdf";
	const isImage = fileURL && !isPDF;


    return (
        <div className="py-5 px-4 group relative flex items-center w-full hover:bg-stone-950/5 hover:dark:bg-stone-950/10 transition-all duration-200">
            <div className="group flex gap-x-2 items-start w-full">
                <div className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar
                        src={ member.profile.imageURL ? member.profile.imageURL : "" }
                        onClick={onMemberClick}
                        className="md:w-7 md:h-7"
                    />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-1">
                        <div className="flex items-center gap-x-2">
                            <p
                                className="text-sm font-medium cursor-pointer hover:underline hover:underline-offset-2"
                                onClick={onMemberClick}
                            >
                                {member.profile.name}
                            </p>
                            <ActionTooltip
                                label={member.role}
                                side="top"
                                align="center"
                            >
                                <p>{iconMap[member.role]}</p>
                            </ActionTooltip>
                        </div>
                        <span className="text-xs tracking-tighter text-zinc-400/70 dark:text-zinc-500/70">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a
                            href={fileURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative mt-2 flex items-center rounded-md overflow-hidden border bg-neutral-500/70 dark:bg-neutral-900/70 h-52 w-full"
                        >
                            <Image
                                src={fileURL}
                                alt={content}
                                fill
                                sizes="100vw"
                                className="object-contain"
                            />
                        </a>
                    )}
                    {isPDF && (
                        <div className="mt-2 relative max-w-full w-fit flex overflow-clip items-center p-2 rounded-md bg-neutral-400/50 dark:bg-neutral-900/40">
                            <File className="w-9 h-9 block text-blue-600 dark:text-blue-500 fill-slate-300 flex-shrink-0" />
                            <a
                                href={fileURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-600 dark:text-blue-500/80 hover:underline"
                            >
                                <p className="text-sm truncate">{content}</p>
                            </a>
                        </div>
                    )}
                    {!fileURL && !isEditing && (
                        <p
                            className={cn(
                                "mt-1 text-sm text-zinc-600 dark:text-zinc-300/80",
                                deleted && "mt-2 italic text-zinc-500 dark:text-zinc-400 text-xs"
                            )}
                        >
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}
                    {!fileURL && isEditing && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onMessageEdit)} className="flex items-center w-full mt-1 gap-x-2">
                                <FormField 
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem className="flex-grow">
                                            <FormControl>
                                                <div className="w-full relative">
                                                    <Input 
                                                        disabled={isLoading}
                                                        placeholder="Edit your message"
                                                        className="border-none p-2 bg-neutral-900/40 dark:bg-neutral-950/60 focus:bg-neutral-800/40 focus:dark:bg-neutral-900/70 text-stone-800 dark:text-stone-200 active:border-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-none"
                                                        {...field} 
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500 text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <Button size="sm" disabled={isLoading} className="border-none bg-blue-500 px-3 py-1.5 h-8 hover:bg-blue-600 text-zinc-200" onSubmit={form.handleSubmit(onMessageEdit)}>
                                    Save
                                </Button>
                            </form>
                            <span className="text-[10px] mt-1 text-zinc-500/75 dark:text-zinc-600">
                                Press esc to cancel, and enter to save
                            </span>
                        </Form>
                    )

                    }
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute px-2 py-1 rounded-md -top-2 right-5 bg-stone-100 dark:bg-neutral-800">
                    {canDeleteMessage && (
                        <button
                            type="button"
                            onClick={() => onOpen("deleteMessage", {
                                apiUrl: `${socketURL}/${id}`,
                                query: socketQuery
                            })}
                        >
                            <ActionTooltip
                                label="Delete Message"
                                side="top"
                                align="center"
                            >
                                <Trash className="w-4 h-4 text-red-400 hover:text-red-600 transition" />
                            </ActionTooltip>
                        </button>
                    )}
                    {canUpdateMessage && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                        >
                            <ActionTooltip
                                label="Edit Message"
                                side="top"
                                align="center"
                            >
                                <Edit className="w-4 h-4 text-blue-400 hover:text-blue-600 transition" />
                            </ActionTooltip>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatItem;
