"use client";
import React, { useState } from "react";
import useSeverStore from "@/hooks/use-server-store";
import { ServerWithChannelesWithMembers } from "@/types";
import { Loader2, UserCog, UserRoundX } from "lucide-react";
import { MemberRole } from "@prisma/client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { changeMemberRole, kickMember } from "@/app/actions/edit-member-data";
import { useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";


const ManageMembersModal = () => {
    const { type, data, isOpen, onOpen, onClose } = useSeverStore();
    const [loadingId, setLoadingId] = useState<string>("");
    const rounter = useRouter();

    const isModalOpen = isOpen && type === "manageMembers";
    const { server } = data as { server: ServerWithChannelesWithMembers};

    const handleRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);
            const res = await changeMemberRole(server.id, memberId, role);
            if (res.error) {
                console.log(res.error);
                return;
            }

            onOpen("manageMembers", { server: res.data });
            rounter.refresh();
        } catch (error) {
            console.log("[MANAGE_MEMBERS_MODAL]", error);
        } finally {
            setLoadingId("");
        }
    }

    const handleRemoveMember = async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const res = await kickMember(server.id, memberId);
            if (res.error) {
                console.log(res.error);
                return;
            }

            onOpen("manageMembers", { server: res.data });
            rounter.refresh();
        } catch (error) {
            console.log("[MANAGE_MEMBERS_MODAL]", error);
        } finally {
            setLoadingId("");
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-stone-100 text-stone-900">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl sm:text-2xl text-blue-600">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className="text-center text-neutral-500">
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="w-full max-h-[424px] px-3 py-2 bg-zinc-200 rounded-xl">
                    {server?.members?.map((member) => (
                        <div
                            key={member.id}
                            className="flex flex-row space-x-2 items-center py-1"
                        >
                            <UserAvatar
                                src={
                                    member.profile?.imageURL
                                        ? member.profile?.imageURL
                                        : ""
                                }
                            />
                            <div className="flex flex-col max-w-60 w-full">
                                <p className="text-sm font-semibold truncate text-stone-800">
                                    {member.profile?.name}
                                </p>
                                <p className="text-xs truncate text-neutral-500">
                                    {member.profile?.email}
                                </p>
                            </div>
                            <div className="flex-1 flex space-x-1 justify-end items-center">
                                <Badge className="h-6 bg-blue-500 hover:bg-blue-600 text-stone-100">
                                    {member.role}
                                </Badge>
                                {server.profileId !== member.profileId &&
                                    loadingId !== member.id && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="w-6 h-6 m-0 border-none bg-transparent hover:bg-transparent hover:text-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                    >
                                                        <UserCog className="w-4 h-4" />
                                                    </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                side="right"
                                                className="bg-stone-300 text-neutral-800 border-none"
                                            >
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger className="h-7 py-1 text-sm hover:text-stone-100 data-[state=open]:text-stone-100">
                                                        Role
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent className="bg-stone-300 text-neutral-800 border-none">
                                                            <DropdownMenuItem className="h-7 py-1" onClick={() => handleRoleChange(member.id, MemberRole.MODERATOR)}>
                                                                Moderator
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="h-7 py-1" onClick={() => handleRoleChange(member.id, MemberRole.USER)}>
                                                                User
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem className="h-7 py-1 text-rose-500" onClick={() => handleRemoveMember(member.id)}>
                                                        Kick{" "}
                                                        <UserRoundX className="w-4 h-4 ml-auto" />
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                {loadingId === member.id && (
                                    <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
                                )}
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ManageMembersModal;
