'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

// Universal Page Skeleton
export const PageSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <PageHeaderSkeleton />
            <PageContentSkeleton />
          </div>
          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            <SidebarSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

// Page Header Skeleton
export const PageHeaderSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="w-48 h-8" />
      <Skeleton className="w-96 h-4" />
    </div>
  );
};

// Page Content Skeleton
export const PageContentSkeleton = () => {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="w-32 h-4 mb-2" />
                <Skeleton className="w-24 h-3" />
              </div>
            </div>
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>
        </Card>
      ))}
    </div>
  );
};

// Sidebar Skeleton
export const SidebarSkeleton = () => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Skeleton className="w-32 h-5" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="w-24 h-3 mb-1" />
              <Skeleton className="w-20 h-2" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="relative">
        <Skeleton className="w-full h-48 rounded-lg" />
        <div className="absolute -bottom-16 left-6">
          <Skeleton className="w-32 h-32 rounded-full border-4 border-background" />
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="pt-20 space-y-4">
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-64 h-4" />
        <div className="flex gap-4">
          <Skeleton className="w-20 h-8" />
          <Skeleton className="w-20 h-8" />
          <Skeleton className="w-20 h-8" />
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="w-32 h-4 mb-2" />
                    <Skeleton className="w-24 h-3" />
                  </div>
                </div>
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-full h-48 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <Skeleton className="w-32 h-5 mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="w-24 h-3 mb-1" />
                    <Skeleton className="w-20 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Chat Skeleton
export const ChatSkeleton = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Chat List */}
      <div className="w-full md:w-80 border-r bg-background">
        <div className="p-4 border-b">
          <Skeleton className="w-full h-10 rounded-lg" />
        </div>
        <div className="space-y-2 p-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="w-24 h-4 mb-1" />
                <Skeleton className="w-32 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-20 h-3" />
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-xs ${i % 2 === 0 ? 'bg-muted' : 'bg-primary text-primary-foreground'} rounded-lg p-3`}>
                <Skeleton className={`w-48 h-4 ${i % 2 === 0 ? 'bg-muted-foreground/20' : 'bg-primary-foreground/20'}`} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Skeleton className="flex-1 h-10 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Explore Skeleton
export const ExploreSkeleton = () => {
  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="w-full max-w-2xl mx-auto h-12 rounded-lg" />
        </div>
      </div>
      
      {/* Results Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-24 h-4" />
                </div>
                <Skeleton className="w-full h-3" />
                <Skeleton className="w-3/4 h-3" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Settings Skeleton
export const SettingsSkeleton = () => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-96 h-4" />
      </div>
      
      <Card className="p-6">
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-48 h-3" />
              </div>
              <Skeleton className="w-12 h-6" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Loading States
export const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-2 border-muted border-t-primary rounded-full animate-spin`} />
    </div>
  );
};

// Error State
export const ErrorState = ({ 
  message = "Something went wrong", 
  onRetry 
}: { 
  message?: string; 
  onRetry?: () => void; 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold">Oops!</h3>
        <p className="text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}; 