import { PORT } from "@/config/app";
import type { Server as HTTPServer } from "http";
import { Server as ServerIO } from "socket.io";
import type { NextApiRequest } from "next";

import { NextApiResponseWithSocket } from "@/types";

export const config = {
    api: {
        bodyParser: false,
    },
};

const socketIOHandler = (
    _req: NextApiRequest,
    res: NextApiResponseWithSocket
) => {
    if (res.socket.server.io) {
        res.status(200).json({
            success: true,
            message: "Socket is already running",
        });
        return;
    }

    const path = "/api/socket/io";
    const httpServer: HTTPServer = res.socket.server;

    console.log("Starting Socket.IO server on port:", PORT + 1);

    const io = new ServerIO(httpServer, {
        path,
        addTrailingSlash: false,
        cors: {
            origin: "*",
        },
    });

    res.socket.server.io = io;
    res.status(201).json({
        success: true,
        message: "Socket is started",
    });
};

export default socketIOHandler;
