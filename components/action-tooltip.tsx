import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionTooltipProps {
    children: React.ReactNode;
    label: string;
    side: "top" | "right" | "bottom" | "left";
    align: "start" | "center" | "end";
}

export function ActionTooltip({ children, label, side, align }: ActionTooltipProps) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent 
                    className="rounded px-1 py-1 bg-stone-800 border-stone-700 text-stone-100 dark:bg-stone-200 dark:border-stone-400 dark:text-stone-950 delay-0"
                    side={side}
                    align={align}
                    sideOffset={5}
                >
                    <p className="text-xs font-semibold capitalize">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
