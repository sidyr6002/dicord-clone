"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ActionTooltip } from "../action-tooltip"

const ModeToggle = () => {
  const { setTheme } = useTheme()

  return (
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button
                  variant="outline"
                  size="sm"
                  className="w-11 h-11 bg-transparent border-transparent rounded-full hover:bg-neutral-800/10 hover:border-stone-500 dark:hover:bg-stone-900 dark:hover:border-neutral-700 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                  <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" side="right" sideOffset={15}>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
              </DropdownMenuItem>
          </DropdownMenuContent>
      </DropdownMenu>
  );
}

export default ModeToggle;
