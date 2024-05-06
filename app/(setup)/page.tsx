import { initializeUserProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import InitialModal from "@/components/modal/initial-modal";

const SetupPage = async () => {
    const userProfile = await initializeUserProfile();

    const server = await prisma.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: userProfile.id
                }
            }
        }
    })

    if (server) {
        redirect(`/servers/${server.id}`);
    }

    return <InitialModal openDialog={true}/>;
};

export default SetupPage;
