import React from "react";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeToggler from "@/components/theme-toggle/theme-toggler";
import NavigationAction from "@/components/navigation/navigation-action";
import NavigationItem from "@/components/navigation/navigation-item";
import CustomUserButton from "../custom-user-button";

const NavigationSidebar = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        redirect("/sign-in");

    }

    const servers = await prisma.server.findMany({
        where: {
            members: {
                some: {
                    profileId: currentUser.id
                }
            }
        }
    })

    return (
        <div className="bg-neutral-400 dark:bg-neutral-800 w-full py-3 flex flex-col space-y-3">
            <NavigationAction />
            <Separator className="bg-stone-500 dark:bg-neutral-600 h-[2px] w-10/12 mx-auto rounded-full" />
            <ScrollArea className="w-full flex-1">
                {servers.map((server) => (
                    <NavigationItem server={server} key={server.id} />
                ))}
            </ScrollArea>
            <div className="mt-auto flex flex-col justify-center items-center space-y-3">
                <ThemeToggler />
                <CustomUserButton />
            </div>
        </div>
    );
};

export default NavigationSidebar;
