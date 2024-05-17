"use client";
import React from "react";
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
import { saveServerData } from "@/app/actions/save-server-data";
import useSeverStore from "@/hooks/use-server-store";

const CreateServerModal = () => {
    const { type, isOpen, onClose } = useSeverStore();
    const isModalOpen = isOpen && type === "createServer";
    
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serverName: "",
            serverImage: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const res = await saveServerData(values);
        if (res.error) {
            console.error(res.error);
            return;
        }

        console.log(res.data);
        form.reset();
        router.refresh();
        onClose();
    };

    const handleClose = () => {
        form.reset();
        onClose(); 
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-stone-100 text-stone-900 ">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl sm:text-2xl text-blue-600">
                        Customize your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-xs sm:text-sm text-stone-700/80">
                        Give your server personality with a name and an image.
                        You can always change these settings later.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3"
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
                                <FormItem>
                                    <FormLabel className="sr-only">
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter the name of your server"
                                            className="h-7 sm:h-9 bg-stone-500/90 text-stone-100 border-none text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-stone-200/80 focus-visible:ring-blue-600/60 focus-visible:ring-offset-0 focus:bg-stone-800 autofill:bg-stone-800 transition-all shadow-inner shadow-stone-500/55"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="">
                            <Button
                                size="sm"
                                type="submit"
                                className="h-7 sm:h-9 bg-blue-600 text-stone-50 text-[10px] sm:text-xs hover:bg-blue-600/90"
                            >
                                Save & Next
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateServerModal;
