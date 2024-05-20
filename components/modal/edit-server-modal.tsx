"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "@/schema/form-schema";

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

import FileUploader from "../file-uploader";
import useSeverStore from "@/hooks/use-server-store";
import { editServerData } from "@/app/actions/server/edit-server-data";

const EditServerModal = () => {
    const { type, data, isOpen, onClose } = useSeverStore();
    const { server } = data;
    const isModalOpen = isOpen && type === "editServer";

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serverName: "",
            serverImage: "",
        },
    });

    useEffect(() => {
        if(server) {
            form.reset({
                serverName: server.name,
                serverImage: server.imageURL,
            });
        }
    }, [server, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const res = await editServerData(server?.id, values);
            if (res.error) {
                console.error(res.error);
                return;
            }
    
            console.log(res.data);
            router.refresh();
            onClose();
        } catch (error) {
            console.error("[CreateServerModal]", error);
        }
    };

    const handleClose = () => {
        if(server) {
            form.setValue("serverName", server.name);
            form.setValue("serverImage", server.imageURL);
        }
        onClose(); 
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-stone-100 text-stone-900 p-0">
                <DialogHeader className="mt-6">
                    <DialogTitle className="text-center text-xl sm:text-2xl text-blue-600">
                        Change Server Settings
                    </DialogTitle>
                    <DialogDescription className="text-center text-xs sm:text-sm text-stone-700/80">
                        If you do not like how your server looks, you can change it
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-2"
                    >
                        <FormField
                            control={form.control}
                            name="serverImage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="sr-only">
                                        Image
                                    </FormLabel>
                                    <FormControl>
                                        <FileUploader
                                            onChange={field.onChange}
                                            value={field.value}
                                            endpoint="serverImage"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="serverName"
                            render={({ field }) => (
                                <FormItem className="space-y-1 mx-6">
                                    <FormLabel className="text-xs uppercase font-semibold text-blue-600">
                                        Server Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter the name of your server"
                                            className="h-8 sm:h-9 bg-neutral-500/40 text-stone-800 focus-visible:text-stone-100 border-none text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-stone-600 focus-visible:placeholder:text-stone-400/80 focus-visible:ring-0 focus-visible:ring-offset-0 focus:bg-neutral-800 autofill:bg-stone-800 transition-all shadow-inner shadow-stone-600/55"
                                            autoComplete="off"
                                            autoFocus={false}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />
                        <DialogFooter style={{ marginTop: '24px' }} className="bg-zinc-200 rounded-b-2xl ">
                            <Button
                                size="sm"
                                type="submit"
                                className="h-8 sm:h-9 mx-6 my-3 bg-blue-600 text-stone-50 text-[10px] sm:text-xs hover:bg-blue-600/90"
                            >
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditServerModal;
