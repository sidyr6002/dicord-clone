"use client";
import React from "react";
import { useRouter } from "next/navigation";
import prisma from "@/lib/db";

interface ServerPageParams {
    serverId: string;
}
interface ServerPageProps {
    params: ServerPageParams;
}
const ServerPage = ({ params }: ServerPageProps) => {
    const { serverId } = params;

    // const server = await prisma.server.findUnique({
    //     where: {
    //         id: serverId,
    //     },
    // });

    // console.log(server);

    return (
        <div >
          Server : {serverId}
        </div>
    );
};

export default ServerPage;
