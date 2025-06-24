import { NextRequest, NextResponse } from "next/server";
import zod from 'zod';
import { PrismaClient } from "@/app/generated/prisma";
import { authMiddleware } from "../../lib/authMiddleware";
const prisma = new PrismaClient()

const renamePutBody = zod.object({
    chatName: zod.string(),
    chat_id: zod.string()
})

export async function PUT(req: NextRequest){
    const body = await req.json()

    const response = renamePutBody.safeParse(body)

    if(!response.success){
        return NextResponse.json({
            message: "Incorrect inputs"
        }, {status: 400})
    }

    const { chatName, chat_id } = response.data
    const auth = await authMiddleware(req)
    if(!("authorized" in auth)) return auth;
    
    try {
        const groupChat = await prisma.chat.findUnique({
            where: {
                id: chat_id
            },
            select: {
                id: true,
                groupAdminId: true,
                isGroupChat: true
            }
        })

        if(!groupChat){
            return NextResponse.json({
                message: "Group Chat doesn't exist with the id"
            }, {status: 400})
        }

        if (!groupChat.isGroupChat) {
            return NextResponse.json({ message: "Only group chats can be modified" }, { status: 400 });
        }

        if (groupChat.groupAdminId !== auth.userId) {
            return NextResponse.json({ message: "Only the group admin can add users" }, { status: 403 });
        }
        
        const updatedChat = await prisma.chat.update({
            data: {
                chatName: chatName
            },
            where: {
                id: chat_id
            },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        imageUrl: true
                    }
                },
                groupAdmin: {
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
            message: "Updated the chat successfully",
            chat: updatedChat
        }, {status: 200})
    }catch(err) {
        console.error("Group chat updating failed:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}