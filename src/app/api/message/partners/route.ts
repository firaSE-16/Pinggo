import { prisma } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ message: "Email address not found." }, { status: 400 });
    const profile = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!profile) return NextResponse.json({ message: "User not found." }, { status: 404 });
    const myId = profile.id;

    // Find all messages where the user is sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId },
          { receiverId: myId },
        ],
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        message: true,
        createdAt: true,
        sender: {
          select: { id: true, username: true, fullName: true, avatarUrl: true }
        },
        receiver: {
          select: { id: true, username: true, fullName: true, avatarUrl: true }
        },
      },
    });

    // Collect unique chat partners and their last message
    const partnersMap = new Map();
    messages.forEach(msg => {
      let partner, partnerId;
      if (msg.senderId !== myId) {
        partner = msg.sender;
        partnerId = msg.senderId;
      } else if (msg.receiverId !== myId) {
        partner = msg.receiver;
        partnerId = msg.receiverId;
      }
      if (partner && partnerId && !partnersMap.has(partnerId)) {
        partnersMap.set(partnerId, {
          ...partner,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          isOnline: false // Placeholder, can be updated with real online status
        });
      }
    });
    // Sort by most recent message
    const partners = Array.from(partnersMap.values()).sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

    return NextResponse.json({ success: true, data: partners }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/message/partners] Error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
} 