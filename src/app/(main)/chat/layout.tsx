'use client';

import React from 'react';
import { ChatList } from '@/components/ChatList';
import { ChatInterface } from '@/components/ChatInterface';
import { useParams } from 'next/navigation';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams();
  const hasActiveChat = !!id;

  return (
    <div className="flex h-full">
      {/* Chat List - Hidden on mobile when chat is active */}
      <div className={`
        ${hasActiveChat ? 'hidden md:block' : 'block'}
        w-full md:w-80 lg:w-96 border-r border-border
      `}>
        <ChatList />
      </div>

      {/* Chat Interface - Full width on mobile, remaining space on desktop */}
      <div className={`
        ${hasActiveChat ? 'block' : 'hidden md:block'}
        flex-1
      `}>
        {hasActiveChat ? (
          <ChatInterface />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a chat</h3>
              <p className="text-muted-foreground">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 