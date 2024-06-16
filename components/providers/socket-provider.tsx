"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstace = new (ClientIO as any)(
            process.env.NEXT_PUBLIC_SOCKET_URL!,
            {
                path: "/api/socket/io",
                addTrailingSlash: false,
            }
        );

        socketInstace.on("connect", () => {
            setIsConnected(true);
        });

        socketInstace.on("disconnect", () => {
            setIsConnected(false);
        });

        setSocket(socketInstace);

        return () => {
            socketInstace.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
