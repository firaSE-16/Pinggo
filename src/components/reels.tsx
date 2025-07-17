"use client";
import { Share, MoreHorizontal, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

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
      className="flex flex-col w-full max-w-[400px] border rounded-xl overflow-hidden bg-card shadow-sm"
    >
      <div className="flex justify-between items-center p-2 border-b">
        <div className="flex gap-2 items-center">
          <div className="rounded-full w-7 h-7 bg-gray-200 animate-pulse" />
          <div className="space-y-1">
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-2 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-7 w-7 bg-gray-200 rounded-full animate-pulse" />
      </div>

      <div className="w-full h-[450px] bg-gray-200 animate-pulse" />

      <div className="p-2 space-y-2">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="h-7 w-7 bg-gray-200 rounded-full animate-pulse" />
          </div>
          <div className="h-7 w-7 bg-gray-200 rounded-full animate-pulse" />
        </div>

        <div className="space-y-1">
          <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
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
  


  const userReels = postData.data.reels
  console.log(userReels[0])

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
      <div className="flex flex-col overflow-y-auto gap-4 w-full items-center scrollbar-hide py-2 bg-background text-foreground">
        {[...Array(3)].map((_, index) => (
          <ReelSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isLoading && (!userReels || userReels.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8">
        <div className="text-center space-y-2">
          <div className="text-muted-foreground text-lg">No reels yet</div>
          <p className="text-muted-foreground text-sm">When you create reels, they'll appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto gap-4 w-full items-center scrollbar-hide py-2 bg-background text-foreground">
      {userReels.map((reel, index) => {
        return (
          <motion.div
            key={reel.id}
            ref={el => {
              reelRefs.current[index] = el;
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex flex-col w-full max-w-[400px] border rounded-xl overflow-hidden bg-card shadow-sm"
          >
            <div className="flex justify-between items-center p-2 border-b">
              <div className="flex gap-2 items-center">
                <Image
                  src={reel.user.avatarUrl || "/default-profile.png"}
                  width={32}
                  height={32}
                  alt={`${reel.user.username}'s profile`}
                  className="rounded-full w-7 h-7 border border-primary/30 object-cover"
                />
                <div>
                  <p className="font-medium text-sm">{reel.user.username}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="w-full h-[450px] bg-black flex items-center justify-center relative">
              {reel.videoUrl && !mediaErrors[index] ? (
                <>
                  <video
                    ref={el => {
                      videoRefs.current[index] = el;
                    }}
                    className="w-full h-full object-cover cursor-pointer"
                    src={reel.videoUrl}
                    loop
                    muted={mutedStates[index] ?? true}
                    playsInline
                    onClick={() => toggleVideoPlay(index)}
                    onError={() => {
                      console.error(`Error loading video for reel ${reel.id}`);
                      setMediaErrors(prev => ({ ...prev, [index]: true }));
                    }}
                  >
                    <source src={reel.videoUrl} type="video/mp4" />
                    <source src={reel.videoUrl} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
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
                    className="absolute bottom-2 right-2 bg-black/50 rounded-full p-1.5"
                    onClick={e => {
                      e.stopPropagation();
                      toggleMute(index);
                    }}
                  >
                    {mutedStates[index] ?? true ? (
                      <VolumeX className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">{mediaErrors[index] ? "Error loading video" : "No video available"}</p>
                </div>
              )}
            </div>

            <div className="p-2">
              <div className="flex justify-between items-center mb-1">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-primary/10 h-7 w-7"
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {reel.caption && (
                <p className="mb-1 text-xs">
                  <span className="font-semibold">{reel.user.username}</span> <span>{reel.caption}</span>
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Reel;