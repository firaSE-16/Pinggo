import { prisma } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req:Request){
    try{
        const {userId} = await auth();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized: No user ID found." }, { status: 401 });
        }
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);
        const email = await user?.emailAddresses?.[0]?.emailAddress;
        
    const userData = await prisma.user.findUnique({
        where:{
            email
        },
        include:{
            followers:true,
            following:true
        },        
    })
    if(!userData) return NextResponse.json({success:true,message:"User is not found."},{status:404})
        
        const followerIds = userData.following.map((f)=>f.followedId)
        followerIds.push(userData.id)
        
        const stories = await prisma.story.findMany({
            where:  {
                userId:{
                in:followerIds
            },
        } ,        
            include:{
                user:true
            }
        
    })
    
    return NextResponse.json({sucess:true,data:stories},{status:200})
}  catch(error){
    console.error(error)
    return NextResponse.json({message:"Internal server error"},{status:500})
}


}