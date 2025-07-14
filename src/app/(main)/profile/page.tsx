'use client'
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useProfile } from "@/hooks/useProfile";

const ProfilePage = () => {
  const { data: user, isLoading, error } = useProfile();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure rendering happens only on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent server-side rendering of the component
  }

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p>Error loading profile</p>;

  return (
    <div className="w-full min-h-screen flex flex-col lg:p-30 md:p-16 gap-10">
      <div className="flex gap-10 w-full">
        <Image
          src={user.avatarUrl}
          alt="profile"
          width={100}
          height={100}
          className="w-30 h-30 rounded-full"
        />
        <div className="flex flex-col gap-4">
          <div className="flex gap-24">
            <p>loarif</p>
            <Link href="/profile/edit">
              <Button variant="outline" className="bg-transparent ">
                Edit profile
              </Button>
            </Link>
            <Settings />
          </div>

          <div className="flex gap-24">
            <div className="flex gap-2">
              <span>0</span>
              <p>Posts</p>
            </div>
            <div className="flex gap-2">
              <span>0</span>
              <p>Reels</p>
            </div>
            <div className="flex gap-2">
              <span>0</span>
              <p>Story</p>
            </div>
            <div className="flex gap-2">
              <span>0</span>
              <p>follower</p>
            </div>
            <div className="flex gap-2">
              <span>0</span>
              <p>following</p>
            </div>
          </div>
          <h1>Fira</h1>
        </div>
      </div>
      <div className="flex flex-col w-16 gap-2">
        <Button variant="outline" className="rounded-full w-16 h-16">
          <Plus className="w-10 h-10" size={108} />
        </Button>
        <span className="text-center">New</span>
      </div>

      <div className="w-full ">
        <Tabs defaultValue="post" className="w-full">
          <TabsList>
            <TabsTrigger value="post">Post</TabsTrigger>
            <TabsTrigger value="reel">Reel</TabsTrigger>
            <TabsTrigger value="story">Story</TabsTrigger>
          </TabsList>
          <TabsContent value="post"></TabsContent>
          <TabsContent value="reel"></TabsContent>
          <TabsContent value="story"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;