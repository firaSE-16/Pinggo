'use client';

import { Suspense } from "react";
import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

function SignUpContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Join Pinggo</h1>
          <p className="text-muted-foreground">
            Create your account to get started
          </p>
        </div>
        <SignUp 
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

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpContent />
    </Suspense>
  );
}