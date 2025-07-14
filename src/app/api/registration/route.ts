import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { message: "Error: form is null" },
        { status: 400 }
      );
    }

    const user = await auth();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: body.email },
          { username: body.username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          message: "User already exists",
          details: {
            emailExists: existingUser.email === body.email,
            usernameExists: existingUser.username === body.username
          }
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
        fullName: body.fullName,
        bio: body.bio || "",
        avatarUrl: body.avatarUrl || "",
        
      },
    });

    return NextResponse.json(
      { 
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}