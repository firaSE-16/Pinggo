'use client';

import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back to Pinggo</h1>
          <p className="text-muted-foreground">
            Sign in to continue to your account
          </p>
        </div>
        <SignIn 
          redirectUrl={redirectUrl || '/auth-check'}
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none border border-border bg-card",
            }
          }}
        />
      </div>
    </div>
  );
}