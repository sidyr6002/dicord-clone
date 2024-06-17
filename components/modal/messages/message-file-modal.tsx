"use client";
import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {  messageFormSchema } from "@/schema/form-schema";
import qs from 'query-string';

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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import FileUploader from "@/components/file-uploader";
import { saveServerData } from "@/app/actions/server/save-server-data";
import { useRouter } from "next/navigation";
import useServerStore from "@/hooks/use-server-store";
import axios from "axios";

const MessageFileModal = () => {
    const { type, data, isOpen, onClose } = useServerStore();
    const router = useRouter();

    const isModalOpen = isOpen && type === "messageFile";
    const { apiUrl, query } = data;

    const form = useForm<z.infer<typeof messageFormSchema>>({
        resolver: zodResolver(messageFormSchema),
        defaultValues: {
            fileURL: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof messageFormSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            })

            await axios.post(url, {
                ...values,
                message: values.fileURL
            });

            router.refresh();
            handleClose();
        } catch (error) {
            console.error("[MessageFileModal]", error);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-stone-100 text-stone-900 p-0 overflow-hidden">
                <DialogHeader className="p-4">
                    <DialogTitle className="text-center text-xl sm:text-2xl text-blue-600">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-xs sm:text-sm text-stone-700/80">
                        Send a message with an attachment
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="fileURL"
                            render={({ field }) => (
                                <FormItem className="mx-10">
                                    <FormLabel className="sr-only">
                                        Image
                                    </FormLabel>
                                    <FormControl>
                                        <FileUploader
                                            onChange={field.onChange}
                                            value={field.value}
                                            endpoint="messageFile"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="bg-zinc-200 px-6 py-3">
                            <Button
                                size="sm"
                                type="submit"
                                className="w-full h-8 sm:h-9 bg-blue-600 disabled:bg-blue-400 text-stone-50 text-[10px] sm:text-xs hover:bg-blue-600/90"
                                disabled={isLoading}
                            >
                                Submit
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default MessageFileModal;
