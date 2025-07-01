import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../../lib/authMiddleware";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export async function GET(req: NextRequest){
    const auth = await authMiddleware(req)

    if ("authorized" in auth === false) {
        return auth; // Already a NextResponse from authMiddleware
    }

    try{
        const user = await prisma.user.findUnique({
            where: {
                id: auth.userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return NextResponse.json({
            message: "User fetched successfully",
            user
        })
    }catch(err){
        console.error("User Fetching error:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}