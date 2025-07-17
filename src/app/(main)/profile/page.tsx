'use client'
import { Button } from "@/components/ui/button";
import { Plus, Settings, AlertCircle, Edit3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useProfile } from "@/hooks/useProfile";
import Post from "@/components/post";
import Story from "@/components/story";
import Reel from "@/components/reels";
import { UserButton } from "@clerk/nextjs";
import { ProfileSkeleton, ErrorState } from "@/components/skeletons/UniversalSkeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ModeToggle } from "@/components/Global/mode-toggle";
import { Sparkles } from "lucide-react";

const ProfilePage = () => {
  const { data: user, isLoading, error, refetch } = useProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show skeleton while mounting
  if (!mounted) {
    return <ProfileSkeleton />;
  }

  // Loading state
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState 
        message={error.message || "Failed to load profile"} 
        onRetry={refetch}
      />
    );
  }

  // Data not available
  if (!user) {
    return (
      <ErrorState 
        message="Profile data not available" 
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Navigation - Consistent with Landing Page */}
      <nav className="w-full flex justify-between items-center p-6 md:p-6 z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">Pinggo</span>
        </motion.div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="container mx-auto px-2 md:px-6 py-8 space-y-10">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="relative overflow-visible rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 shadow-lg">
            <div className="h-52 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-2xl" />
            <div className="absolute -bottom-20 left-8 flex items-end gap-6">
              <div className="relative">
                <Image
                  src={user.avatarUrl || '/default-avatar.png'}
                  alt="Profile"
                  width={144}
                  height={144}
                  className="w-36 h-36 rounded-full border-4 border-background object-cover shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-avatar.png';
                  }}
                />
                <Link href="/profile/edit">
                  <Button 
                    size="icon" 
                    className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Edit3 className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col gap-2 pb-4">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                  {user.fullName}
                </h1>
                <p className="text-lg text-muted-foreground">@{user.username}</p>
                {user.bio && (
                  <p className="text-muted-foreground max-w-2xl text-base mt-2">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Profile Info & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="pt-24 flex flex-col md:flex-row md:items-center justify-between gap-8"
        >
          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Posts", value: user.posts?.length ?? 0 },
              { label: "Reels", value: user.reels?.length ?? 0 },
              { label: "Stories", value: user.stories?.length ?? 0 },
              { label: "Followers", value: user.followers?.length ?? 0 },
              { label: "Following", value: user.following?.length ?? 0 }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                className="flex flex-col items-center bg-card rounded-xl px-6 py-3 border border-border hover:border-primary/50 transition-all duration-300"
              >
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
          
          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <Link href="/profile/edit">
              <Button 
                variant="outline" 
                className="rounded-[10px] px-6 h-10 font-medium border-border hover:border-primary/50"
              >
                Edit Profile
              </Button>
            </Link>
            <Link href="/profile/settings">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-[10px] border-border hover:border-primary/50"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/profile/new">
              <Button 
                className="rounded-[10px] w-12 h-12 p-0 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full"
        >
          <Tabs defaultValue="post" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-[10px] bg-muted/50 border border-border">
              {[
                { value: "post", label: "Posts" },
                { value: "reel", label: "Reels" },
                { value: "story", label: "Stories" }
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value}
                  className="font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-[8px] transition-all"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="post" className="mt-6">
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
                    posts: user.posts,
                  },
                }}
              />
            </TabsContent>
            
            <TabsContent value="reel" className="mt-6">
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
                    reels: user.reels,
                  },
                }}
              />
            </TabsContent>
            
            <TabsContent value="story" className="mt-6">
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
                    stories: user.stories,
                  },
                }}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;