"use client";
import React, { Fragment } from "react";
import { useChatQuery } from "@/hooks/use-chat-query";
import { format } from 'date-fns'

import { Member } from "@prisma/client";
import { MessageWithMemberWithProfile } from "@/types";

import ChatWelcome from "@/components/chat/chat-welcome";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./chat-item";

const DATE_FORMAT = "d MMM yyyy, HH:mm"
interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiURL: string;
    socketURL: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

const ChatMessages = ({
    name,
    member,
    chatId,
    apiURL,
    socketURL,
    socketQuery,
    paramKey,
    paramValue,
    type,
}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`

    const { 
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useChatQuery({
        apiURL,
        queryKey,
        paramKey,
        paramValue
    })

    if (status === "pending") {
        return (
            <div className="flex-grow flex flex-col gap-y-2 justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400/85 dark:text-zinc-500/85" />
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 ">Loading messages...</p>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="flex-grow flex flex-col gap-y-2 justify-center items-center">
                <ServerCrash className="w-8 h-8 text-rose-400/85 dark:text-rose-500/85" />
                <p className="text-sm font-medium text-rose-400 dark:text-rose-500 ">Something went wrong! Please try again later.</p>
            </div>
        )
    }

    return (
        <div className="flex-grow flex flex-col py-4 overflow-y-auto">
            <div className="flex-1"/>
            <ChatWelcome name={name} type={type} />
            <div className="flex flex-col-reverse">
                {
                    data?.pages?.map((page, index) => (
                        <Fragment key={index}>
                            {
                                page?.items?.map((message: MessageWithMemberWithProfile) => (
                                    <ChatItem 
                                        key={message.id}
                                        id={message.id}
                                        member={message.member}
                                        currentMember={member}
                                        content={message.content}
                                        fileURL={message.fileURL}
                                        deleted={message.deleted}
                                        timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                        isUpdated={message.createdAt !== message.updatedAt}
                                        socketURL={socketURL}
                                        socketQuery={socketQuery}
                                    />
                                ))
                            }
                        </Fragment>
                    ))
                }
            </div>
        </div>
    );
};

export default ChatMessages;
