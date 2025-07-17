"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  username: string;
  profileImageUrl?: string;
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

interface Props {
  stories: StoryType[];
  currentIndex: number;
  onClose?: () => void;
}

const STORY_DURATION = 5000; // 5 seconds per story

const OpenStory = ({ stories, currentIndex, onClose }: Props) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(currentIndex);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  const currentStory = stories[currentStoryIndex];

  const next = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (onClose) {
      onClose();
    }
  };

  const prev = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    setProgress(0);
    progressIntervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressIntervalRef.current!);
          next();
          return 0;
        }
        return p + (100 / (STORY_DURATION / 50));
      });
    }, 50);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentStoryIndex, mounted]);

  if (!mounted || !currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/80 backdrop-blur-2xl">
      {/* Pinggo Logo */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-white">Pinggo</span>
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          className="absolute top-6 right-6 z-50 bg-card/80 hover:bg-card rounded-full p-2 text-foreground shadow-lg transition-colors duration-200 backdrop-blur-lg border border-border"
          onClick={onClose}
          aria-label="Close story"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Navigation Buttons */}
      <button
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-card/80 hover:bg-card rounded-full p-2 text-foreground shadow-xl",
          "flex items-center justify-center transition-colors duration-200 backdrop-blur-lg border border-border",
          "h-10 w-10 md:h-12 md:w-12",
          currentStoryIndex === 0 && "opacity-50 cursor-default"
        )}
        onClick={prev}
        aria-label="Previous story"
        disabled={currentStoryIndex === 0}
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-card/80 hover:bg-card rounded-full p-2 text-foreground shadow-xl",
          "flex items-center justify-center transition-colors duration-200 backdrop-blur-lg border border-border",
          "h-10 w-10 md:h-12 md:w-12",
          currentStoryIndex === stories.length - 1 && "opacity-50 cursor-default"
        )}
        onClick={next}
        aria-label="Next story"
        disabled={currentStoryIndex === stories.length - 1}
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Progress Bar */}
      <div className="absolute top-4 left-0 w-full h-1.5 flex gap-1 px-4 z-40">
        {stories.map((_, idx) => (
          <div
            key={idx}
            className="flex-1 h-full bg-white/20 rounded-full overflow-hidden"
          >
            <div
              className={`h-full bg-primary transition-all duration-100 ease-linear ${
                idx < currentStoryIndex ? 'w-full' : idx === currentStoryIndex ? '' : 'w-0'
              }`}
              style={idx === currentStoryIndex ? { width: `${progress}%` } : {}}
            />
          </div>
        ))}
      </div>

      {/* Current Story */}
      <div className="flex flex-col justify-center items-center w-full h-full max-w-2xl mx-auto relative z-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStoryIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={currentStory.mediaUrl}
              fill
              alt={currentStory.caption || "Current Story"}
              className="object-contain w-full h-full bg-black"
              onClick={() => next()}
              draggable={false}
              priority
            />
            
            {/* User info */}
            <div className="absolute top-4 left-4 flex items-center gap-3 bg-card/80 backdrop-blur-lg px-4 py-2 rounded-full shadow-lg border border-border">
              <Image
                src={currentStory.user.profileImageUrl || "/default-profile.png"}
                width={32}
                height={32}
                alt={currentStory.user.username}
                className="rounded-full object-cover border-2 border-primary"
              />
              <span className="text-foreground font-semibold text-sm">
                {currentStory.user.username}
              </span>
            </div>
            
            {/* Caption */}
            {currentStory.caption && (
              <div className="absolute bottom-4 left-4 right-4 bg-card/80 backdrop-blur-lg px-4 py-3 rounded-xl shadow-lg border border-border">
                <span className="text-foreground text-sm">
                  {currentStory.caption}
                </span>
              </div>
            )}
            
            {/* Navigation click zones (mobile) */}
            <div
              className="absolute inset-y-0 left-0 w-1/2 cursor-pointer md:hidden"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            />
            <div
              className="absolute inset-y-0 right-0 w-1/2 cursor-pointer md:hidden"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OpenStory;