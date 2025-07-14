"use client"
import { checkMediaType } from "@/lib/utils";
import { Heart, MessageSquare, Share, MoreHorizontal, Bookmark, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Comment {
  user: string;
  text: string;
}

interface Reels {
  username: string;
  likes: number;
  src: string;
  comment: Comment[];
}

const userReels: Reels[] = [
  {
    username: "loarif",
    likes: 701,
    src: "/devvideo/pin1.mp4",
    comment: [{
      user: "hana_dev",
      text: "Love the vibes in this one!"
    }]
  },
  {
    username: "hana_dev",
    likes: 134,
    src: "/devvideo/pin2.mp4",
    comment: [{
      user: "coder_eli",
      text: "🔥🔥🔥 Amazing video!"
    }]
  },
  {
    username: "coder_eli",
    likes: 298,
    src: "/devvideo/pin3.mp4",
    comment: []
  },
  {
    username: "techie_luna",
    likes: 842,
    src: "/devvideo/pin4.mp4",
    comment: [{
      user: "sami_views",
      text: "Very clean edit! What tool did you use?"
    }]
  },
  {
    username: "nati_shots",
    likes: 120,
    src: "/devvideo/pin5.mp4",
    comment: []
  },
  {
    username: "abiy99",
    likes: 455,
    src: "/devvideo/pin6.mp4",
    comment: [{
      user: "mimi.art",
      text: "This is underrated content 🔥"
    }]
  },
  {
    username: "mimi.art",
    likes: 653,
    src: "/devvideo/pin7.mp4",
    comment: [{
      user: "loarif",
      text: "Artistic! Great shot 👏"
    }]
  },
  {
    username: "tesfa_online",
    likes: 101,
    src: "/devvideo/pin8.mp4",
    comment: []
  }
];

const Reels = () => {
  const [comments, setComments] = useState<{[key: number]: string}>({});
  const [likes, setLikes] = useState<{[key: number]: number}>(() => {
    const initialLikes: {[key: number]: number} = {};
    userReels.forEach((reels, index) => {
      initialLikes[index] = reels.likes;
    });
    return initialLikes;
  });
  const [likedReels, setLikedReels] = useState<{[key: number]: boolean}>({});
  const [savedReels, setSavedReels] = useState<{[key: number]: boolean}>({});
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [mutedStates, setMutedStates] = useState<{[key: number]: boolean}>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const reelsRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleSubmit = (e: React.FormEvent, index: number) => {
    e.preventDefault();
    if (comments[index]?.trim()) {
      console.log(`Comment submitted for reels ${index}:`, comments[index]);
      setComments(prev => ({...prev, [index]: ''}));
    }
  };

  const handleLike = (index: number) => {
    setLikedReels(prev => {
      const isLiked = !prev[index];
      setLikes(prevLikes => ({
        ...prevLikes,
        [index]: isLiked ? prevLikes[index] + 1 : prevLikes[index] - 1
      }));
      return {...prev, [index]: isLiked};
    });
    
    if (checkMediaType(userReels[index].src) === 'video' && !likedReels[index]) {
      const video = videoRefs.current[index];
      if (video) {
        video.currentTime = 0;
        video.play().catch(e => console.log("Autoplay prevented"));
      }
    }
  };

  const handleSave = (index: number) => {
    setSavedReels(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleMute = (index: number) => {
    setMutedStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatLikeCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const toggleVideoPlay = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        // Pause any currently playing video
        if (playingIndex !== null && playingIndex !== index) {
          const currentVideo = videoRefs.current[playingIndex];
          if (currentVideo) currentVideo.pause();
        }
        video.play().then(() => setPlayingIndex(index));
      } else {
        video.pause();
        setPlayingIndex(null);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      let closestIndex: React.SetStateAction<number | null> = null;
      let smallestDistance = Infinity;

      reelsRefs.current.forEach((reels, index) => {
        if (reels && checkMediaType(userReels[index].src) === 'video') {
          const rect = reels.getBoundingClientRect();
          const centerY = window.innerHeight / 2;
          const reelsCenter = rect.top + rect.height / 2;
          const distance = Math.abs(reelsCenter - centerY);

          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestIndex = index;
          }
        }
      });

      // Only play the closest video if it's mostly visible (at least 50%)
      if (closestIndex !== null) {
        const reels = reelsRefs.current[closestIndex];
        if (reels) {
          const rect = reels.getBoundingClientRect();
          const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
          const visibilityRatio = visibleHeight / rect.height;

          if (visibilityRatio > 0.5) {
            if (playingIndex !== closestIndex) {
              // Pause current video
              if (playingIndex !== null) {
                const currentVideo = videoRefs.current[playingIndex];
                if (currentVideo) currentVideo.pause();
              }
              // Play new video
              const video = videoRefs.current[closestIndex];
              if (video) {
                video.play().then(() => setPlayingIndex(closestIndex)).catch(e => {});
              }
            }
          } else if (playingIndex === closestIndex) {
            // Pause if our current video is no longer visible enough
            const video = videoRefs.current[closestIndex];
            if (video) video.pause();
            setPlayingIndex(null);
          }
        }
      } else if (playingIndex !== null) {
        // No suitable video found, pause current
        const video = videoRefs.current[playingIndex];
        if (video) video.pause();
        setPlayingIndex(null);
      }
    };

    const debouncedScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', debouncedScroll);
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, [playingIndex]);

  return (
    <div className="flex flex-col overflow-y-auto gap-4 w-full items-center scrollbar-hide py-2 bg-background text-foreground">
      {userReels.map((reels, index) => (
        <motion.div 
          key={index}
          ref={el => { reelsRefs.current[index] = el; }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="relative flex flex-col w-full max-w-[400px] border rounded-xl overflow-hidden bg-card shadow-sm"
        >
          {/* Video container with overlays */}
          <div className="w-full h-[450px] bg-black flex items-center justify-center relative">
            <video
              ref={el => { videoRefs.current[index] = el; }}
              className="w-full h-full object-cover cursor-pointer"
              src={reels.src}
              loop
              muted={mutedStates[index]}
              playsInline
              onClick={() => toggleVideoPlay(index)}
            />
            
            {/* Play/pause overlay */}
            {playingIndex !== index && (
              <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={() => toggleVideoPlay(index)}
              >
                <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            
            {/* Instagram-style top bar */}
            <div className="absolute top-0 left-0 right-0 p-3 z-10 flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Image 
                  src='/developerimage/person1.jpg' 
                  width={32} 
                  height={32} 
                  alt={`${reels.username}'s profile`} 
                  className="rounded-full w-7 h-7 border border-white/80 object-cover"
                />
                <p className="font-semibold text-white drop-shadow-md text-sm">{reels.username}</p>
              </div>
              <button className="text-white">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            {/* Instagram-style right action buttons */}
            <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4 z-10">
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => handleLike(index)}
                  className="p-1"
                >
                  <Heart 
                    fill={likedReels[index] ? "#ef4444" : "none"} 
                    stroke={likedReels[index] ? "#ef4444" : "white"} 
                    className="w-6 h-6 drop-shadow-md"
                  />
                </button>
                <span className="text-white text-xs font-medium drop-shadow-md mt-0.5">
                  {formatLikeCount(likes[index])}
                </span>
              </div>
              
              <div className="flex flex-col items-center">
                <button className="p-1">
                  <MessageSquare className="w-6 h-6 text-white drop-shadow-md" />
                </button>
                <span className="text-white text-xs font-medium drop-shadow-md mt-0.5">
                  {reels.comment.length}
                </span>
              </div>
              
              <button className="p-1">
                <Share className="w-6 h-6 text-white drop-shadow-md" />
              </button>
              
              <button 
                onClick={() => handleSave(index)}
                className="p-1"
              >
                <Bookmark 
                  fill={savedReels[index] ? "white" : "none"} 
                  stroke="white"
                  className="w-6 h-6 drop-shadow-md" 
                />
              </button>
            </div>
            
            {/* Mute/unmute button */}
            <button 
              className="absolute bottom-2 right-2 bg-black/50 rounded-full p-1.5 z-10"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute(index);
              }}
            >
              {mutedStates[index] ? (
                <VolumeX className="w-3.5 h-3.5 text-white" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-white" />
              )}
            </button>
          </div>
          
          {/* Bottom section with caption and comments */}
          <div className="p-2">
            <p className="font-semibold text-xs mb-1">{formatLikeCount(likes[index])} likes</p>
            
            <p className="mb-1 text-xs">
              <span className="font-semibold">{reels.username}</span>{' '}
              <span>Check out my latest reels! What do you think? 👀</span>
            </p>
            
            {reels.comment.length > 0 ? (
              <div className="mb-1">
                <button className="text-muted-foreground text-xs mb-0.5 hover:text-foreground">
                  View all {reels.comment.length} comment{reels.comment.length !== 1 ? 's' : ''}
                </button>
                {reels.comment.slice(0, 2).map((comment, i) => (
                  <div key={i} className="mb-0.5 text-xs">
                    <span className="font-semibold">{comment.user}</span>{' '}
                    <span>{comment.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-2xs mb-1">No comments yet</p>
            )}
            
            <form onSubmit={(e) => handleSubmit(e, index)} className="mt-1">
              <div className="flex gap-1">
                <Textarea 
                  placeholder="Add a comment..." 
                  value={comments[index] || ''}
                  onChange={(e) => setComments(prev => ({...prev, [index]: e.target.value}))}
                  rows={1}
                  className="resize-none flex-1 text-xs h-7"
                />
                <Button 
                  type="submit" 
                  variant="ghost"
                  disabled={!comments[index]?.trim()}
                  className="text-primary disabled:text-muted-foreground h-7 px-1.5 text-xs"
                >
                  Send
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Reels;