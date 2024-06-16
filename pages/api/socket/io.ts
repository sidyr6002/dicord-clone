import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as IOServer } from "socket.io";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseWithSocket } from "@/types";

export const config = {
    api: {
        bodyParser: false,
    },
};

const socketIOHandler = (
    req: NextApiRequest,
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

    const io = new ServerIO(httpServer, {
        path,
        addTrailingSlash: false,
    });

    res.socket.server.io = io;
};

export default socketIOHandler;
