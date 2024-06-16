import prisma from "@/lib/db";

const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        const conversation = await prisma.conversation.findFirst({
            where: {
                OR: [
                    {
                        AND: [
                            { memberOneId: memberOneId },
                            { memberTwoId: memberTwoId },
                        ],
                    },
                    {
                        AND: [
                            { memberOneId: memberTwoId },
                            { memberTwoId: memberOneId },
                        ],
                    },
                ],
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        return conversation;
    } catch (error) {
        console.log("[CONVERSATIONS]", error);
        return null;
    }
};

const createConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        const newConversation = await prisma.conversation.create({
            data: {
                memberOneId: memberOneId,
                memberTwoId: memberTwoId,
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
        return newConversation;
    } catch (error) {
        console.log("[CONVERSATIONS]", error);
        return null;
    }
};

export const getConversation = async (
    memberOneId: string,
    memberTwoId: string
) => {
    try {
        let conversation = await findConversation(memberOneId, memberTwoId);

        if (!conversation) {
            conversation = await createConversation(memberOneId, memberTwoId);
        }

        return conversation;
    } catch (error) {
        console.log("[CONVERSATIONS]", error);
        return null;
    }
};
