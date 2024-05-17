import prisma from "@/lib/db";
import { redirect } from "next/navigation";

import initializeUserProfile from "@/lib/initial-profile";
import InitialServerModal from "@/components/modal/initial-server-modal";

const SetupPage = async () => {
    const userProfile = await initializeUserProfile();

    const server = await prisma.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: userProfile.id,
                },
            },
        },
    });

    if (server) {
        redirect(`/servers/${server.id}`);
    }

    return <InitialServerModal />;
};

export default SetupPage;
