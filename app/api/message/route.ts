import { NextRequest, NextResponse } from "next/server";
import zod from 'zod';
import { PrismaClient } from "@/app/generated/prisma";
import { authMiddleware } from "../lib/authMiddleware";
const prisma = new PrismaClient();

const messageBody = zod.object({
    message: zod.string(),
    chat_id: zod.string()
})

export async function POST(req: NextRequest){
    const body = await req.json();
    const response = messageBody.safeParse(body);

    if(!response.success){
        return NextResponse.json({
            message: "Incorrect inputs"
        }, {status: 400})
    }

    const auth = await authMiddleware(req);
    if(!("authorized" in auth)) return auth;

    const { message, chat_id } = response.data;

    try {
        const newMessage = await prisma.message.create({
            data: {
                message,
                userId: auth.userId,
                chatId: chat_id
            }
        })

        await prisma.chat.update({
            where: {
                id: chat_id
            },
            data: {
                latestMessage: {
                    connect: {
                        id: newMessage.id
                    }
                }
            }
        })

        const fullMessage = await prisma.message.findUnique({
            where: { id: newMessage.id},
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
                },
                chat: {
                    select: {
                        id: true,
                        chatName: true,
                        isGroupChat: true,
                        users: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                imageUrl: true
                            }
                        },
                        latestMessage: true
                    }
                }
            }
        })

        return NextResponse.json({ message: "Message sent", fullMessage }, { status: 201 });
    }catch(err) {
        console.log("Error sending a message:", err)
        return NextResponse.json({message: "Internal server error"}, {status: 500})
    }
}