"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/90 backdrop-blur-md">
      {/* Close Button */}
      {onClose && (
        <button
          className="absolute top-6 right-8 z-50 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white transition-colors duration-200"
          onClick={onClose}
          aria-label="Close story"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Navigation Buttons (Desktop) */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white shadow-lg hidden md:flex items-center justify-center transition-colors duration-200"
        onClick={prev}
        aria-label="Previous story"
        disabled={currentStoryIndex === 0}
      >
        <ChevronLeft className="w-7 h-7" />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white shadow-lg hidden md:flex items-center justify-center transition-colors duration-200"
        onClick={next}
        aria-label="Next story"
        disabled={currentStoryIndex === stories.length - 1}
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 flex gap-1 px-2 pt-2 z-40">
        {stories.map((_, idx) => (
          <div
            key={idx}
            className="flex-1 h-full bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className={`h-full bg-white transition-all duration-100 ease-linear ${idx < currentStoryIndex ? 'w-full' : idx === currentStoryIndex ? '' : 'w-0'}`}
              style={idx === currentStoryIndex ? { width: `${progress}%` } : {}}
            />
          </div>
        ))}
      </div>

      {/* Prev/Next Story Previews (Instagram-like) */}
      <div className="hidden md:flex items-center justify-end w-[25%] h-full pr-8">
        <AnimatePresence>
          {currentStoryIndex > 0 && (
            <motion.div
              key={`prev-story-preview`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 0.6, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="relative w-32 h-56 rounded-lg overflow-hidden shadow-xl cursor-pointer"
              onClick={prev}
            >
              <Image
                src={stories[currentStoryIndex - 1].mediaUrl}
                fill
                alt="Previous Story"
                className="rounded-lg object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2 rounded-lg">
                <span className="text-white text-xs font-semibold">
                  {stories[currentStoryIndex - 1].user.username}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Current Story */}
      <div className="flex flex-col justify-center items-center w-full max-w-md h-[90vh] relative z-50">
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
              className="rounded-xl object-cover shadow-2xl"
              onClick={() => next()}
              draggable={false}
              priority
            />
            {/* Overlay user info */}
            <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
              <Image
                src={currentStory.user.profileImageUrl || "/default-profile.png"}
                width={36}
                height={36}
                alt={currentStory.user.username}
                className="rounded-full object-cover border-2 border-white"
              />
              <span className="text-white font-semibold text-lg drop-shadow-md">
                {currentStory.user.username}
              </span>
            </div>
            {/* Caption */}
            {currentStory.caption && (
              <div className="absolute bottom-6 left-6 right-6 bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm">
                <span className="text-white text-sm">{currentStory.caption}</span>
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

      <div className="hidden md:flex items-center justify-start w-[25%] h-full pl-8">
        <AnimatePresence>
          {currentStoryIndex < stories.length - 1 && (
            <motion.div
              key={`next-story-preview`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 0.6, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="relative w-32 h-56 rounded-lg overflow-hidden shadow-xl cursor-pointer"
              onClick={next}
            >
              <Image
                src={stories[currentStoryIndex + 1].mediaUrl}
                fill
                alt="Next Story"
                className="rounded-lg object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2 rounded-lg">
                <span className="text-white text-xs font-semibold">
                  {stories[currentStoryIndex + 1].user.username}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OpenStory;