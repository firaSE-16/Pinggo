import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req:Request){

    try{
        
    const user = await auth()
    
    if(user!) return NextResponse.json({message:"Unauthorized"},{status:401})

    const posts = await prisma.post.findMany()

    if(!posts) return NextResponse.json({message:"Post not found."},{status:404})

    return NextResponse.json({success:true,data:posts},{status:200})
} catch(error){
    console.error(error)
    return NextResponse.json({message:"Internal server Error."},{status:500})
}

}