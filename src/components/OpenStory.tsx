"use client"
import React, { useEffect, useState, useRef } from "react";
import { useStoryStore } from "./store/story";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ChevronLeft, ChevronRight } from "lucide-react";

type StoryItem = {
  username: string;
  profile: string;
  media: string;
};

type Props = {
  storyList: StoryItem[];
  currentIndex: number;
  onClose?: () => void;
};

const STORY_DURATION = 5000; // 5 seconds per story

const OpenStory = ({ storyList, currentIndex, onClose }: Props) => {
  const { next, prev, setLiked, currentIndex: storeIndex, liked, setCurrentIndex } = useStoryStore();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const currentStory = storyList[storeIndex];
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentIndex(currentIndex);
  }, [currentIndex, setCurrentIndex]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Clear any existing interval
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
        return p + (100 / (STORY_DURATION / 50)); // Increment based on duration
      });
    }, 50); // Update every 50ms for smooth progress

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [storeIndex, mounted, next]);

  if (!mounted) return null;

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
      >
        <ChevronLeft className="w-7 h-7" />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white shadow-lg hidden md:flex items-center justify-center transition-colors duration-200"
        onClick={next}
        aria-label="Next story"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 flex gap-1 px-2 pt-2 z-40">
        {storyList.map((_, idx) => (
          <div
            key={idx}
            className="flex-1 h-full bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className={`h-full bg-white transition-all duration-100 ease-linear ${idx < storeIndex ? 'w-full' : idx === storeIndex ? '' : 'w-0'}`}
              style={idx === storeIndex ? { width: `${progress}%` } : {}}
            />
          </div>
        ))}
      </div>

      {/* Prev/Next Story Previews (Instagram-like) */}
      <div className="hidden md:flex items-center justify-end w-[25%] h-full pr-8">
        <AnimatePresence>
          {storeIndex > 0 && (
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
                src={storyList[storeIndex - 1].media}
                layout="fill"
                objectFit="cover"
                alt="Previous Story"
                className="rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2 rounded-lg">
                <span className="text-white text-xs font-semibold">{storyList[storeIndex - 1].username}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Current Story */}
      <div className="flex flex-col justify-center items-center w-full max-w-md h-[90vh] relative z-50">
        <AnimatePresence mode="wait">
          {currentStory && (
            <motion.div
              key={storeIndex} // Key changes to re-trigger animation on story change
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full h-full"
            >
              <Image
                src={currentStory.media}
                layout="fill"
                objectFit="cover"
                alt="Current Story"
                className="rounded-xl object-cover shadow-2xl"
                onClick={() => next()} // Tap right to go next, tap left is handled by separate div
                draggable={false}
                priority // Prioritize loading of the current story
              />
              {/* Overlay user info */}
              <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                <Image
                  src={currentStory.profile}
                  width={36}
                  height={36}
                  alt="User Avatar"
                  className="rounded-full object-cover border-2 border-white"
                />
                <span className="text-white font-semibold text-lg drop-shadow-md">{currentStory.username}</span>
              </div>
              {/* Like/React button */}
              <button
                className="absolute bottom-6 right-6 bg-black/40 hover:bg-black/60 rounded-full p-3 text-white shadow-lg backdrop-blur-sm transition-colors duration-200"
                onClick={() => setLiked(currentStory.username)}
                aria-label="Like story"
              >
                <Heart className={`w-6 h-6 ${liked === currentStory.username ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
              {/* Navigation click zones (mobile) */}
              <div
                className="absolute inset-y-0 left-0 w-1/2 cursor-pointer md:hidden"
                onClick={(e) => { e.stopPropagation(); prev(); }}
              />
              <div
                className="absolute inset-y-0 right-0 w-1/2 cursor-pointer md:hidden"
                onClick={(e) => { e.stopPropagation(); next(); }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="hidden md:flex items-center justify-start w-[25%] h-full pl-8">
        <AnimatePresence>
          {storeIndex < storyList.length - 1 && (
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
                src={storyList[storeIndex + 1].media}
                layout="fill"
                objectFit="cover"
                alt="Next Story"
                className="rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2 rounded-lg">
                <span className="text-white text-xs font-semibold">{storyList[storeIndex + 1].username}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OpenStory;