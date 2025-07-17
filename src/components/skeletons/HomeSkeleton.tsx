'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import clsx from "clsx";

export const StorySkeleton = () => {
  return (
    <div className="h-44 w-full p-5">
      <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
            <Skeleton className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-muted animate-pulse shadow-lg" />
            <Skeleton className="w-14 h-4 rounded bg-muted/60 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const PostSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-8">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-8 rounded-3xl bg-card/80 shadow-2xl backdrop-blur-xl animate-fade-in">
          {/* Post Header */}
          <div className="flex items-center gap-4 mb-5">
            <Skeleton className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/10 to-muted animate-pulse" />
            <div className="flex-1">
              <Skeleton className="w-36 h-5 mb-2 rounded bg-muted/60 animate-pulse" />
              <Skeleton className="w-28 h-4 rounded bg-muted/40 animate-pulse" />
            </div>
            <Skeleton className="w-8 h-8 rounded-full bg-muted/60 animate-pulse" />
          </div>
          {/* Post Content */}
          <div className="space-y-4 mb-5">
            <Skeleton className="w-full h-5 rounded bg-muted/60 animate-pulse" />
            <Skeleton className="w-3/4 h-5 rounded bg-muted/40 animate-pulse" />
            <Skeleton className="w-1/2 h-5 rounded bg-muted/30 animate-pulse" />
          </div>
          {/* Post Image */}
          <Skeleton className="w-full h-72 rounded-2xl mb-5 bg-gradient-to-br from-primary/5 to-muted animate-pulse" />
          {/* Post Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Skeleton className="w-10 h-10 rounded-full bg-muted/60 animate-pulse" />
              <Skeleton className="w-10 h-10 rounded-full bg-muted/60 animate-pulse" />
              <Skeleton className="w-10 h-10 rounded-full bg-muted/60 animate-pulse" />
            </div>
            <Skeleton className="w-10 h-10 rounded-full bg-muted/60 animate-pulse" />
          </div>
          {/* Post Stats */}
          <div className="flex items-center gap-5 mt-4">
            <Skeleton className="w-20 h-4 rounded bg-muted/60 animate-pulse" />
            <Skeleton className="w-24 h-4 rounded bg-muted/40 animate-pulse" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export const SidebarSkeleton = () => {
  return (
    <div className="lg:w-[350px] flex-col pt-10 hidden lg:flex">
      {/* User Profile */}
      <div className="flex w-full items-start gap-4 mb-8">
        <Skeleton className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/10 to-muted animate-pulse" />
        <div className="flex-1">
          <Skeleton className="w-28 h-5 mb-2 rounded bg-muted/60 animate-pulse" />
          <Skeleton className="w-36 h-4 rounded bg-muted/40 animate-pulse" />
        </div>
        <Skeleton className="w-20 h-8 rounded-xl bg-muted/60 animate-pulse" />
      </div>
      {/* Suggestions */}
      <div className="space-y-5">
        <Skeleton className="w-36 h-6 rounded bg-muted/60 animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-muted animate-pulse" />
            <div className="flex-1">
              <Skeleton className="w-28 h-4 mb-1 rounded bg-muted/60 animate-pulse" />
              <Skeleton className="w-24 h-3 rounded bg-muted/40 animate-pulse" />
            </div>
            <Skeleton className="w-20 h-8 rounded-xl bg-muted/60 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const HomePageSkeleton = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-10 animate-fade-in">
      <div className="w-full flex flex-col gap-10">
        <StorySkeleton />
        <PostSkeleton />
      </div>
      <SidebarSkeleton />
    </div>
  );
}; 