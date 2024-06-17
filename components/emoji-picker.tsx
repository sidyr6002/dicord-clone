"use client";
import React from "react";
import { Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useTheme } from "next-themes";

interface EmojiPickerProps {
    onChange: (value: React.SetStateAction<string>) => void
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
    const { resolvedTheme: theme } = useTheme();
    const handleEmojiSelect = (emoji: any) => {
        onChange((prev: string) => prev + ' ' + emoji.native);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Smile className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-700 group-hover:dark:text-zinc-300 transition duration-100" />
            </PopoverTrigger>
            <PopoverContent side="top" align="end" sideOffset={20} className="w-fit bg-transparent border-none p-0">
                <Picker data={data} onEmojiSelect={handleEmojiSelect} theme={theme} />
            </PopoverContent>
        </Popover>
    );
};

export default EmojiPicker;
