import { prisma } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req:Request){

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
    const {reel } = await req.json();

    if(!reel) return NextResponse.json({message:"Reel not found."},{status:400})

    // Step 3: Find user profile in the database
    const profile = await prisma.user.findUnique({
      where: { email },
      select:{
        id: true,
   }
    });

    if (!profile) {
      return NextResponse.json(
        { message: "User profile not found." },
        { status: 404 }
      );
    }

    const newReel = await prisma.reel.create({
    data:{
        userId:profile.id,
        videoUrl:reel.url,
        caption:reel.captions
    }
    });

    return NextResponse.json({data:newReel},{status:201})





}catch(error){
    console.error(error)
    NextResponse.json({message:"Internal server Error."},{status:500})

}
       
    
}