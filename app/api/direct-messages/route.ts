import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/db";

const MESSAGE_BATCH = 10;

export async function GET(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");

        // console.log("ConversationId", conversationId)

        if (!currentUser) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Missing conversationId", { status: 400 });
        }

        let messages: DirectMessage[] = [];

        if (cursor) {
            messages = await prisma.directMessage.findMany({
                take: MESSAGE_BATCH,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        } else {
            messages = await prisma.directMessage.findMany({
                take: MESSAGE_BATCH,
                where: {
                    conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        }

        let nextCursor = null;

        if (messages.length === MESSAGE_BATCH) {
            nextCursor = messages[MESSAGE_BATCH - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        })

    } catch (error) {
        console.log("[DiRECT_MESSAGES_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}