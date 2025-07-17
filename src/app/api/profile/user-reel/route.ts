import { prisma } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Step 1: Authenticate user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: No user ID found." },
        { status: 401 }
      );
    }

        const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { message: "Email address not found." },
        { status: 400 }
      );
    }

    // Step 3: Parse request body
    const { caption, mediaUrl } = await req.json();

    // Step 4: Find user profile in the database
    const profile = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (!profile) {
      return NextResponse.json(
        { message: "User profile not found." },
        { status: 404 }
      );
    }

    // Step 5: Create reel
    const newReel = await prisma.reel.create({
      data: {
        userId: profile.id,
        videoUrl: mediaUrl,
        caption
      }
    });

    return NextResponse.json(
      { 
        success: true,
        data: { reel: newReel },
        message: "Reel created successfully!" 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Reel creation error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Internal server error" 
      },
      { status: 500 }
    );
  }
}