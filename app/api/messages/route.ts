import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/db";

const MESSAGE_BATCH = 10;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const channelId = searchParams.get("channelId");

        if (!currentUser) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!channelId) {
            return new NextResponse("Missing channelId", { status: 400 });
        }

        let messages: Message[] = [];

        if (cursor) {
            messages = await prisma.message.findMany({
                take: MESSAGE_BATCH,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    channelId
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
            messages = await prisma.message.findMany({
                take: MESSAGE_BATCH,
                where: {
                    channelId
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
        console.log("[MESSAGES_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}