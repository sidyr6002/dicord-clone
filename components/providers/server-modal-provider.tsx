"use client";
import React, { useEffect, useState } from "react";
import CreateServerModal from "@/components/modal/create-server-modal";
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
        </>
    );
};

export default ServerModalProvider;
