"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2, User, FileText, Film, Sparkles, AlertCircle } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { ExploreSkeleton, ErrorState } from "@/components/skeletons/UniversalSkeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ExploreGrid from '@/components/ExploreGrid';
import FloatingActionBar from '@/components/FloatingActionBar';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const trendingTopics = [
  '#devlife', '#react', '#nextjs', '#design', '#music', '#travel', 
  '#art', '#fun', '#trending', '#explore', '#coding', '#startup', 
  '#ai', '#photography', '#gaming', '#fashion', '#food', '#fitness', 
  '#memes', '#inspiration'
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchActive, setSearchActive] = useState(false);

  // Individual search hooks for each type
  const userSearch = useSearch(searchQuery, 'username');
  const postSearch = useSearch(searchQuery, 'posts');
  const reelSearch = useSearch(searchQuery, 'reels');

  // For 'all', merge results
  let searchResults: any[] = [];
  let isLoading = false;
  let error = null;
  
  if (searchActive && searchQuery.trim().length >= 2) {
    if (searchType === 'all') {
      isLoading = userSearch.isLoading || postSearch.isLoading || reelSearch.isLoading;
      error = userSearch.error || postSearch.error || reelSearch.error;
      searchResults = [
        ...(userSearch.data || []).map((u: any) => ({ ...u, type: 'user' })),
        ...(postSearch.data || []).map((p: any) => ({ ...p, type: 'post' })),
        ...(reelSearch.data || []).map((r: any) => ({ ...r, type: 'reel' })),
      ];
    } else if (searchType === 'username') {
      isLoading = userSearch.isLoading;
      error = userSearch.error;
      searchResults = (userSearch.data || []).map((u: any) => ({ ...u, type: 'user' }));
    } else if (searchType === 'posts') {
      isLoading = postSearch.isLoading;
      error = postSearch.error;
      searchResults = (postSearch.data || []).map((p: any) => ({ ...p, type: 'post' }));
    } else if (searchType === 'reels') {
      isLoading = reelSearch.isLoading;
      error = reelSearch.error;
      searchResults = (reelSearch.data || []).map((r: any) => ({ ...r, type: 'reel' }));
    }
  }

  const handleSearch = (query: string, type: string) => {
    setSearchQuery(query);
    setSearchType(type);
    setSearchActive(true);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* Pinggo Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">Pinggo</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
            Home
          </Button>
          <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
            Explore
          </Button>
        </div>
      </div>

      {/* Trending Hashtags/Topics */}
      <div className="w-full px-4 md:px-6 pt-6 pb-4 sticky top-16 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide md:flex-wrap md:justify-center">
          {trendingTopics.map((topic, i) => (
            <motion.button
              key={topic}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium",
                "bg-card/80 backdrop-blur-lg border border-border/40",
                "hover:bg-primary/10 hover:text-primary transition-colors",
                "shadow-sm hover:shadow-md"
              )}
            >
              {topic}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Explore Grid */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 pb-24">
        <ExploreGrid
          items={searchActive && searchQuery.trim().length >= 2 ? searchResults : undefined}
          loading={searchActive && searchQuery.trim().length >= 2 ? isLoading : false}
          error={searchActive && searchQuery.trim().length >= 2 ? error : null}
          onClearSearch={() => setSearchActive(false)}
          searchActive={searchActive}
        />

        {!searchActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Placeholder content when not searching */}
            <Card className="bg-card/80 backdrop-blur-lg border border-border/40 overflow-hidden">
              <CardHeader className="p-0">
                <div className="aspect-square bg-muted/40 animate-pulse" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full w-8 h-8 bg-muted/60 animate-pulse" />
                  <div className="h-4 w-24 bg-muted/40 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
            {/* Add more placeholder cards as needed */}
          </motion.div>
        )}
      </div>

      {/* Floating Action Bar */}
      <FloatingActionBar onSearch={handleSearch} />
    </div>
  );
};

export default Explore;