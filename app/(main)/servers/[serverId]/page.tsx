import { redirectToSignIn } from "@clerk/nextjs";

import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

interface ServerPageParams {
    serverId: string;
}

interface ServerPageProps {
    params: ServerPageParams;
}

const ServerPage = async ({ params }: ServerPageProps) => {
    const currentUser = await getCurrentUser();
    const { serverId } = params;
    if (!currentUser) {
        return redirectToSignIn();
    }

    const server = await prisma.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: currentUser.id
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: "general"
                },
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    });

    const initialChannel = server?.channels[0];

    if (initialChannel?.name !== "general") {
        return null;
    }

    return redirect(`/servers/${serverId}/channels/${initialChannel.id}`);
};

export default ServerPage;
