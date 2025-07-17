import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req:Request){

    try{
        
    
const reels = await prisma.reel.findMany({
    include:{
        user:true
    }
})

    if(!reels) return NextResponse.json({message:"Reels not found."},{status:404})

    return NextResponse.json({success:true,data:reels},{status:200})
} catch(error){
    console.error(error)
    return NextResponse.json({message:"Internal server Error."},{status:500})
}

}