"use client";
import React from "react";
import { Server } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

interface NavigationItemProps {
    server: Server;
}
const NavigationItem = ({ server }: NavigationItemProps) => {
    const params = useParams();
    const router = useRouter();
    // console.log(params);
    
    return (
        <div className="w-full">
            <div className="w-full flex items-center justify-between">
                <ActionTooltip label={server.name} side="right" align="center">
                    <button className="group w-full flex justify-center items-center"
                        onClick={() => router.push(`/servers/${server.id}`)}
                    >
                        <div
                            className={cn(
                                "absolute left-0 w-[4px] rounded-r-full bg-stone-950 dark:bg-stone-100 transition-all ease-in duration-150",
                                params.serverId === server.id ? "bg-blue-600 dark:bg-blue-600 h-[36px]" : "h-[20px]",
                                params.serverId !== server.id && "group-hover:h-[28px]"
                            )}
                        />
                        <Image
                            src={server.imageURL}
                            alt="Server image"
                            width={48}
                            height={48}
                            className={cn(
                                "w-11 h-11 rounded-full transition-all duration-150",
                                params.serverId !== server.id && "group-hover:rounded-2xl group-hover:border-2 group-hover:border-blue-600",
                                params.serverId === server.id && "rounded-2xl"
                            )}
                        />
                    </button>
                </ActionTooltip>
            </div>
        </div>
    );
};

export default NavigationItem;
