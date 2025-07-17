"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
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
import Post from "@/components/post";
import Reel from "@/components/reels";
import { useSearch } from "@/hooks/useSearch";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { ExploreSkeleton, ErrorState } from "@/components/skeletons/UniversalSkeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Explore = () => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("username");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data, isLoading, error, refetch } = useSearch(debouncedQuery, searchType);
  const { data: user, isLoading: isLoadingProfile } = useProfile();
  
  const router = useRouter();

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query) {
        setIsFirstLoad(false);
        setHasSearched(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      setIsFirstLoad(false);
      setHasSearched(true);
    }
  };

  const getSearchTypeIcon = () => {
    switch (searchType) {
      case "username":
      case "fullName":
        return <User className="h-4 w-4" />;
      case "posts":
        return <FileText className="h-4 w-4" />;
      case "reels":
        return <Film className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  // Suggested searches for first load
  const suggestedSearches = [
    { type: "username", query: "popular_users" },
    { type: "posts", query: "trending_posts" },
    { type: "reels", query: "viral_reels" },
  ];

  // Show skeleton while mounting
  if (!mounted) {
    return <ExploreSkeleton />;
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search Form */}
        <Card className="border-border/50 bg-background/95 shadow-sm transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl font-bold">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Explore
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search usernames, posts, reels..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 h-12 md:h-14 text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select 
                  value={searchType} 
                  onValueChange={setSearchType}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full sm:w-[200px] h-12 rounded-lg border border-input shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-2">
                      {getSearchTypeIcon()}
                      <SelectValue placeholder="Search by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border shadow-md">
                    <SelectItem value="username" className="flex items-center gap-2 py-2 px-3 cursor-pointer">
                      <User className="h-4 w-4" />
                      <span>Username</span>
                    </SelectItem>
                    <SelectItem value="fullName" className="flex items-center gap-2 py-2 px-3 cursor-pointer">
                      <User className="h-4 w-4" />
                      <span>Full Name</span>
                    </SelectItem>
                    <SelectItem value="posts" className="flex items-center gap-2 py-2 px-3 cursor-pointer">
                      <FileText className="h-4 w-4" />
                      <span>Posts</span>
                    </SelectItem>
                    <SelectItem value="reels" className="flex items-center gap-2 py-2 px-3 cursor-pointer">
                      <Film className="h-4 w-4" />
                      <span>Reels</span>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  type="submit" 
                  disabled={isLoading || query.length < 2} 
                  className="w-full sm:w-auto min-w-[120px] h-12 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span className="hidden sm:inline">Search</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-6">
          {isFirstLoad && !hasSearched && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card 
                    key={i} 
                    className="overflow-hidden transition-all hover:scale-[1.02] hover:shadow-md"
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden">
                        <div className="h-full w-full bg-muted animate-pulse" />
                      </div>
                      <div className="p-4">
                        <div className="mb-2 h-5 w-3/4 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold">Try searching for</h3>
                <div className="flex flex-wrap gap-3">
                  {suggestedSearches.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="rounded-full"
                      onClick={() => {
                        setSearchType(suggestion.type);
                        setQuery(suggestion.query);
                      }}
                    >
                      {suggestion.type === "username" && <User className="mr-2 h-4 w-4" />}
                      {suggestion.type === "posts" && <FileText className="mr-2 h-4 w-4" />}
                      {suggestion.type === "reels" && <Film className="mr-2 h-4 w-4" />}
                      {suggestion.query.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          {!isFirstLoad && isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Searching for {searchType}...</p>
            </div>
          )}

          {error && (
            <Alert className="border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Search Error</p>
                  <p className="text-sm">{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setHasSearched(false);
                      refetch();
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {!isFirstLoad && !query && !isLoading && !error && (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">Start Exploring</h3>
              <p className="max-w-md text-muted-foreground">
                Search for people, posts, or reels to discover amazing content and connect with
                others in your community.
              </p>
            </div>
          )}

          {!isFirstLoad && query && data.length === 0 && !isLoading && !error && (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">No Results Found</h3>
              <p className="max-w-md text-muted-foreground">
                We couldn't find any {searchType} matching "{query}". Try a different search term.
              </p>
            </div>
          )}

          {!isFirstLoad && query && data.length > 0 && !isLoading && !error && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">
                  Results for <span className="text-primary">"{query}"</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {data.length} {data.length === 1 ? 'result' : 'results'} found
                </p>
              </div>

              <div className="space-y-6">
                {data.map((item: any, index: number) => (
                  <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
                    <CardContent className="p-0">
                      {searchType === "username" || searchType === "fullName" ? (
                        <div className="p-6">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={item.avatarUrl} alt={item.username} />
                              <AvatarFallback>{item.username?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold">{item.username}</h4>
                              <p className="text-muted-foreground">{item.fullName}</p>
                              {item.bio && (
                                <p className="text-sm text-muted-foreground mt-1">{item.bio}</p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => router.push(`/other-details/${item.id}`)}
                            >
                              View Profile
                            </Button>
                          </div>
                        </div>
                      ) : searchType === "posts" ? (
                        <Post
                          postData={{
                            success: true,
                            data: {
                              id: user?.id || "",
                              username: user?.username || "",
                              email: user?.email || "",
                              fullName: user?.fullName || "",
                              bio: user?.bio || "",
                              avatarUrl: user?.avatarUrl || "",
                              location: user?.location || "",
                              posts: [item],
                            },
                          }}
                        />
                      ) : searchType === "reels" ? (
                        <Reel 
                          postData={{
                            success: true,
                            data: {
                              id: item.user?.id || "",
                              username: item.user?.username || "",
                              email: item.user?.email || "",
                              fullName: item.user?.fullName || "",
                              bio: item.user?.bio || "",
                              avatarUrl: item.user?.avatarUrl || "",
                              location: item.user?.location || "",
                              reels: [item],
                            },
                          }}
                        />
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;