'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const StorySkeleton = () => {
  return (
    <div className="h-40 w-full p-5">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="w-12 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const PostSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-6">
          {/* Post Header */}
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="w-32 h-4 mb-2" />
              <Skeleton className="w-24 h-3" />
            </div>
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
          
          {/* Post Content */}
          <div className="space-y-3 mb-4">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>
          
          {/* Post Image */}
          <Skeleton className="w-full h-64 rounded-lg mb-4" />
          
          {/* Post Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
          
          {/* Post Stats */}
          <div className="flex items-center gap-4 mt-3">
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-20 h-3" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export const SidebarSkeleton = () => {
  return (
    <div className="lg:w-[700px] flex-col pt-10 hidden lg:flex">
      {/* User Profile */}
      <div className="flex w-full items-start gap-3 mb-6">
        <Skeleton className="w-11 h-11 rounded-full" />
        <div className="flex-1">
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-32 h-3" />
        </div>
        <Skeleton className="w-16 h-6" />
      </div>
      
      {/* Suggestions */}
      <div className="space-y-4">
        <Skeleton className="w-32 h-5" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="w-24 h-3 mb-1" />
              <Skeleton className="w-20 h-2" />
            </div>
            <Skeleton className="w-16 h-6" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const HomePageSkeleton = () => {
  return (
    <div className="w-full flex gap-10">
      <div className="w-full flex flex-col gap-10">
        <StorySkeleton />
        <PostSkeleton />
      </div>
      <SidebarSkeleton />
    </div>
  );
}; 