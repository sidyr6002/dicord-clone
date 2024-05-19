"use client";
import React, { useState } from "react";
import useOrigin from "@/hooks/use-origin";
import useSeverStore from "@/hooks/use-server-store";
import { generateNewInvitelink } from "@/app/actions/genereate-new-invitelink";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleCheckBig, Copy, RotateCcw } from "lucide-react";


const InviteModal = () => {
    const { type, data, isOpen, onOpen, onClose } = useSeverStore();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invitePeople";
    const { server } = data;
    const inviteURL = `${origin}/invite/${server?.inviteCode}`;

    const [copied, setCopied] = useState(false);
    const [newLinkLoading, setNewLinkLoading] = useState(false);
    const copyInviteURL = () => {
        navigator.clipboard.writeText(inviteURL);
        setCopied(true);

        setTimeout(() => setCopied(false), 1000);
    }

    const generateNewLink =  async () => {
        try {
            setNewLinkLoading(true);
            const res = await generateNewInvitelink(server?.id);
            if (res.error) {
                console.log(res.error);
                return;
            }

            onOpen("invitePeople", { server: res.data });
        } catch (error) {
            console.log(error);
        } finally {
            setNewLinkLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-stone-100 text-stone-900" crossMount>
                <DialogHeader>
                    <DialogTitle className="text-center text-xl sm:text-2xl text-blue-600">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="pl-2">
                    <Label className="uppercase text-xs font-semibold text-stone-900">
                        Server Invite Link
                    </Label>
                    <div className="mt-2 flex">
                        <Input
                            readOnly
                            className="bg-neutral-400/60 text-stone-950 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={inviteURL}
                            autoFocus={false}
                        />
                        <Button
                            size="icon"
                            className="hover:text-blue-700 group"
                            disabled={newLinkLoading}
                            onClick={() => copyInviteURL()}
                        >
                            {copied ? (
                                <CircleCheckBig className="w-4 h-4 text-green-700 animate-in" />
                            ) : (
                                <Copy className="w-4 h-4 transition-transform duration-100 transform group-hover:scale-110" />
                            )}
                        </Button>
                    </div>
                    <Button
                        variant="link"
                        size="sm"
                        className="p-0 mt-2 text-stone-900/80 text-xs"
                        disabled={newLinkLoading}
                        onClick={generateNewLink}
                    >
                        Generate New Link
                        <RotateCcw className="w-3 h-3 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InviteModal;
