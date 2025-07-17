'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!isLoaded) return;

      if (!user) {
        router.push('/sign-in');
        return;
      }

      try {
        setIsChecking(true);
        
        // Check if user is registered in our database
        const response = await api.get('/user/check-registration');
        
        if (response.data.exists) {
          setIsRegistered(true);
        } else {
          // User needs to complete registration
          router.push('/registration');
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        // If there's an error, redirect to registration
        router.push('/registration');
      } finally {
        setIsChecking(false);
      }
    };

    checkUserStatus();
  }, [user, isLoaded, router]);

  if (!isLoaded || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to sign-in
  }

  if (!isRegistered) {
    return null; // Will redirect to registration
  }

  return <>{children}</>;
}; 