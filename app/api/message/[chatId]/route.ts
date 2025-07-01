import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient();

export async function GET(req: NextRequest, context: { params: Record<string, string> }){
    const chatId = context.params.chatId;

    try {
        const messages = await prisma.message.findMany({
            where: {
                chatId
            },
            orderBy: {
                createdAt: "asc"
            },
            select: {
                id: true,
                message: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true
                    }
                }
            }
        })

        return NextResponse.json({
            message: "Messages fetched successfully",
            messages
        }, {status: 200})
    }catch(err) {
        console.log("Error fetching messages:", err)
        return NextResponse.json({message: "Internal server error"}, {status: 500})
    }
}