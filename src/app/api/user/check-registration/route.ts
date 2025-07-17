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
           email
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
      }
    });
    console.log('Found user in database:', user);

    const response = {
      success: true,
      exists: !!user,
      user: user || null
    };
    
    console.log('API response:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error checking user registration:', error);
    return NextResponse.json(
      { error: 'Failed to check user registration' },
      { status: 500 }
    );
  }
} 