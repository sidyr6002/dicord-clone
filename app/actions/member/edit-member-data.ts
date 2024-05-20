"use server";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function changeMemberRole(
    serverId: string,
    memberId: string,
    role: MemberRole
) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            throw new Error("Unauthorized");
        }

        if (!serverId || !memberId) {
            throw new Error("Server or Member id is not provided");
        }

        const server = await prisma.server.update({
            where: {
                id: serverId,
                profileId: currentUser.id,
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: memberId,
                            profileId: {
                                not: currentUser.id,
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        })

        //console.log("[CHANGE_MEMBER_ROLE]", server);

        return { data: server };
    } catch (error: any) {
        console.log("[CHANGE_MEMBER_ROLE]", error);
        return { error: error.message };
    }
}


export async function kickMember(serverId: string, memberId: string) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            throw new Error("Unauthorized");
        }

        if (!serverId || !memberId) {
            throw new Error("Server or Member id is not provided");
        }

        const server = await prisma.server.update({
            where: {
                id: serverId,
                profileId: currentUser.id,
            },
            data: {
                members: {
                    deleteMany: {
                        id: memberId,
                        profileId: {
                            not: currentUser.id,
                        },
                    },
                },
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    },
                },
            },
        });

        console.log("[KICK_MEMBER]", server);

        return { data: server };
    } catch (error: any) {
        console.log("[KICK_MEMBER]", error);
        return { error: error.message };
    }
}