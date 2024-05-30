import ChatHeader from "@/components/chat/chat-header";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

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
        </div>
    );
};

export default ChannelIdPage;
