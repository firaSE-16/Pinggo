import { prisma } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function POST(
  req: NextApiRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to fix sync access error
    const { id } = await params;

    // Get authenticated user ID
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: No user ID found." },
        { status: 401 }
      );
    }

       const clerk = await clerkClient()
    const user= await clerk.users.getUser(userId);
  
    const email = await user?.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { message: "Email address not found." },
        { status: 400 }
      );
    }

    // Fetch other user's profile
    const otherProfile = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true
      },
    });

    if (!otherProfile) {
      return NextResponse.json(
        { message: "User profile not found." },
        { status: 404 }
      );
    }

    

    const currentProfile = await prisma.user.findUnique({
      where: { email },
      select: {
        id:true,
      },
    });
    

    if (!currentProfile) {
      return NextResponse.json(
        { message: "Current user profile not found." },
        { status: 404 }
      );
    }


    const newFollow = await prisma.userFollow.create({
                data:{ followerId:currentProfile.id ,
             followedId:id}

    })

    return NextResponse.json(
      {
        success: true,
        data: newFollow,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[post /api/follow/[id]] Error:", error);
    return NextResponse.json(
      { message: "Internal server error.", error: error },
      { status: 500 }
    );
  }
}