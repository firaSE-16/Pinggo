import { prisma } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { MessageType } from "@prisma/client";

// GET: fetch all messages between current user and [id]
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ message: "Email address not found." }, { status: 400 });
    const profile = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!profile) return NextResponse.json({ message: "User not found." }, { status: 404 });
    const otherUserId = params.id;
    // Check if the other user exists
    const otherUser = await prisma.user.findUnique({ where: { id: otherUserId }, select: { id: true } });
    if (!otherUser) return NextResponse.json({ message: "Chat partner not found." }, { status: 404 });
    // Fetch all messages between current user and other user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: profile.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: profile.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: true,
        receiver: true,
      },
    });
    return NextResponse.json({ success: true, data: messages }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/message/[id]] Error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

// POST: send a message to [id]
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ message: "Email address not found." }, { status: 400 });
    const profile = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!profile) return NextResponse.json({ message: "User not found." }, { status: 404 });
    const otherUserId = params.id;
    // Check if the other user exists
    const otherUser = await prisma.user.findUnique({ where: { id: otherUserId }, select: { id: true } });
    if (!otherUser) return NextResponse.json({ message: "Chat partner not found." }, { status: 404 });
    const { text, type } = await req.json();
    const validTypes = ["TEXT", "IMAGE", "VIDEO", "AUDIO", "FILE"];
    const messageType = (typeof type === "string" && validTypes.includes(type.toUpperCase()))
      ? type.toUpperCase()
      : "TEXT";
    if (!text || typeof text !== "string") return NextResponse.json({ message: "Message text required." }, { status: 400 });
    const newMessage = await prisma.message.create({
      data: {
        senderId: profile.id,
        receiverId: otherUserId,
        message: text,
        type: MessageType[messageType as keyof typeof MessageType],
        status: "sent",
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/message/[id]] Error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
} 