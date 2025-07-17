"use client";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Reel from "@/components/reels";
import { useReel } from "@/hooks/userReel";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const Reels = () => {
  const { data: reels, isLoading: isLoadingReels, error: errorReel } = useReel();
  const { data: user, isLoading: isLoadingProfile, error: errorProfile } = useProfile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoadingReels || isLoadingProfile) {
    return (
      <div className="flex min-h-screen flex-col gap-6 w-full items-center py-4 bg-background text-foreground">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
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
        ))}
      </div>
    );
  }

  if (errorProfile || errorReel) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full py-12"
      >
        <div className="bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg p-8 text-center space-y-3 max-w-md">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Pinggo</span>
          </div>
          <div className="text-muted-foreground text-lg font-semibold">Error loading reels</div>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={cn(
      "flex min-h-screen flex-col gap-6 w-full items-center py-4",
      "bg-background text-foreground"
    )}>
      <Reel
        postData={{
          success: true,
          data: {
            id: user.id,
            username: user.username,
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