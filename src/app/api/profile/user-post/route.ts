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

    // Step 2: Get user data from Clerk 
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
    const { content, location,mediaUrls } = await req.json();
 
      



  

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

    const newPost = await prisma.post.create({
      data: {
        content,
        location,
        userId: profile.id
      }
    });

    if (mediaUrls && mediaUrls.length > 0) {
    const newMedia=  await prisma.media.createMany({
        data: mediaUrls.map((url: {url:string;mediaType:string}) => ({
          mediaUrl: url.url,
          mediaType:url.mediaType,
          postId: newPost.id
        }))
      });
      console.log(newMedia)
    }

    return NextResponse.json(
      { 
        success: true,
        data: { post: newPost },
        message: "Post created successfully!" 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Internal server error" 
      },
      { status: 500 }
    );
  }
}