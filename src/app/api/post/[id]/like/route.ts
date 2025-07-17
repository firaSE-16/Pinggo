import { prisma } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const postId = params.id;
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized: No user ID found." }, { status: 401 });
    }
    // Get user data from Clerk
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ message: "Email address not found." }, { status: 400 });
    }
    // Find user profile
    const profile = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!profile) {
      return NextResponse.json({ message: "User doesn't exist." }, { status: 404 });
    }
    // Check if post exists
    const post = await prisma.post.findUnique({ where: { id: postId }, include: { likes: true } });
    if (!post) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }
    // Check if already liked
    const existingLike = await prisma.like.findFirst({ where: { userId: profile.id, postId } });
    if (existingLike) {
      // Already liked, just return like count and liked: true
      return NextResponse.json({ success: true, liked: true, likeCount: post.likes.length }, { status: 200 });
    } else {
      // Like (add like)
      await prisma.like.create({ data: { userId: profile.id, postId } });
      // Get updated like count
      const updatedPost = await prisma.post.findUnique({ where: { id: postId }, include: { likes: true } });
      return NextResponse.json({ success: true, liked: true, likeCount: updatedPost?.likes.length ?? 0 }, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}