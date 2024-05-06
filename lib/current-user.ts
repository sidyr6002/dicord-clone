import { auth } from "@clerk/nextjs/server";
import prisma from "./db";
export async function getCurrentUser() {
    const { userId }: { userId: string | null } = auth();

    if (!userId) {
        console.log("[CURRENT_USER] userId is null");
        return null;
    }

    const currentUserProfile = await prisma.profile.findUnique({
        where: {
            userId,
        },
    });

    if (!currentUserProfile) {
        console.log("[CURRENT_USER] currentUserProfile is null");
        return null;
    }

    return currentUserProfile;
}
