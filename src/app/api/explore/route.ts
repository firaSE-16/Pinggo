import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() || "";
    const type = searchParams.get("type") || "username";

    console.log(`[EXPLORE] Search request: query="${query}", type="${type}"`);

    // Input validation
    if (!query) {
      console.log("[EXPLORE] Empty query provided");
      return NextResponse.json(
        { success: false, message: "Please provide a search query" },
        { status: 400 }
      );
    }

    if (query.length < 2) {
      console.log("[EXPLORE] Query too short");
      return NextResponse.json(
        { success: false, message: "Search query must be at least 2 characters long" },
        { status: 400 }
      );
    }

    // Validate search type
    const validTypes = ["username", "fullName", "posts", "reels"];
    if (!validTypes.includes(type)) {
      console.log(`[EXPLORE] Invalid search type: ${type}`);
      return NextResponse.json(
        { success: false, message: "Invalid search type" },
        { status: 400 }
      );
    }

    let results: any = [];

    try {
      // Test database connection first
      await prisma.$connect();
      
      switch (type) {
        case "username":
          results = await prisma.user.findMany({
            where: {
              username: { 
                contains: query, 
                mode: "insensitive" 
              },
              isPrivate: false,
            },
            select: {
              id: true,
              username: true,
              email: true,
              fullName: true,
              bio: true,
              avatarUrl: true,
              location: true,
            },
            take: 20, // Limit results
          });
          break;

        case "fullName":
          results = await prisma.user.findMany({
            where: {
              fullName: { 
                contains: query, 
                mode: "insensitive" 
              },
              isPrivate: false,
            },
            select: {
              id: true,
              username: true,
              email: true,
              fullName: true,
              bio: true,
              avatarUrl: true,
              location: true,
            },
            take: 20,
          });
          break;

        case "posts":
          results = await prisma.post.findMany({
            where: {
              content: { 
                contains: query, 
                mode: "insensitive" 
              },
              user: { isPrivate: false },
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  fullName: true,
                  bio: true,
                  avatarUrl: true,
                  location: true,
                },
              },
              mediat: true,
              likes: true,
              comments: true,
              bookmarks: true,
              mentions: true,
            },
            take: 20,
            orderBy: { createdAt: "desc" },
          });
          break;

        case "reels":
          results = await prisma.reel.findMany({
            where: {
              caption: { 
                contains: query, 
                mode: "insensitive" 
              },
              user: { isPrivate: false },
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  fullName: true,
                  bio: true,
                  avatarUrl: true,
                  location: true,
                },
              },
            },
            take: 20,
            orderBy: { createdAt: "desc" },
          });
          break;

        default:
          return NextResponse.json(
            { success: false, message: "Invalid search type" },
            { status: 400 }
          );
      }

      console.log(`[EXPLORE] Found ${results.length} results for "${query}" (${type})`);
      return NextResponse.json({ 
        success: true, 
        data: results,
        query,
        type,
        count: results.length
      }, { status: 200 });

    } catch (dbError: any) {
      console.error("[EXPLORE] Database error:", dbError);
      
      // Check for specific database connection issues
      if (dbError.code === 'P1001' || dbError.message?.includes('connection') || dbError.message?.includes('timeout')) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Database connection issue. Please try again in a few moments.",
            error: "connection_error"
          },
          { status: 503 }
        );
      }
      
      // Check for Supabase-specific errors
      if (dbError.message?.includes('Supabase') || dbError.message?.includes('edge function')) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Service temporarily unavailable. Please try again later.",
            error: "service_unavailable"
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          message: "Database error occurred. Please try again.",
          error: "database_error"
        },
        { status: 500 }
      );
    } finally {
      // Always disconnect to free up connections
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.error("[EXPLORE] Error disconnecting from database:", disconnectError);
      }
    }

  } catch (error) {
    console.error("[EXPLORE] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}