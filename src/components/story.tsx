"use client";
import Image from "next/image";
import React, { useState } from "react";
import OpenStory from "./OpenStory";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="shrink-0 flex flex-col gap-2 items-center"
    >
      <div className="rounded-full border-2 border-primary/30 w-16 h-16 bg-muted/40 animate-pulse" />
      <div className="h-3 w-12 bg-muted/40 rounded animate-pulse" />
    </motion.div>
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

  const userStories = postData.data.stories;

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto p-4 scrollbar-hide glassy-card rounded-2xl">
        {[...Array(8)].map((_, index) => (
          <StorySkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isLoading && (!userStories || userStories.length === 0)) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-6 glassy-card rounded-2xl"
      >
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold">Pinggo</span>
          </div>
          <p className="text-muted-foreground font-medium">No stories available</p>
          <p className="text-muted-foreground text-sm">
            When you post stories, they'll appear here
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {isOpen && (
        <OpenStory
          stories={userStories}
          currentIndex={currentIndex}
          onClose={() => setIsOpen(false)}
        />
      )}
      
      <div className="flex gap-4 overflow-x-auto p-4 scrollbar-hide glassy-card rounded-2xl">
        {userStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="shrink-0 flex flex-col gap-2 items-center cursor-pointer group"
            onClick={() => {
              setCurrentIndex(index);
              setIsOpen(true);
            }}
          >
            <div className="relative rounded-full border-2 border-primary p-0.5 group-hover:border-primary/80 transition-colors">
              <div className="rounded-full w-14 h-14 bg-gradient-to-br from-primary/10 to-muted overflow-hidden">
                <Image
                  src={story.user.avatarUrl || "/default-profile.png"}
                  alt={story.user.username}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </div>
              {index === 0 && (
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 border-2 border-background">
                  <Sparkles className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-foreground/90 group-hover:text-primary transition-colors">
              {story.user.username}
            </span>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default Story;