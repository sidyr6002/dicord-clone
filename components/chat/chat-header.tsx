import React from "react";

import MobileToggle from "@/components/mobile-toggle";
import UserAvatar from "@/components/user-avatar";
import SocketIndicatior from "@/components/socket-indicator";
import { Hash } from "lucide-react";
import ChatVideoButton from "./chat-video-button";

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    imageURL?: string;
}

const ChatHeader = ({ serverId, name, type, imageURL }: ChatHeaderProps) => {
    return (
        <div className="font-semibold text-md h-9 flex flex-shrink-0 items-center pr-2 md:px-3 border-b-2 border-stone-500/50 dark:border-stone-500/45">
            <MobileToggle serverId={serverId} />
            {type === "channel" && (
                <Hash className="w-4 h-4 text-zinc-500/90 dark:text-zinc-300/60 mr-2" />
            )}
            {type === "conversation" && (
                <UserAvatar src={imageURL} className="md:w-6 md:h-6 mr-2" />
            )}
            <p className="font-semibold text-md text-stone-900 dark:text-stone-200">
                {name}
            </p>
            <div className="ml-auto flex items-center">
                {type === "conversation" && (
                    <ChatVideoButton />
                )}
                <SocketIndicatior />
            </div>
        </div>
    );
};

export default ChatHeader;
