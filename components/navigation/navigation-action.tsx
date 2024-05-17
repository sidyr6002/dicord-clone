"use client"
import { Plus } from "lucide-react";
import React from "react";
import { ActionTooltip } from "../action-tooltip";
import useServerStore from "@/hooks/use-server-store";

const NavigationAction = () => {
    const { onOpen: addNewServer } = useServerStore();
    
    return (
        <div className="w-full">
            <ActionTooltip label="add a new server" side="right" align="center">
                <button className="w-full flex items-center justify-center group" onClick={() => addNewServer("createServer")}>
                    <div className="w-12 h-12 bg-stone-100 dark:bg-stone-950 rounded-full flex items-center justify-center group-hover:rounded-2xl group-hover:bg-blue-600 transition-all ease-in duration-150">
                        <Plus
                            className="bg-white dark:bg-stone-950 rounded-full"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    );
};

export default NavigationAction;
