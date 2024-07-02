import React from "react";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";
import { getConversation } from "@/lib/conversations";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import MediaRoom from "@/components/media-room";

interface MemberConversationsPageParams {
    serverId: string;
    memberId: string;
}

interface MemberConversationsPageSearchParams {
    video?: boolean;
}

interface MemberConversationsPageProps {
    params: MemberConversationsPageParams;
    searchParams: MemberConversationsPageSearchParams;
}

const MemberConversationsPage = async ({
    params,
    searchParams,
}: MemberConversationsPageProps) => {
    const currentUser = await getCurrentUser();
    const { serverId, memberId } = params;

    if (!currentUser) {
        return redirectToSignIn();
    }

    const currentMember = await prisma.member.findFirst({
        where: {
            profileId: currentUser.id,
            serverId: serverId,
        },
        include: {
            profile: true,
        },
    });

    if (!currentMember) {
        return redirect("/");
    }

    const conversation = await getConversation(currentMember.id, memberId);

    // console.log("conversation", conversation);

    if (!conversation) {
        return redirect(`servers/${serverId}`);
    }

    const { memberOne, memberTwo } = conversation;

    const otherMember =
        memberOne.id === currentMember.id ? memberTwo : memberOne;

    return (
        <div className="h-full w-full flex flex-col">
            <ChatHeader
                name={otherMember.profile.name}
                imageURL={
                    otherMember.profile.imageURL
                        ? otherMember.profile.imageURL
                        : undefined
                }
                serverId={serverId}
                type="conversation"
            />
            {!searchParams.video && (
                <>
                    <ChatMessages
                        member={currentMember}
                        name={otherMember.profile.name}
                        chatId={conversation.id}
                        apiURL="/api/direct-messages"
                        type="conversation"
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        socketURL="/api/socket/direct-messages"
                        socketQuery={{
                            conversationId: conversation.id,
                        }}
                    />
                    <ChatInput
                        socketURL="/api/socket/direct-messages"
                        query={{
                            conversationId: conversation.id,
                        }}
                        name={otherMember.profile.name}
                        type="conversation"
                    />
                </>
            )}
            {searchParams.video && (
                <MediaRoom chatId={conversation.id} audio={true} video={true} />
            )}
        </div>
    );
};

export default MemberConversationsPage;
