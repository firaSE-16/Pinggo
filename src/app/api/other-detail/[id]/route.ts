import { prisma } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to fix sync access error
    const { id } = await params;
    console.log(`[GET /api/other-detail/${id}] Request received`);

    // Get authenticated user ID
    const { userId } = await auth();

    if (!userId) {
      console.log(`[GET /api/other-detail/${id}] Unauthorized: No user ID found`);
      return NextResponse.json(
        { message: "Unauthorized: No user ID found." },
        { status: 401 }
      );
    }

    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId);
    const email = await user?.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      console.log(`[GET /api/other-detail/${id}] Email address not found for user ${userId}`);
      return NextResponse.json(
        { message: "Email address not found." },
        { status: 400 }
      );
    }

    console.log(`[GET /api/other-detail/${id}] Looking for user with ID: ${id}`);

    const otherProfile = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        password: false,
        fullName: true,
        bio: true,
        avatarUrl: true,
        location: true,
        isPrivate: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          include: {
            user: true,
            likes: {
              include: {
                user: true,
              },
            },
            mediat: true,
            comments: {
              include: {
                user: true,
              },
            },
          },
        },
        comments: true,
        bookmarks: true,
        reels: {
          include: {
            user: true,
          },
        },
        stories: {
          include: {
            user: true,
          },
        },
        mentions: true,
        notifications: true,
        liveRooms: true,
        sentMessages: true,
        receivedMessages: true,
        events: true,
        like: true,
        followers: {
          include: {
            followed: true,
          },
        },
        following: {
          include: {
            follower: true,
          },
        },
        groupOnwer: true,
        groupMember: true,
        _count: true,
      },
    });

    if (!otherProfile) {
      console.log(`[GET /api/other-detail/${id}] User profile not found`);
      return NextResponse.json(
        { message: "User profile not found." },
        { status: 404 }
      );
    }

    console.log(`[GET /api/other-detail/${id}] User found: ${otherProfile.username}`);

    // Fetch current user's profile for follower checks
    const currentProfile = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        followers: {
          select: {
            followerId: true,
          },
        },
        following: {
          select: {
            followedId: true,
          },
        },
      },
    });

    if (!currentProfile) {
      console.log(`[GET /api/other-detail/${id}] Current user profile not found for email: ${email}`);
      return NextResponse.json(
        { message: "Current user profile not found." },
        { status: 404 }
      );
    }

    if (id === currentProfile.id) {
      console.log(`[GET /api/other-detail/${id}] User viewing their own profile`);
      return NextResponse.json(
        {
          success: true,
          data: otherProfile,
          isMyAcc: true,
          following: true,
          followed: true,
        },
        { status: 200 }
      );
    }

    const isFollowing = otherProfile.followers.some(
      (f) => f.followerId === userId
    );
    const isFollowed = currentProfile.following.some(
      (f) => f.followedId === id
    );

    console.log(`[GET /api/other-detail/${id}] Success: isFollowing=${isFollowing}, isFollowed=${isFollowed}`);

    return NextResponse.json(
      {
        success: true,
        data: otherProfile,
        isMyAcc: false,
        following: isFollowing,
        followed: isFollowed,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`[GET /api/other-detail/unknown] Error:`, error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}