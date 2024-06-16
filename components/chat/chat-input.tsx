"use client";
import React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import qs from "query-string";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Plus, Smile } from "lucide-react";
import { Input } from "../ui/input";

interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: "channel" | "conversation";
}

const formSchema = z.object({
    message: z.string().min(1),
});

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const submit = async (data: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });

            await axios.post(url, data);
        } catch (error) {
            console.error("[ChatInput]", error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-5">
                                    <button className="absolute left-7 top-[26px] h-[26px] w-[26px] p-[5px] rounded-full flex items-center justify-center bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition duration-100">
                                        <Plus className="w-full h-full text-stone-100 dark:text-stone-950/70" />
                                    </button>
                                    <Input
                                        disabled={isLoading}
                                        className="px-12 py-6 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-400/50 dark:bg-neutral-700/60 text-zinc-700 dark:text-zinc-300"
                                        placeholder={`Message ${type === "channel"? `#${name}`: name}`}
                                        {...field}
                                    />
                                    <div className="absolute group right-7 top-[26px] hover:cursor-pointer">
                                        <Smile className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-700 group-hover:dark:text-zinc-300 transition duration-100" />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};

export default ChatInput;
