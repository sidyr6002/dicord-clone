import {  getAuth } from "@clerk/nextjs/server";
import prisma from "./db";
import { NextApiRequest } from "next";

export async function getCurrentUserPages(req: NextApiRequest) {
    const { userId }: { userId: string | null } = getAuth(req);

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
