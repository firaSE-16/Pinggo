import { prisma } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Step 1: Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: No user ID found." },
        { status: 401 }
      );
    }

    // Step 2: Get user data from Clerk
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { message: "Email address not found." },
        { status: 400 }
      );
    }

    if (!body) {
      return NextResponse.json(
        { message: "Error: form is null" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username: body.username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          message: "User already exists",
          details: {
            emailExists: existingUser.email === email,
            usernameExists: existingUser.username === body.username
          }
        },
        { status: 409 }
      );
    }

    // Create user in database (no password needed since Clerk handles authentication)
    const newUser = await prisma.user.create({
      data: {
        id: userId, // Use Clerk's userId as our database ID
        username: body.username,
        email: email,
        password: "", // Empty password since Clerk handles auth
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
          email: newUser.email,
          fullName: newUser.fullName
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