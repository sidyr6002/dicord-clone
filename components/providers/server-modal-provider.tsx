"use client";
import React, { useEffect, useState } from "react";

import InviteModal from "@/components/modal/invite-modal";
import CreateServerModal from "@/components/modal/create-server-modal";
import EditServerModal from "@/components/modal/edit-server-modal";
import LeaveServerModal from "@/components/modal/leave-server-modal";
import DeleteServerModal from "@/components/modal/delete-server-modal";
import CreateChannelModal from "@/components/modal/channels/create-channel-modal";
import EditChannelModal from "@/components/modal/channels/edit-channel-modal";
import DeleteChannelModal from "@/components/modal/channels/delete-channel-modal";
import ManageMembersModal from "@/components/modal/manage-members-modal";
import MessageFileModal from "@/components/modal/messages/message-file-modal";
const ServerModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <InviteModal />
            <CreateServerModal />
            <EditServerModal />
            <LeaveServerModal />
            <DeleteServerModal />
            <CreateChannelModal />
            <EditChannelModal />
            <DeleteChannelModal />
            <ManageMembersModal />
            <MessageFileModal />
        </>
    );
};

export default ServerModalProvider;
