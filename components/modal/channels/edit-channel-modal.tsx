"use client";
import React, { useEffect, useLayoutEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { channelFormSchema as formSchema } from "@/schema/form-schema";
import { ChannelType } from "@prisma/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import useSeverStore from "@/hooks/use-server-store";
import { toast } from "react-toastify";
import { editChannel } from "@/app/actions/channel/edit-channel";

const EditChannelModal = () => {
    const { type, data, isOpen, onClose } = useSeverStore();
    const isModalOpen = isOpen && type === "editChannel";
    const { server, channel } = data;
    
    const router = useRouter();
    const params = useParams();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            channelName: channel ? channel.name : "",
            channelType: channel ? channel.type : ChannelType.TEXT,
        },
    });

    useEffect(() => {
        if(channel) {
            form.setValue("channelName", channel.name);
            form.setValue("channelType", channel.type);
        }
    }, [channel, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const res = await editChannel(server?.id, channel?.id, values.channelName, values.channelType);

            if (res.error) {
                console.error(res.error);
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
            console.error("[CreateServerModal]", error);
        } finally {
            form.reset()
            router.refresh();
            onClose();
        }
    };

    if (params?.serverId !== server?.id) {
        return null;
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-stone-100 text-stone-900 p-0">
                <DialogHeader className="mt-5">
                    <DialogTitle className="text-center text-xl sm:text-2xl text-blue-600">
                        Edit Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3"
                    >
                        <FormField
                            control={form.control}
                            name="channelName"
                            render={({ field }) => (
                                <FormItem className="space-y-1 mx-6">
                                    <FormLabel className="uppercase text-[11px] font-semibold text-blue-700">
                                        Channel Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Channel Name"
                                            autoComplete="off"
                                            autoFocus={false}
                                            className="h-8 sm:h-9 bg-neutral-500/40 text-stone-800 focus-visible:text-stone-100 border-none text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-stone-600 focus-visible:placeholder:text-stone-400/80 focus-visible:ring-0 focus-visible:ring-offset-0 focus:bg-neutral-800 transition-all duration-150 shadow-inner shadow-stone-600/55"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="channelType"
                            render={({ field }) => (
                                <FormItem className="space-y-1 mx-6">
                                    <FormLabel className="uppercase text-[11px] font-semibold text-blue-700">
                                        Channel Type
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="h-8 sm:h-9 bg-neutral-500/40 text-stone-950 shadow-inner shadow-stone-700/55 border-none focus:ring-0 focus:ring-offset-0">
                                                <SelectValue placeholder="Select Channel Type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-neutral-300 text-stone-900 border-none">
                                                <SelectGroup>
                                                    <SelectItem value={ChannelType.TEXT} className="focus:bg-neutral-500/50 focus:text-blue-800">Text</SelectItem>
                                                    <SelectItem value={ChannelType.AUDIO} className="focus:bg-neutral-500/50 focus:text-blue-800">Audio</SelectItem>
                                                    <SelectItem value={ChannelType.VIDEO} className="focus:bg-neutral-500/50 focus:text-blue-800">Video</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />

                        <DialogFooter style={{ marginTop: "30px"}} className="bg-zinc-200/90 rounded-b-2xl">
                            <Button
                                size="sm"
                                type="submit"
                                className="h-8 sm:h-9 mx-6 my-3 bg-blue-600 text-stone-50 text-[10px] sm:text-sm hover:bg-blue-600/90"
                            >
                                Save Edits
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditChannelModal;
