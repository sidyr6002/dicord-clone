import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ToastContainer } from "react-toastify";
import { cn } from "@/lib/utils";

import { ClerkProvider } from "@clerk/nextjs";
import ServerModalProvider from "@/components/providers/server-modal-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import QueryProvider from "@/components/providers/query-provider";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Discord",
    description: "This is a discord clone",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body
                    className={cn(
                        inter.className,
                        "bg-stone-50 dark:bg-stone-900/85 max-h-screen max-w-screen"
                    )}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <SocketProvider>
                            <QueryProvider>
                                <ServerModalProvider />
                                <ToastContainer />
                                <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
                                {children}
                            </QueryProvider>
                        </SocketProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
