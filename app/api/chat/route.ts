import { NextRequest, NextResponse } from "next/server";
import zod from 'zod'
import { PrismaClient } from "@/app/generated/prisma";
import { authMiddleware } from "../lib/authMiddleware";
const prisma = new PrismaClient();

const chatBody = zod.object({
    user_id: zod.string()
})  

export async function POST(req: NextRequest){
    const body = await req.json()

    const response = chatBody.safeParse(body)

    if(!response.success){
        return NextResponse.json({
            message: "Incorrect inputs"
        }, {status: 400})
    }

    const { user_id } = response.data;

    const auth = await authMiddleware(req);
    if (!("authorized" in auth)) return auth;

    try {
        const existingChat = await prisma.chat.findFirst({
            where: {
                isGroupChat: false,
                users: {
                    every: {
                        id: {
                            in: [auth.userId, user_id]
                        }
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
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
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
                }
            }
        });

        if (existingChat) {
            return NextResponse.json({message: "Chat fetched successfully", chat: existingChat }, { status: 200 });
        }

        const newChat = await prisma.chat.create({
            data: {
                chatName: "sender",
                isGroupChat: false,
                users: {
                    connect: [{id: auth.userId}, {id: user_id}]
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
                }
            }
        })
        
        return NextResponse.json({ message: "Chat created successfully", chat: newChat }, { status: 201 });
    }catch(err) {
        console.error("Chat creation error:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest){
    const auth = await authMiddleware(req);
    if (!("authorized" in auth)) return auth;

    try{
        const chats = await prisma.chat.findMany({
            where: {
                users: {
                    some: {
                        id: auth.userId
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
            ,include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        imageUrl: true
                    }
                },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
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
                }
            }
        })

        return NextResponse.json({message: "Chats fetched successfully", chats}, {status: 200})
    }catch(err){
        console.log("Chats fetching error:", err)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}