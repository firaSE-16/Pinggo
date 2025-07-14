import { prisma } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function Post(req:Request,{params}:{params:{id:string,commenterId:string}}){
    
    const postId = params.id
    
    
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
        const {comment } = await req.json();
    
        if(!comment) return NextResponse.json({message:"Comment not found."},{status:400})
    
        const profile = await prisma.user.findUnique({
          where: { email },
          select:{
            id: true,
       }
        });
        if(!profile) return NextResponse.json({message:"User doesn't exist."},{status:404})

       const newLike = await prisma.like.create({
            data:{
                userId:profile.id,
                postId:postId,
               
            }

        })

        
    
        
    
        return NextResponse.json({success:true,data:newLike},{status:201})
    
    
    
    
    
    }catch(error){
        console.error(error)
        NextResponse.json({message:"Internal server Error."},{status:500})
    
    }

}