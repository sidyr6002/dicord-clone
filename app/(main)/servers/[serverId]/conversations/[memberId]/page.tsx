import React from "react";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";
import { getConversation } from "@/lib/conversations";
import ChatHeader from "@/components/chat/chat-header";

interface MemberConversationsPageParams {
    serverId: string;
    memberId: string;
}

interface MemberConversationsPageProps {
    params: MemberConversationsPageParams;
}

const MemberConversationsPage = async ({
    params,
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

    const conversation = await getConversation(
        currentMember.id,
        memberId
    );

    if (!conversation) {
        return redirect(`servers/${serverId}`);
    }

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.id === currentMember.id ? memberTwo : memberOne;

    return (
        <div className="h-full w-full flex flex-col">
            <ChatHeader
                name={otherMember.profile.name}
                imageURL={otherMember.profile.imageURL}
                serverId={serverId}
                type="conversation"
            />
        </div>
    );
};

export default MemberConversationsPage;
