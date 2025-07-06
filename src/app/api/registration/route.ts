import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(req: NextRequest) {
  const body = await req.json(); 

  const user = await auth();

  if (!body) {
    return NextResponse.json({ message: "Error: form is null" }, { status: 400 });
  }
  const hashedPassword = await bcrypt.hash(body.password,10)

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
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

    return NextResponse.json(newUser); 
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
