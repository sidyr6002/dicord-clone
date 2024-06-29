"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { Command, Search } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface ServerSearchAreaProps {
    data: {
        label: string;
        type: "channel" | "member";
        data: {
            id: string;
            name: string;
            icon: React.ReactNode;
        }[] | undefined;
    }[];
}

const ServerSearchArea = ({ data }: ServerSearchAreaProps) => {
    const [openCommand, setOpenCommand] = React.useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const shortcutAction = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpenCommand((openCommand) => !openCommand);
            }
        };
        
        document.addEventListener("keydown", shortcutAction);

        return () => {
            document.removeEventListener("keydown", shortcutAction);
        };
    }, [])

    const onClick = ({type, id} : {type: "channel" | "member", id: string}) => {
        setOpenCommand(false);

        if (type == "channel") {
            router.push(`/servers/${params?.serverId}/channels/${id}`);
        }

        if (type === "member") {
            router.push(`/servers/${params?.serverId}/conversations/${id}`);
        }
    }

    return (
        <>
            <button
                onClick={() => setOpenCommand(true)}
                className="group w-full flex items-center px-2 py-2 gap-x-2 rounded-md bg-neutral-600/10 dark:bg-stone-800/30 hover:bg-neutral-700/25 dark:hover:bg-stone-800 shadow-sm shadow-neutral-100/40 dark:shadow-stone-500/30 transition"
            >
                <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400/80" />
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 group-hover:dark:text-zinc-300 transition">
                    Search
                </p>
                <kbd
                    className="h-5 pointer-events-none inline-flex select-none items-center text-zinc-600/90 dark:text-zinc-400/60 font-mono gap-1 border border-zinc-400
            dark:border-zinc-600 rounded bg-stone-100/80 dark:bg-stone-900/70 px-1 font-medium ml-auto tracking-tighter"
                >
                    <Command className="w-3 h-3" />{" "}
                    <span className="text-sm">K</span>
                </kbd>
            </button>
            <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
                <CommandInput placeholder="Search for a channel or member"/>
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {data.map(({ label, type, data }) => {
                        if (!data?.length) return null;

                        return (
                            <CommandGroup key={label} heading={label}>
                                {data.map(({id, name, icon}) => (
                                    <CommandItem key={id} onSelect={() => onClick({type, id})} >
                                        {icon}
                                        <span className={cn("truncate", !icon && "ml-[27px]")}>{name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )
                    })}
                </CommandList>
            </CommandDialog>
        </>
    );
};

export default ServerSearchArea;
