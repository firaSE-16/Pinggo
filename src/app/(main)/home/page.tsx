'use client'
import Post from "@/components/post";
import Story from "@/components/story";
import Suggestion from "@/components/suggestion";
import { useOptimizedQueries } from "@/hooks/useOptimizedQueries";
import { HomePageSkeleton } from "@/components/skeletons/HomeSkeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { PerformanceMonitor, trackPageLoad } from "@/components/PerformanceMonitor";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "@/components/Global/mode-toggle";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const HomePage = () => {
  const {
    user,
    posts,
    stories,
    isLoading,
    hasError,
    errorMessage,
    refetchAll,
    refetchUser,
    refetchPosts,
    refetchStories,
    isLoadingUser,
    isLoadingPosts,
    isLoadingStories,
  } = useOptimizedQueries();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    trackPageLoad('HomePage');
  }, []);

  // Show skeleton while mounting
  if (!isMounted) {
    return <HomePageSkeleton />;
  }

  // Error state
  if (hasError) {
    return (
      <motion.div 
        className="w-full flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Alert className="max-w-md bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-6 shadow-xl">
          <AlertCircle className="h-6 w-6 text-destructive mb-2" />
          <AlertDescription className="text-lg font-semibold text-destructive">
            {errorMessage || "Something went wrong. Please try again."}
          </AlertDescription>
        </Alert>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button 
            variant="outline" 
            onClick={() => refetchUser()}
            disabled={isLoadingUser}
            className="rounded-[10px] shadow-sm h-10 px-6"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoadingUser && 'animate-spin')} />
            Retry Profile
          </Button>
          <Button 
            variant="outline" 
            onClick={() => refetchPosts()}
            disabled={isLoadingPosts}
            className="rounded-[10px] shadow-sm h-10 px-6"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoadingPosts && 'animate-spin')} />
            Retry Posts
          </Button>
          <Button 
            variant="outline" 
            onClick={() => refetchStories()}
            disabled={isLoadingStories}
            className="rounded-[10px] shadow-sm h-10 px-6"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoadingStories && 'animate-spin')} />
            Retry Stories
          </Button>
          <Button 
            onClick={() => refetchAll()}
            disabled={isLoading}
            className="rounded-[10px] h-10 px-6 bg-primary hover:bg-primary/90 text-white"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && 'animate-spin')} />
            Retry All
          </Button>
        </div>
      </motion.div>
    );
  }

  // Loading state - show skeleton
  if (isLoading) {
    return <HomePageSkeleton />;
  }

  // Data not available
  if (!user || !posts || !stories) {
    return (
      <motion.div 
        className="w-full flex flex-col items-center justify-center min-h-[60vh] p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Alert className="max-w-md bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-6 shadow-xl">
          <AlertCircle className="h-6 w-6 text-destructive mb-2" />
          <AlertDescription className="text-lg font-semibold text-destructive">
            No data available. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <>
      <PerformanceMonitor componentName="HomePage" />
      
      {/* Floating Pinggo Logo */}
      <motion.div 
        className="fixed top-6 left-6 z-30 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-foreground hidden md:block">Pinggo</span>
      </motion.div>
      
      {/* Top right dark mode toggle */}
      

      <motion.div 
        className="w-full flex flex-col lg:flex-row gap-6 px-4 md:px-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Main Content */}
        <div className="w-full flex flex-col gap-6">
          {/* Stories Section */}
          <motion.div 
            className="w-full p-1"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg p-4 md:p-6">
              <Story
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
                    stories: stories,
                  },
                }}
              />
            </div>
          </motion.div>

          {/* Posts Section */}
          <motion.div
            className="w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg p-4 md:p-6">
              <Post
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
                    posts: posts,
                  },
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div 
          className="lg:w-[350px] flex-col gap-6 hidden lg:flex pt-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* User Profile */}
          <div className="bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg p-6 flex w-full items-start gap-4">
            <Image
              src={user.avatarUrl || '/default-avatar.png'}
              alt="Profile"
              width={56}
              height={56}
              className="rounded-full object-cover w-14 h-14 border-2 border-primary shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/default-avatar.png';
              }}
            />
            <div className="flex flex-col flex-1">
              <h1 className="font-bold text-lg text-foreground">{user.username}</h1>
              <span className="text-sm text-muted-foreground">{user.fullName}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-primary hover:text-primary/80 rounded-[10px] h-8 px-3"
            >
              Switch
            </Button>
          </div>

          {/* Suggestions */}
          <div className="bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg p-6">
            <Suggestion />
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default HomePage;