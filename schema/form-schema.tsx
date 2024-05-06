import { z } from "zod";

const letterRegex = /^(?=.*[a-zA-Z])(?=.*[-_@A-Za-z\d]).*$/;

export const formSchema = z.object({
    serverName: z
        .string()
        .min(6, { message: "Server name should be at least 6 characters" })
        .refine((value) => letterRegex.test(value), {
            message:
                "The server name must include at least one letter and can contain numbers, as well as special characters such as underscore (_), hyphen (-), or at symbol (@).",
        }),
    serverImage: z.string().url({ message: "Upload an image" }),
});
