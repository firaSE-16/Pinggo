'use client'
import { Button } from "@/components/ui/button";
import { Plus, Settings, UserPlus, Users, Loader2, Film, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Post from "@/components/post";
import Story from "@/components/story";
import Reel from "@/components/reels";
import { useParams } from "next/navigation";
import { useOtherProfile } from "@/hooks/useOtherProfile";
import { useSession } from "@clerk/nextjs";
import { api } from "@/lib/api";
import { ProfileSkeleton, ErrorState } from "@/components/skeletons/UniversalSkeleton";
import { motion } from "framer-motion";
import { ModeToggle } from "@/components/Global/mode-toggle";
import { Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface Media {
  id: string;
  mediaUrl: string;
  mediaType: string;
}

interface PostType {
  id: string;
  content: string;
  location: string;
  createdAt: string;
  mediat: Media[];
  likes: any[];
  comments: any[];
}

interface ReelType {
  id: string;
  videoUrl: string;
  caption: string;
  createdAt: string;
}

interface Story {
  id: string;
  mediaUrl: string;
  caption: string;
  expiresAt: string;
  createdAt: string;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  location?: string | null;
  isPrivate: boolean;
  posts: PostType[];
  reels: ReelType[];
  stories: Story[];
  _count: {
    posts: number;
    reels: number;
    stories: number;
    followers: number;
    following: number;
  };
  followers: any[];
  following: any[];
}

const UserDetailsPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [followStatus, setFollowStatus] = useState({
    isFollowing: false,
    isFollowed: false,
  });
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const { session } = useSession();
  const params = useParams();
  const id = params?.id as string;

  const { data: response, isLoading, error, refetch } = useOtherProfile(id);
  const user = response?.data;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (response) {
      setFollowStatus({
        isFollowing: response.following,
        isFollowed: response.followed,
      });
    }
  }, [response]);

  const handleFollow = async () => {
    if (!session) return;
    setIsLoadingFollow(true);
    try {
      await api.post(`/follow/${id}`);
      setFollowStatus(prev => ({ ...prev, isFollowing: !prev.isFollowing }));
      refetch();
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  if (!isMounted) {
    return <ProfileSkeleton />;
  }

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return <ErrorState message={error.message || "Failed to load profile"} onRetry={refetch} />;
  }

  if (!user) {
    return <ErrorState message="Profile data not available" onRetry={refetch} />;
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
          <div className="relative overflow-visible rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 shadow-lg">
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
                {user.location && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.location}
                  </p>
                )}
              </div>
            </div>
          </div>
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
              { label: "Posts", value: user._count.posts ?? 0 },
              { label: "Reels", value: user._count.reels ?? 0 },
              { label: "Stories", value: user._count.stories ?? 0 },
              { label: "Followers", value: user._count.followers ?? 0 },
              { label: "Following", value: user._count.following ?? 0 }
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
            {response?.isMyAcc ? (
              <Link href="/profile/edit">
                <Button 
                  variant="outline" 
                  className="rounded-[10px] px-6 h-10 font-medium border-border hover:border-primary/50"
                >
                  Edit Profile
                </Button>
              </Link>
            ) : (
              <Button
                variant={followStatus.isFollowing ? "outline" : "default"}
                onClick={handleFollow}
                disabled={isLoadingFollow}
                className="gap-2 rounded-[10px] px-6 h-10 font-medium"
              >
                {isLoadingFollow ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    {followStatus.isFollowing ? 'Unfollow' : followStatus.isFollowed ? 'Follow Back' : 'Follow'}
                  </>
                )}
              </Button>
            )}
            {!response?.isMyAcc && (
              <Button 
                variant="outline" 
                className="rounded-[10px] w-12 h-12 p-0"
              >
                <Link href="/create">
                  <Plus className="w-6 h-6" />
                </Link>
              </Button>
            )}
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
              {user.posts?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.posts.map((post: any) => (
                    <Post
                      key={post.id}
                      postData={{
                        success: true,
                        data: {
                          ...user,
                          posts: [post],
                        },
                      }}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 gap-4 text-center"
                >
                  <Users className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-xl font-semibold">No Posts Yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    {response?.isMyAcc
                      ? "You haven't posted anything yet. Create your first post!"
                      : `@${user.username} hasn't posted anything yet.`}
                  </p>
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="reel" className="mt-6">
              {user.reels?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.reels.map((reel: any) => (
                    <Reel
                      key={reel.id}
                      postData={{
                        success: true,
                        data: {
                          ...user,
                          reels: [reel],
                        },
                      }}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 gap-4 text-center"
                >
                  <Film className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-xl font-semibold">No Reels Yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    {response?.isMyAcc
                      ? "You haven't created any reels yet. Create your first reel!"
                      : `@${user.username} hasn't created any reels yet.`}
                  </p>
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="story" className="mt-6">
              {user.stories?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {user.stories.map((story: any) => (
                    <Story
                      key={story.id}
                      postData={{
                        success: true,
                        data: {
                          ...user,
                          stories: [story],
                        },
                      }}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 gap-4 text-center"
                >
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-xl font-semibold">No Stories Yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    {response?.isMyAcc
                      ? "You haven't created any stories yet. Create your first story!"
                      : `@${user.username} hasn't created any stories yet.`}
                  </p>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDetailsPage;