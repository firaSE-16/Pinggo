"use client";
import Image from "next/image";
import React, { useState } from "react";
import OpenStory from "./OpenStory";

interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  fullName?: string;
  bio?: string;
  email?: string;
  location?: string | null;
}

interface StoryType {
  id: string;
  mediaUrl: string;
  caption?: string;
  expiresAt: string;
  createdAt: string;
  userId: string;
  user: User;
}

interface StoryProps {
  postData: {
    success: boolean;
    data: {
      id: string;
      username: string;
      email: string;
      fullName: string;
      bio: string;
      avatarUrl: string;
      location: string | null;
      stories: StoryType[];
    };
  };
  isLoading?: boolean;
}

const StorySkeleton = () => {
  return (
    <div className="shrink-0 flex flex-col gap-2 items-center">
      <div className="rounded-full border-4 border-primary w-18 h-18">
        <div className="w-full h-full rounded-full bg-gray-200 animate-pulse" />
      </div>
      <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
    </div>
  );
};

const Story: React.FC<StoryProps> = ({ postData, isLoading = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const user = {
    id: postData.data.id,
    username: postData.data.username,
    avatarUrl: postData.data.avatarUrl,
    fullName: postData.data.fullName,
    bio: postData.data.bio,
    email: postData.data.email,
    location: postData.data.location,
  };

  const userStories = postData.data.stories

  if (isLoading) {
    return (
      <div className="flex space-x-6 overflow-x-auto p-4 scrollbar-hide h-full bg-gradient-to-b from-background to-muted/40 rounded-xl">
        {[...Array(8)].map((_, index) => (
          <StorySkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isLoading && (!userStories || userStories.length === 0)) {
    return (
      <div className="flex items-center justify-center p-4 h-full bg-gradient-to-b from-background to-muted/40 rounded-xl">
        <div className="text-center text-muted-foreground">
          <p>No stories available</p>
          <p className="text-sm">When you post stories, they'll appear here</p>
        </div>
      </div>
    );
  }

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full">
      <OpenStory
        stories={userStories}
        currentIndex={currentIndex}
        onClose={() => setIsOpen(false)}
      />
    </div>
  ) : (
    <div className="flex space-x-6 overflow-x-auto p-4 scrollbar-hide h-full bg-gradient-to-b from-background to-muted/40 rounded-xl">
      {userStories.map((story, index) => (
        <div
          key={story.id}
          className="shrink-0 flex flex-col gap-2 items-center cursor-pointer group"
          onClick={() => {
            setCurrentIndex(index);
            setIsOpen(true);
          }}
        >
          <div className="rounded-full border-4 border-primary group-hover:scale-105 transition-transform duration-200">
            <Image
              src={story.user.avatarUrl || "/default-profile.png"}
              alt={story.user.username}
              width={72}
              height={72}
              className="object-cover rounded-full w-18 h-18"
            />
          </div>
          <span className="text-xs font-medium text-foreground/80 group-hover:text-primary transition-colors duration-200">
            {story.user.username}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Story;