import { Channel, Member, Profile, Server } from "@prisma/client";

export type ServerWithChannelesWithMembers = Server & {
    members: (Member & { profile: Profile })[],
    channels: Channel[],
}