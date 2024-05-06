import { UserButton } from "@clerk/nextjs";
import React from "react";

const CustomUserButton = () => {
    return (
        <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
                elements: {
                    avatarBox: "w-10 h-10",
                    userPreview: "p-2",
                    userButtonPopoverCard:
                        "w-72 bg-neutral-300 dark:bg-stone-700 dark:text-stone-100 px-3 py-4 shadow-md shadow-blue-500/20",
                    userPreviewSecondaryIdentifier: "dark:text-stone-100/55",
                    userButtonPopoverActions: "space-y-3",
                    userButtonPopoverActionButton:
                        "bg-stone-600 dark:bg-neutral-200 rounded-full hover:bg-blue-600 dark:hover:bg-blue-600 transition-all ease-in duration-100 group",
                    userButtonPopoverActionButtonText:
                        "text-[15px] text-stone-100 dark:text-stone-900 group-hover:text-white transition-all ease-in duration-100",
                    userButtonPopoverActionButtonIcon:
                        "text-stone-100 dark:text-stone-900 group-hover:text-white transition-all ease-in duration-100",
                    userButtonPopoverFooter: "hidden",
                },
            }}
        />
    );
};

export default CustomUserButton;
