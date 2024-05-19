"use client";
import React, { useEffect, useState } from "react";

import CreateServerModal from "@/components/modal/create-server-modal";
import InviteModal from "@/components/modal/invite-modal";
import EditServerModal from "@/components/modal/edit-server-modal";
import ManageMembersModal from "../modal/manage-members-modal";
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
        </>
    );
};

export default ServerModalProvider;
