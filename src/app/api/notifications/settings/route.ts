import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
     const { userId } = await auth();
        
        if (!userId) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    
        const clerk = await clerkClient();
        const clerkUser = await clerk.users.getUser(userId);
        const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
    
        if (!email) {
          return NextResponse.json({ error: 'Email not found' }, { status: 400 });
        }
        console.log('Checking registration for email:', email);
    
    const user = await prisma.user.findFirst({
      where: {
       
           email}
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // For now, return default settings since your User model doesn't have notification fields
    // You can add these fields to your User model later if needed
    const defaultSettings = {
      userId: user.id,
      messageNotifications: true,
      likeNotifications: true,
      commentNotifications: true,
      followNotifications: true,
      mentionNotifications: true,
      emailNotifications: false,
      pushNotifications: false,
    };

    return NextResponse.json({
      success: true,
      data: defaultSettings,
    });
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Get user from database
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { email: userId }
        ]
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // For now, just return the settings since your User model doesn't have these fields
    // You can add these fields to your User model later if needed
    const updatedSettings = {
      userId: user.id,
      messageNotifications: body.messageNotifications ?? true,
      likeNotifications: body.likeNotifications ?? true,
      commentNotifications: body.commentNotifications ?? true,
      followNotifications: body.followNotifications ?? true,
      mentionNotifications: body.mentionNotifications ?? true,
      emailNotifications: body.emailNotifications ?? false,
      pushNotifications: body.pushNotifications ?? false,
    };

    return NextResponse.json({
      success: true,
      data: updatedSettings,
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to update notification settings' },
      { status: 500 }
    );
  }
} 