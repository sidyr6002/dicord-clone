"use client";
import React, { Fragment, useRef, ElementRef, useEffect } from "react";
import { useChatQuery } from "@/hooks/use-chat-query";
import { format } from 'date-fns'

import { Member } from "@prisma/client";
import { MessageWithMemberWithProfile } from "@/types";

import ChatWelcome from "@/components/chat/chat-welcome";
import { ArrowUp, Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./chat-item";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

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
    const addKey = `chat:${chatId}:messages`
    const updateKey = `chat:${chatId}:messages:update`

    const chatRef = useRef<ElementRef<"div">>(null);
    const bottomRef = useRef<ElementRef<"div">>(null);

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

    useChatSocket({
        addKey,
        updateKey,
        queryKey
    })
    
    useChatScroll({
        chatRef,
        bottomRef,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        loadMore: fetchNextPage,
        count: data?.pages[0]?.items?.length ?? 0
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

    // useEffect(() => {
    //     const topDiv = chatRef?.current;

    //     const handleScroll = () => {
    //         const scrollTop = topDiv?.scrollTop;

    //         console.log("topDiv Scroll", topDiv?.scrollTop);

    //         if (scrollTop === 0 && !isFetchingNextPage && !!hasNextPage) {
    //             fetchNextPage();
    //         }
    //     }

    //     topDiv?.addEventListener("scroll", handleScroll);

    //     return () => {
    //         topDiv?.removeEventListener("scroll", handleScroll);
    //     }


    // }, [chatRef]);


    return (
        <div
            ref={chatRef}
            className="flex-1 flex flex-col py-4 overflow-y-auto"
        >
            {!hasNextPage && <div className="flex-1" />}
            {!hasNextPage && <ChatWelcome name={name} type={type} />}
            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage ? (
                        <Loader2 className="w-6 h-6 animate-spin text-zinc-400/85 dark:text-zinc-500/85" />
                    ) : (
                        <button className="flex group gap-x-2 items-center mt-2 mb-4 text-sm font-medium text-zinc-400 dark:text-zinc-500/85 hover:text-zinc-500/85 hover:dark:text-zinc-500 transtion-all duration-100" onClick={() => fetchNextPage()}>
                            <ArrowUp className="w-4 h-4 text-zinc-400/85 dark:text-zinc-500/85 group-hover:text-blue-500/85 group-hover:dark:text-blue-500 transition" />
                            Load previous messages
                        </button>
                    )}
                </div>
            )}
            <div className="flex flex-col-reverse">
                {data?.pages?.map((page, index) => (
                    <Fragment key={index}>
                        {page?.items?.map(
                            (message: MessageWithMemberWithProfile) => (
                                <ChatItem
                                    key={message.id}
                                    id={message.id}
                                    member={message.member}
                                    currentMember={member}
                                    content={message.content}
                                    fileURL={message.fileURL}
                                    deleted={message.deleted}
                                    timestamp={format(
                                        new Date(message.createdAt),
                                        DATE_FORMAT
                                    )}
                                    isUpdated={
                                        message.createdAt !== message.updatedAt
                                    }
                                    socketURL={socketURL}
                                    socketQuery={socketQuery}
                                />
                            )
                        )}
                    </Fragment>
                ))}
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

export default ChatMessages;
