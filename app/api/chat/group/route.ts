import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { authMiddleware } from "../../lib/authMiddleware";
const prisma = new PrismaClient()

export async function POST(req: NextRequest){
    const body = await req.json()

    if(!body.users || !body.chatName){
        return NextResponse.json({
            message: "Expected inputs are not filled"
        }, {status: 400})
    }

    let users: string[];
    try {
        users = JSON.parse(body.users);
    } catch (err) {
        return NextResponse.json({ message: "Invalid users format" }, { status: 400 });
    }
    
    if(users.length < 2){
        return NextResponse.json({
            message: "Atleast 2 users are needed to create a group chat"
        }, {status: 400})
    }
    
    const auth = await authMiddleware(req)
    if (!("authorized" in auth)) return auth;

    users.push(auth.userId)

    try {
        const groupChat = await prisma.chat.create({
            data: {
                chatName: body.chatName,
                isGroupChat: true,
                users: {
                    connect: users.map((id: string) => ({ id }))
                },
                groupAdmin: {
                    connect: {
                        id: auth.userId
                    }
                },
                imageUrl: body.imageUrl
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
        
        return NextResponse.json({ message: "Group chat created", chat: groupChat }, { status: 201 });
    }catch(err){
        console.error("Group chat creation failed:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
