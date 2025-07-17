
'use client'
import Post from "@/components/post";
import Story from "@/components/story";
import Suggestion from "@/components/suggestion";
import { useOptimizedQueries } from "@/hooks/useOptimizedQueries";
import { HomePageSkeleton } from "@/components/skeletons/HomeSkeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { PerformanceMonitor, trackPageLoad } from "@/components/PerformanceMonitor";
import Image from "next/image";
import React, { useEffect, useState } from "react";

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
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
        <div className="flex gap-2 flex-wrap justify-center">
          <Button 
            variant="outline" 
            onClick={() => refetchUser()}
            disabled={isLoadingUser}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingUser ? 'animate-spin' : ''}`} />
            Retry Profile
          </Button>
          <Button 
            variant="outline" 
            onClick={() => refetchPosts()}
            disabled={isLoadingPosts}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingPosts ? 'animate-spin' : ''}`} />
            Retry Posts
          </Button>
          <Button 
            variant="outline" 
            onClick={() => refetchStories()}
            disabled={isLoadingStories}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingStories ? 'animate-spin' : ''}`} />
            Retry Stories
          </Button>
          <Button 
            onClick={() => refetchAll()}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Retry All
          </Button>
        </div>
      </div>
    );
  }

  // Loading state - show skeleton
  if (isLoading) {
    return <HomePageSkeleton />;
  }

  // Data not available
  if (!user || !posts || !stories) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No data available. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <PerformanceMonitor componentName="HomePage" />
      <div className="w-full flex gap-10">
        {/* Main Content */}
        <div className="w-full flex flex-col gap-10">
          {/* Stories Section */}
          <div className="h-40 w-full p-5">
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

          {/* Posts Section */}
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

        {/* Sidebar */}
        <div className="lg:w-[700px] flex-col pt-10 hidden lg:flex">
          {/* User Profile */}
          <div className="flex w-full items-start gap-3 mb-6">
            <Image
              src={user.avatarUrl || '/default-avatar.png'}
              alt="Profile"
              width={44}
              height={44}
              className="rounded-full object-cover w-11 h-11"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/default-avatar.png';
              }}
            />
            <div className="flex flex-col flex-1">
              <h1 className="font-semibold text-foreground">{user.username}</h1>
              <span className="text-sm text-muted-foreground">{user.fullName}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              Switch
            </Button>
          </div>

          {/* Suggestions */}
          <Suggestion />
        </div>
      </div>
    </>
  );
};

export default HomePage;
