"use client";
import React, { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
    chatId: string;
    audio: boolean;
    video: boolean;
}

const MediaRoom = ({ chatId, audio, video }: MediaRoomProps) => {
    const { user } = useUser();
    const [token, setToken] = useState("");

    useEffect(() => {
        if (!user?.firstName || !user?.lastName) {
            return;
        }

        const username = `${user.firstName} ${user.lastName}`;

        (async () => {
            try {
                const resp = await fetch(
                    `/api/livekit?room=${chatId}&username=${username}`
                );
                const data = await resp.json();
                setToken(data.token);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [user?.firstName, user?.lastName, chatId]);

    if (token === "") {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-y-2">
                <Loader2 className="w-8 h-8 text-zinc-400/85 dark:text-zinc-500/85 animate-spin" />
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Getting token...
                </p>
            </div>
        );
    }

    return (
        <LiveKitRoom
            video={video}
            audio={audio}
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            // Use the default LiveKit theme for nice styles.
            data-lk-theme="default"
            style={{ width: "100%", height: "50%", flex: 1 }}
        >
            <VideoConference style={{ width: "100%", height: "100%" }} />
        </LiveKitRoom>
    );
};

export default MediaRoom;
