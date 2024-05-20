"use client";
import React, { useEffect, useState } from "react";

import CreateServerModal from "@/components/modal/create-server-modal";
import InviteModal from "@/components/modal/invite-modal";
import EditServerModal from "@/components/modal/edit-server-modal";
import ManageMembersModal from "@/components/modal/manage-members-modal";
import CreateChannelModal from "@/components/modal/create-channel-modal";
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
            <CreateServerModal />
            <EditServerModal />
            <InviteModal />
            <ManageMembersModal />
            <CreateChannelModal />
        </>
    );
};

export default ServerModalProvider;
