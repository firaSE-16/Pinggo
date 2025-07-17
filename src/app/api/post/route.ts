import { prisma } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req:Request){

    try{




    const {userId} = await auth()
        
        const clerk = await clerkClient()
        
        const user= await clerk.users.getUser(userId);
        
        const email = await user?.emailAddresses?.[0]?.emailAddress;
        
    const userData = await prisma.user.findUnique({
        where:{
            email
        },
        include:{
            followers:true
        }          
    })
    if(!userData) return NextResponse.json({success:true,message:"User is not found."},{status:404})
        
        const followerIds = userData.followers.map((f)=>f.followedId)
        followerIds.push(userData.id)
        const posts = await prisma.post.findMany({
            where:  {
                userId:{
                in:followerIds
            }
        } ,        
             include: {
       user:true,
        
        likes:{
          include:{
            user:true
          }
        },
        mediat:true,
        comments: {
          include: {
            user: true, 
          },
        },
      }
        
    })
        

    if(!posts) return NextResponse.json({message:"Post not found."},{status:404})

    return NextResponse.json({success:true,data:posts},{status:200})
} catch(error){
    console.error(error)
    return NextResponse.json({message:"Internal server Error."},{status:500})
}

}