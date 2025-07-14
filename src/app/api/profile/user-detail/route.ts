import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
/**
 * GET /api/profile
 * Returns the authenticated user's profile based on their Clerk email
 */
export async function GET() {
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
    const user= await clerk.users.getUser(userId);
    const email = await user?.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { message: "Email address not found." },
        { status: 400 }
      );
    }

    // Step 3: Find user profile in the database
    const profile = await prisma.user.findUnique({
      where: { email },
      select:{
        id: true,
   username: true,
   email: true,
   password: false,
   fullName: true,
   bio: true,
   avatarUrl: true,
   location: true,
   isPrivate: true,
   createdAt: true,
   updatedAt: true,
   posts: true,
   comments: true,
   bookmarks: true,
   reels: true,
   stories: true,
   mentions: true,
   notifications: true,
   liveRooms: true,
   sentMessages: true,
   receivedMessages: true,
   events: true,
   like: true,
   followers: true,
   following: true,
   groupOnwer: true,
   groupMember: true,
   _count: true}
    });

    if (!profile) {
      return NextResponse.json(
        { message: "User profile not found." },
        { status: 404 }
      );
    }

    console.log("hi")
    // Step 4: Return profile data
    return NextResponse.json(
      { success: true, data: profile },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/profile] Error:", error);

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}


/**
 * GET /api/profile
 * The update user's profile based on their clerk email
 */
export async function POST(req:Request){
    
    try{
    const {userId} = await auth()

    if (!userId) {
        return NextResponse.json(
            { message: "Unauthorized: No user ID found." },
            { status: 401 }
        );
    }

    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const email = await user?.emailAddresses?.[0].emailAddress

    
    if (!email) {
      return NextResponse.json(
        { message: "Email address not found." },
        { status: 400 }
      );
    }

    const {
        
        username,
        password,
        fullName,
        bio,
        avatarUrl,
        location
    } = await req.json();


    const profile = await prisma.user.update({
        where:{
            email:email
        },
        data:{
            username,
            password,
            fullName,    
            bio,         
            avatarUrl,
            location 
            
        }
    })
    if (!profile) {
      return NextResponse.json(
        { message: "User profile not found." },
        { status: 404 }
      );
    }
} catch(error){
    console.error("[GET /api/profile] Error:", error);

    return NextResponse.json({message:"Internal Server Error."},{status:500})
    
}
}


