"use client";
import React, { useState } from "react";
import queryString from "query-string";
import axios from "axios";

import useSeverStore from "@/hooks/use-server-store";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {  CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";


const DeleteMessageModal = () => {
    const { type, data, isOpen, onClose } = useSeverStore();

    const isModalOpen = isOpen && type === "deleteMessage";
    const { apiUrl, query } = data;

    const [loading, setLoading] = useState(false);


    const handleLeaveServer = async () => {

        if (!apiUrl) {
            throw new Error("API URL not found");
        }

        try {
            setLoading(true);
            const url = queryString.stringifyUrl({
                url: apiUrl,
                query
            })

            await axios.delete(url);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-stone-100 text-stone-900 p-0 overflow-hidden" crossMount>
                <DialogHeader className="px-6 pt-5 pb-2">
                    <DialogTitle className="text-center text-xl sm:text-2xl text-stone-900">
                        Delete Message
                    </DialogTitle>
                    <DialogDescription className="text-center text-base text-rose-500/80">
                        You can't undo this action. Are you sure you want to delete this message?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex space-x-2 px-6 py-3 items-center bg-zinc-200">
                    <Button className="w-full text-lg bg-red-400 hover:bg-red-600 hover text-stone-100" onClick={handleLeaveServer}>
                        {!loading &&(<div className="flex items-center gap-2"><CircleAlert className="w-[18px] h-[18px] ml-2" /> Yes</div>)}
                        {loading && <LoaderCircle className="w-[18px] h-[18px] animate-spin duration-300 ml-2" />}
                    </Button>
                    <Button className="w-full text-lg bg-blue-600 hover:bg-blue-700 text-stone-50 font-semibold" onClick={onClose}>
                        <div className="flex items-center gap-2"><CircleCheck className="w-[18px] h-[18px] ml-2" /> No</div>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteMessageModal;
