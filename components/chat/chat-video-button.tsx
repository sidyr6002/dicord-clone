"use client";
import React from "react";
import { ActionTooltip } from "../action-tooltip";
import { Video, VideoOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

const ChatVideoButton = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const isVideo = searchParams?.get("video");

    const onClick = () => {
        const url = queryString.stringifyUrl(
            {
                url: pathname || "",
                query: {
                    video: isVideo ? undefined : true,
                },
            },
            { skipNull: true }
        );

        router.push(url);
    };

    const Icon = isVideo ? Video : VideoOff;
    const label = isVideo ? "Stop video" : "Start video";

    return (
        <ActionTooltip label={label} side="bottom" align="center">
            <button
                onClick={onClick}
                className="hover:opacity-80 transition mr-4"
            >
                <Icon className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
            </button>
        </ActionTooltip>
    );
};

export default ChatVideoButton;
