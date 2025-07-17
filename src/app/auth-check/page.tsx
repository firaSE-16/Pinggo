'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function AuthCheckPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    // If no user, redirect to sign-in
    if (!user) {
      router.push('/sign-in');
      return;
    }

    // If user exists in Clerk, redirect to home
    router.push('/home');
  }, [user, isLoaded, router]);

  if (!isLoaded || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-lg font-medium">Checking your account...</p>
          <p className="text-sm text-muted-foreground">Please wait while we verify your registration</p>
        </div>
      </div>
    );
  }

  return null;
} 