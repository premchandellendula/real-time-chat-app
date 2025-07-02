import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ chatId: string }> }){
    const { chatId } = await params

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
                        email: true,
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