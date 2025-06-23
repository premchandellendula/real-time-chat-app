import { NextRequest, NextResponse } from "next/server";
import zod from 'zod'
import * as argon2 from "argon2";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient()

const signupBody = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(6),
    confirmPassword: zod.string().min(6),
    imageUrl: zod.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export async function POST(req: NextRequest) {
    const body = await req.json()
    const response = signupBody.safeParse(body)

    if(!response.success){
        return NextResponse.json({
            message: "Incorrect inputs"
        }, {status: 400})
    }

    const { name, email, password, imageUrl } = response.data 
    try{
        const hashedPassword = await argon2.hash(password);

        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                imageUrl: imageUrl
            }
        })

        if(!user){
            throw new Error("Failed to create user")
        }
        
        const JWT_SECRET = process.env.JWT_SECRET

        if(!JWT_SECRET){
            throw new Error("JWT_SECRET not defined")
        }

        const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: "2d"})

        const response = NextResponse.json({
            message: "Signup successful",
            data: {
                name: user.name,
                email: user.email,
                imageUrl: user.imageUrl
            }
        }, {
            status: 201
        })

        response.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "lax",  // change it to none when deploying
            secure: false,   // change it to true when deploying
            maxAge: 2 * 24 * 60 * 60
        })

        return response
    }catch(err){
        console.error("Signup error:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    } 
}