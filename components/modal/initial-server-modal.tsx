"use client";
import React, { useEffect } from "react";

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
import { saveServerData } from "@/app/actions/server/save-server-data";
import { useRouter } from "next/navigation";


const InitialServerModal = () => {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serverName: "",
            serverImage: "",
        },
    });

    useEffect(() => {
        setOpen(true);
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const res = await saveServerData(values);
            if (res.error) {
                console.error(res.error);
                return;
            }
    
            console.log(res.data);
            setOpen(false);
            form.reset();
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.error("[InitialServerModal]", error);
        }
    };

    return (
        open && (
            <Dialog open>
                <DialogContent className="bg-stone-100 text-stone-900 ">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl capitalize sm:text-2xl text-blue-600">
                            Customize your first server
                        </DialogTitle>
                        <DialogDescription className="text-center text-xs sm:text-sm text-stone-700/80">
                            Give your server personality with a name and an
                            image. You can always change these settings later.
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
                                                autoComplete="off"
                                                className="h-8 sm:h-9 bg-neutral-500/40 text-stone-800 focus-visible:text-stone-100 border-none text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-stone-600 focus-visible:placeholder:text-stone-400/80 focus-visible:ring-0 focus-visible:ring-offset-0 focus:bg-neutral-800 transition-all shadow-inner shadow-stone-500/55"
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
                                    className="h-8 sm:h-9 bg-blue-600 text-stone-50 text-[10px] sm:text-xs hover:bg-blue-600/90"
                                >
                                    Save & Next
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        )
    );
};

export default InitialServerModal;
