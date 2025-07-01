import { NextRequest, NextResponse } from "next/server";
import zod from 'zod'
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../../lib/authMiddleware";
const prisma = new PrismaClient();

const userAddBody = zod.object({
    chat_id: zod.string(),
    user_id: zod.string()
})

export async function PUT(req: NextRequest){
    const body = await req.json()
    const response = userAddBody.safeParse(body)

    if(!response.success){
        return NextResponse.json({
            message: "Incorrect inputs"
        }, {status: 400})
    }

    const { chat_id, user_id } = response.data;

    const auth = await authMiddleware(req)
    if (!("authorized" in auth)) return auth;

    try{
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
                message: "Chat Id is invalid"
            }, {status: 400})
        }

        if (!groupChat.isGroupChat) {
            return NextResponse.json({ message: "Only group chats can be modified" }, { status: 400 });
        }

        if (groupChat.groupAdminId !== auth.userId) {
            return NextResponse.json({ message: "Only the group admin can add users" }, { status: 403 });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: user_id
            }
        })

        if(!user){
            return NextResponse.json({
                message: "User Id is invalid"
            }, {status: 400})
        }

        const updatedChatAfterUserAdd = await prisma.chat.update({
            where: {
                id: chat_id
            },
            data: {
                users: {
                    connect: {
                        id: user_id
                    }
                }
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
            message: "User added to chat successfully",
            chat: updatedChatAfterUserAdd
        }, { status: 200 });
    }catch(err){
        console.log("Adding user to group failed:", err)
        return NextResponse.json({ message: "Internal server error"}, {status: 500})
    }
}