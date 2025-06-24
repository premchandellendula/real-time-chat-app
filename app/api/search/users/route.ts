import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient();

export async function GET(req: NextRequest){
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    try {
        const users = await prisma.user.findMany({
            where: search 
                ? {
                    OR: [
                        { name: { contains: search, mode: "insensitive"}},
                        { email: { contains: search, mode: "insensitive"}}
                    ]
                } 
                : {},
                select: {
                    id: true,
                    name: true,
                    email: true,
                    imageUrl: true
                }
        })

        return NextResponse.json({message: "Users fetched successfully", users}, {status: 200})
    }catch(err) {
        console.log("Error fetching users:", err)
        return NextResponse.json({message: "Internal server error"}, {status: 500})
    }
}