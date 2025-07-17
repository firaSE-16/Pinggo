"use client"
import { checkMediaType } from "@/lib/utils";
import { Heart, MessageSquare, Share, MoreHorizontal, Bookmark, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Reel from "@/components/reels";
import { useReel } from "@/hooks/userReel";
import { useProfile } from "@/hooks/useProfile";

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
    const { data:reels, isLoading:isLoadingReels, error:errorReel } = useReel();
  const { data: user, isLoading:isLoadingProfile, error:errorProfile } = useProfile();
        const [isMounted, setIsMounted] = useState(false);
      
        useEffect(() => {

          setIsMounted(true);
        }, []);
        
      
        if (!isMounted) {
          return null; 
        }
      
        if (isLoadingReels || isLoadingProfile) return <p>Loading profile...</p>;
        if (errorProfile||errorReel) return <p>Error loading profile</p>;
    
      
    
     
    
     

  return (
    <div className="flex min-h-screen flex-col overflow-y-auto gap-4 w-full items-center scrollbar-hide py-2 bg-background text-foreground">
     <Reel
    postData={{
      success: true,
      data: {
        id:user.name,
        username:user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        location: user.location,
        reels: reels,
      },
    }}
  />
    </div>
  );
};

export default Reels;