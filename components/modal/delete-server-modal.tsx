"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import useSeverStore from "@/hooks/use-server-store";
import { deleteSever } from "@/app/actions/server/delete-server";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {  CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";


const DeleteServerModal = () => {
    const { type, data, isOpen, onClose } = useSeverStore();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteServer";
    const { server } = data;

    const [loading, setLoading] = useState(false);


    const handleLeaveServer = async () => {
        console.log("Server", server?.id);
        try {
            setLoading(true);
            const res = await deleteSever(server?.id);

            if (res.error) {
                console.log(res.error);
                toast.error(res.error, {
                    position: "top-center",
                    autoClose: 2000,
                    closeButton: false,
                    hideProgressBar: true,
                });
                return;
            }

            toast.success(res.data, {
                position: "top-center",
                autoClose: 2000,
                closeButton: false,
                hideProgressBar: true,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            onClose();
            router.refresh();
            router.push("/");
            window.location.reload();
        }
    };


    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-stone-100 text-stone-900 p-0 overflow-hidden" crossMount>
                <DialogHeader className="px-6 pt-5 pb-2">
                    <DialogTitle className="text-center text-xl sm:text-2xl text-stone-900">
                        Delete Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-base text-rose-500/80">
                        You can't undo this action. Are you sure you want to delete <span className="font-semibold text-blue-500">{server?.name}</span>?
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

export default DeleteServerModal;
