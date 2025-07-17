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
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Profile Header */}
        <Card className="relative overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/20" />
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              <Image
                src={user.avatarUrl || '/default-avatar.png'}
                alt="Profile"
                width={128}
                height={128}
                className="w-32 h-32 rounded-full border-4 border-background object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/default-avatar.png';
                }}
              />
              <Link href="/profile/edit">
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Profile Info */}
        <div className="pt-20 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/profile/edit">
                <Button variant="outline">
                  Edit Profile
                </Button>
              </Link>
              <Link href="/profile/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              <UserButton />
            </div>
          </div>

          {user.bio && (
            <p className="text-muted-foreground max-w-2xl">{user.bio}</p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col items-center">
              <span className="text-xl font-semibold">{user.posts?.length ?? 0}</span>
              <span className="text-sm text-muted-foreground">Posts</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-semibold">{user.reels?.length ?? 0}</span>
              <span className="text-sm text-muted-foreground">Reels</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-semibold">{user.stories?.length ?? 0}</span>
              <span className="text-sm text-muted-foreground">Stories</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-semibold">{user.followers?.length ?? 0}</span>
              <span className="text-sm text-muted-foreground">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-semibold">{user.following?.length ?? 0}</span>
              <span className="text-sm text-muted-foreground">Following</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-4">
            <Link href="/profile/new">
              <Button variant="outline" className="rounded-full w-16 h-16 p-0">
                <Plus className="w-8 h-8" />
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">Create New</span>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="w-full">
          <Tabs defaultValue="post" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="post">Posts</TabsTrigger>
              <TabsTrigger value="reel">Reels</TabsTrigger>
              <TabsTrigger value="story">Stories</TabsTrigger>
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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;