'use client';

import { ChatList } from '@/components/ChatList';
import { ChatSkeleton } from '@/components/skeletons/UniversalSkeleton';
import { useState, useEffect } from 'react';

export default function ChatPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ChatSkeleton />;
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-background">
      <ChatList />
    </div>
  );
}