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
    const checkUserRegistration = async () => {
      if (!isLoaded) {
        return;
      }

      // If no user, redirect to sign-in
      if (!user) {
        router.push('/sign-in');
        return;
      }

      try {
        setIsChecking(true);
        
        // Check if user exists in our database
        const response = await api.get('/api/user/check-registration');
        
        console.log('Auth check response:', response.data);
        
        if (response.data.exists === true) {
          console.log('User exists, redirecting to home');
          // User is fully registered, redirect to home
          router.push('/home');
        } else {
          console.log('User does not exist, redirecting to registration');
          // User needs to complete registration
          router.push('/registration');
        }
      } catch (error) {
        console.error('Error checking user registration:', error);
        // If there's an error, assume user needs registration
        router.push('/registration');
      } finally {
        setIsChecking(false);
      }
    };

    checkUserRegistration();
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