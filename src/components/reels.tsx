"use client";
import { Share, MoreHorizontal, Volume2, VolumeX, Sparkles } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  fullName?: string;
  bio?: string;
  email?: string;
  location?: string | null;
}

interface Reel {
  id: string;
  videoUrl: string;
  caption: string | null;
  createdAt: string;
  userId: string;
  user: User;
}

interface ReelProps {
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
      reels: Reel[];
    };
  };
  isLoading?: boolean;
}

const ReelSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full max-w-xl bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg overflow-hidden"
    >
      <div className="flex justify-between items-center p-4 border-b border-border/40">
        <div className="flex gap-3 items-center">
          <div className="rounded-full w-10 h-10 bg-muted/60 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-28 bg-muted/40 rounded animate-pulse" />
            <div className="h-3 w-20 bg-muted/30 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-10 bg-muted/60 rounded-full animate-pulse" />
      </div>
      <div className="w-full aspect-[9/16] bg-muted/40 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <div className="h-8 w-8 bg-muted/60 rounded-full animate-pulse" />
          </div>
          <div className="h-8 w-8 bg-muted/60 rounded-full animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted/40 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted/30 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};

const Reel = ({ postData, isLoading = false }: ReelProps) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [mutedStates, setMutedStates] = useState<{ [key: number]: boolean }>({});
  const [mediaErrors, setMediaErrors] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const user = {
    id: postData.data.id,
    username: postData.data.username,
    avatarUrl: postData.data.avatarUrl,
    fullName: postData.data.fullName,
    bio: postData.data.bio,
    email: postData.data.email,
    location: postData.data.location,
  };

  const userReels = postData.data.reels;

  const toggleMute = (index: number) => {
    setMutedStates(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleVideoPlay = (index: number) => {
    const video = videoRefs.current[index];
    if (video && !mediaErrors[index]) {
      if (video.paused) {
        if (playingIndex !== null && playingIndex !== index) {
          const currentVideo = videoRefs.current[playingIndex];
          if (currentVideo) currentVideo.pause();
        }
        video.play().then(() => setPlayingIndex(index)).catch(e => {
          console.error("Video playback error:", e);
          setMediaErrors(prev => ({ ...prev, [index]: true }));
        });
      } else {
        video.pause();
        setPlayingIndex(null);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      let closestIndex: number | null = null;
      let smallestDistance = Infinity;

      reelRefs.current.forEach((reel, index) => {
        if (reel && userReels[index]?.videoUrl && !mediaErrors[index]) {
          const rect = reel.getBoundingClientRect();
          const centerY = window.innerHeight / 2;
          const reelCenter = rect.top + rect.height / 2;
          const distance = Math.abs(reelCenter - centerY);

          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestIndex = index;
          }
        }
      });

      if (closestIndex !== null) {
        const reel = reelRefs.current[closestIndex];
        if (reel) {
          const rect = reel.getBoundingClientRect();
          const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
          const visibilityRatio = visibleHeight / rect.height;

          if (visibilityRatio > 0.5) {
            if (playingIndex !== closestIndex) {
              if (playingIndex !== null) {
                const currentVideo = videoRefs.current[playingIndex];
                if (currentVideo) currentVideo.pause();
              }
              const video = videoRefs.current[closestIndex];
              if (video) {
                video.play().then(() => setPlayingIndex(closestIndex)).catch(e => {
                  console.error("Video playback error:", e);
                  setMediaErrors(prev => ({ ...prev, [closestIndex]: true }));
                });
              }
            }
          } else if (playingIndex === closestIndex) {
            const video = videoRefs.current[closestIndex];
            if (video) video.pause();
            setPlayingIndex(null);
          }
        }
      } else if (playingIndex !== null) {
        const video = videoRefs.current[playingIndex];
        if (video) video.pause();
        setPlayingIndex(null);
      }
    };

    const debouncedScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", debouncedScroll);
    return () => window.removeEventListener("scroll", debouncedScroll);
  }, [playingIndex, userReels, mediaErrors]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full items-center py-4">
        {[...Array(3)].map((_, index) => (
          <ReelSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isLoading && (!userReels || userReels.length === 0)) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-full py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg p-8 text-center space-y-3 max-w-md">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Pinggo</span>
          </div>
          <div className="text-muted-foreground text-lg font-semibold">No reels yet</div>
          <p className="text-muted-foreground">When you create reels, they'll appear here</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full items-center py-4">
      {userReels.map((reel, index) => (
        <motion.div
          key={reel.id}
          ref={el => { reelRefs.current[index] = el; }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="flex flex-col w-full max-w-xl bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg overflow-hidden"
        >
          {/* Reel Header */}
          <div className="flex justify-between items-center p-4 border-b border-border/40">
            <div className="flex gap-3 items-center">
              <Image
                src={reel.user.avatarUrl || "/default-profile.png"}
                width={40}
                height={40}
                alt={`${reel.user.username}'s profile`}
                className="rounded-full w-10 h-10 border-2 border-primary/30 object-cover"
              />
              <div>
                <p className="font-bold text-base">{reel.user.username}</p>
                {reel.user.location && (
                  <p className="text-muted-foreground text-xs">
                    {reel.user.location}
                  </p>
                )}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-10 w-10 hover:bg-primary/10"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Video Content */}
          <div className="relative w-full aspect-[9/16] bg-black flex items-center justify-center">
            {reel.videoUrl && !mediaErrors[index] ? (
              <>
                <video
                  ref={el => { videoRefs.current[index] = el; }}
                  className="w-full h-full object-cover"
                  src={reel.videoUrl}
                  loop
                  muted={mutedStates[index] ?? true}
                  playsInline
                  onClick={() => toggleVideoPlay(index)}
                  onError={() => setMediaErrors(prev => ({ ...prev, [index]: true }))}
                />
                
                {playingIndex !== index && (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={() => toggleVideoPlay(index)}
                  >
                    <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
                
                <button
                  className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2 shadow-lg hover:bg-primary/80 transition-colors"
                  onClick={e => {
                    e.stopPropagation();
                    toggleMute(index);
                  }}
                >
                  {mutedStates[index] ?? true ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
              </>
            ) : (
              <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                <p className="text-muted-foreground">
                  {mediaErrors[index] ? "Error loading video" : "No video available"}
                </p>
              </div>
            )}
          </div>

          {/* Caption and Actions */}
          <div className="p-4 space-y-3">
            {/* Caption */}
            {reel.caption && (
              <p className="text-sm text-foreground">
                <span className="font-semibold">{reel.user.username}</span>{" "}
                <span>{reel.caption}</span>
              </p>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 hover:bg-primary/10"
                >
                  <Share className="w-5 h-5" />
                </Button>
              </div>
              
              <p className="text-muted-foreground text-xs">
                {new Date(reel.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Reel;