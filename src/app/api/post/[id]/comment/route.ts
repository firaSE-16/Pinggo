import { prisma } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const postId = params.id;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized: No user ID found." }, { status: 401 });
    }
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ message: "Email address not found." }, { status: 400 });
    }
    const { content, parentId } = await req.json();
    if (!content || typeof content !== "string") {
      return NextResponse.json({ message: "Content is required." }, { status: 400 });
    }
    const profile = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!profile) {
      return NextResponse.json({ message: "Current user profile not found." }, { status: 404 });
    }
    const newComment = await prisma.comment.create({
      data: {
        content,
        userId: profile.id,
        postId,
        parentId: parentId || null,
      },
      include: {
        user: true,
        replies: {
          include: {
            user: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, data: newComment }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/post/[id]/comment] Error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}