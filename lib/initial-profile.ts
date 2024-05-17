import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import prisma from "@/lib/db";

const initializeUserProfile = async () => {
    const user = await currentUser();

    if (!user) {
        return redirectToSignIn();
    }

    const userProfile = await prisma.profile.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (userProfile) {
        return userProfile;
    }

    const newUserProfile = await prisma.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageURL: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
        },
    });

    return newUserProfile;
};

export default initializeUserProfile;
