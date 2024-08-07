import React from "react";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/db";

import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { ChannelType } from "@prisma/client";
import MediaRoom from "@/components/media-room";

interface ChannelIdPageParams {
    serverId: string;
    channelId: string;
}

interface ChannelIdPageProps {
    params: ChannelIdPageParams;
}
const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return redirectToSignIn();
    }

    const { serverId, channelId } = params;

    const channel = await prisma.channel.findUnique({
        where: {
            id: channelId
        }
    })

    const member = await prisma.member.findFirst({
        where: {
            profileId: currentUser.id,
            serverId: serverId
        }
    })

    if (!channel || !member) {
        return redirect("/");
    }

    return (
        <div className="flex flex-col h-full w-full">
            <ChatHeader
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />
            {channel.type === ChannelType.TEXT && (
                <>
                    <ChatMessages 
                        name={channel.name}
                        member={member}
                        chatId={channel.id}
                        apiURL="/api/messages"
                        socketURL="/api/socket/messages"
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                        type="channel"
                    />
                    <ChatInput
                        name={channel.name}
                        type="channel"
                        socketURL="/api/socket/messages"
                        query={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                    />
                </>
            )}
            {channel.type === ChannelType.AUDIO && (
                <MediaRoom 
                    chatId={channel.id}
                    audio={true}
                    video={false}
                />
            )}
            {channel.type === ChannelType.VIDEO && (
                <MediaRoom 
                    chatId={channel.id}
                    audio={false}
                    video={true}
                />
            )}
        </div>
    );
};

export default ChannelIdPage;
