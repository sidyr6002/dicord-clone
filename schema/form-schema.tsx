import { ChannelType } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { z } from "zod";

const letterRegex = /^(?=.*[a-zA-Z])(?=.*[-_@'A-Za-z\d])[-_@'a-zA-Z\d ]*$/;

export const formSchema = z.object({
    serverName: z
        .string()
        .min(4, { message: "Server name should be at least 6 characters" })
        .refine((value) => letterRegex.test(value), {
            message:
                "The server name must include at least one letter and can contain numbers, as well as special characters such as underscore (_), hyphen (-), or at symbol (@).",
        })
        .refine((value) => !/^\d/.test(value), {
            message: "The channel name cannot start with a number.",
        })
        .refine((value) => !/[-_@]$/.test(value), {
            message: "The server name cannot end with a special character such as underscore (_), hyphen (-), apostrophe (') or at symbol (@).",
        }),
    serverImage: z.string().url({ message: "Upload an image" }),
});

export const channelFormSchema = z.object({
    channelName: z
        .string()
        .min(3, { message: "Channel name should be at least 3 characters" })
        .refine((value) => value !== "general", {
            message: "The channel name cannot be 'general'.",
        })
        .refine((value) => letterRegex.test(value), {
            message:
            "The channel name must include at least one letter and can contain numbers, as well as special characters such as underscore (_), hyphen (-), apostrophe (') or at symbol (@).",
        })
        .refine((value) => !/^\d/.test(value), {
            message: "The channel name cannot start with a number.",
        })
        .refine((value) => !/[-_@]$/.test(value), {
            message: "The channel name cannot end with a special character.",
        }),
    channelType: z.nativeEnum(ChannelType),
});

export const messageFormSchema = z.object({
    fileURL: z
        .string()
        .url({ message: "Attachment must be a valid URL" }),
});
