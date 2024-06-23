import { Channel, Member, Message, Profile, Server } from "@prisma/client";
import type { Server as HTTPServer } from "http";
import type { Server as NetServer, Socket as NetSocket } from "net";
import type { NextApiResponse } from "next";
import type { Server as IOServer } from "socket.io";

export type ServerWithChannelesWithMembers = Server & {
    members: (Member & { profile: Profile })[];
    channels: Channel[];
};

export type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile;
    }
}

export type NextApiResponseWithSocket = NextApiResponse & {
    socket: NetSocket & {
        server: HTTPServer & {
            io: IOServer;
        }
    }
}
