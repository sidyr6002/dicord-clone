import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
    src: string | undefined;
    className?: string;
}
const UserAvatar = ({ src, className, ...props }: UserAvatarProps) => {
    return (
        <Avatar className={cn("w-6 h-6 md:w-8 md:h-8", className)} {...props}>
            <AvatarImage src={src} />
            <AvatarFallback />
        </Avatar>
    );
};

export default UserAvatar;
