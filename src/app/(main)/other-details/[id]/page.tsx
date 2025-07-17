'use client'
import { Button } from "@/components/ui/button";
import { Plus, Settings, UserPlus,Users, Loader2, Film, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Post from "@/components/post";
import Story from "@/components/story";
import { Skeleton } from "@/components/ui/skeleton";
import Reel from "@/components/reels";
import { useParams } from "next/navigation";
import { useOtherProfile } from "@/hooks/useOtherProfile";
import { useSession } from "@clerk/nextjs";
import { api } from "@/lib/api";

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
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col lg:p-30 md:p-16 gap-10">
        <div className="flex gap-10 w-full items-center">
          <Skeleton className="w-[100px] h-[100px] rounded-full" />
          <div className="flex flex-col gap-3 flex-1">
            <Skeleton className="h-6 w-1/4 mb-2" />
            <div className="flex gap-6 items-center">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-32 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="flex gap-8 mt-2">
              {[...Array(5)].map((_, i) => (
                <div className="flex flex-col items-center gap-1" key={i}>
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
            <Skeleton className="h-5 w-1/3 mt-2" />
          </div>
        </div>
        <div className="flex flex-col w-16 gap-2 items-center">
          <Skeleton className="rounded-full w-16 h-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="w-full">
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
          <div className="flex flex-col gap-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <p>Error loading profile</p>;
  if (!user) return <p>No profile data found</p>;

  return (
    <div className="w-full min-h-screen flex flex-col lg:p-30 md:p-16 gap-10">
      <div className="flex gap-10 w-full">
        <Image
          src={user.avatarUrl || "/default-avatar.png"}
          alt="profile"
          width={100}
          height={100}
          className="w-[100px] h-[100px] rounded-full object-cover"
        />
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            {response?.isMyAcc ? (
              <>
                <Link href="/profile/edit">
                  <Button variant="outline" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Edit profile
                  </Button>
                </Link>
                <Settings className="cursor-pointer" />
              </>
            ) : (
              <>
                {!followStatus.isFollowing ? (
                  <span className="text-muted-foreground">Following</span>
                ) : followStatus.isFollowed ? (
                  <Button
                    variant="default"
                    onClick={handleFollow}
                    disabled={isLoadingFollow}
                    className="gap-2"
                  >
                    {isLoadingFollow ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Follow Back
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={handleFollow}
                    disabled={isLoadingFollow}
                    className="gap-2"
                  >
                    {isLoadingFollow ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Follow
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>

          {user.bio && <p className="text-sm">{user.bio}</p>}
          {user.location && (
            <p className="text-sm text-muted-foreground">{user.location}</p>
          )}

          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <span className="font-bold">{user._count.posts}</span>
              <span className="text-sm text-muted-foreground">Posts</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">{user._count.reels}</span>
              <span className="text-sm text-muted-foreground">Reels</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">{user._count.stories}</span>
              <span className="text-sm text-muted-foreground">Stories</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">{user._count.followers}</span>
              <span className="text-sm text-muted-foreground">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">{user._count.following}</span>
              <span className="text-sm text-muted-foreground">Following</span>
            </div>
          </div>

          <h1 className="text-xl font-semibold">{user.fullName}</h1>
        </div>
      </div>

      {!response?.isMyAcc && (
        <div className="flex flex-col items-center gap-2">
          <Button variant="outline" className="rounded-full w-16 h-16" asChild>
            <Link href="/create">
              <Plus className="w-6 h-6" />
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">New Post</span>
        </div>
      )}

      <div className="w-full">
        <Tabs defaultValue="post" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="post">Posts</TabsTrigger>
            <TabsTrigger value="reel">Reels</TabsTrigger>
            <TabsTrigger value="story">Stories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="post">
            {user.posts?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.posts.map((post) => (
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
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <Users className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold">No Posts Yet</h3>
                <p className="text-muted-foreground max-w-md">
                  {response?.isMyAcc
                    ? "You haven't posted anything yet. Create your first post!"
                    : `@${user.username} hasn't posted anything yet.`}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reel">
            {user.reels?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.reels.map((reel) => (
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
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <Film className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold">No Reels Yet</h3>
                <p className="text-muted-foreground max-w-md">
                  {response?.isMyAcc
                    ? "You haven't created any reels yet. Create your first reel!"
                    : `@${user.username} hasn't created any reels yet.`}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="story">
            {user.stories?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {user.stories.map((story) => (
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
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold">No Stories Yet</h3>
                <p className="text-muted-foreground max-w-md">
                  {response?.isMyAcc
                    ? "You haven't created any stories yet. Create your first story!"
                    : `@${user.username} hasn't created any stories yet.`}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDetailsPage;