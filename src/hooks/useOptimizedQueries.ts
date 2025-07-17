"use client";

import { usePost } from "./usePost";
import { useProfile } from "./useProfile";
import { useStory } from "./useStroy";
import { useMemo } from "react";

export const useOptimizedQueries = () => {
  const { 
    data: posts, 
    isLoading: isLoadingPosts, 
    error: postsError, 
    refetch: refetchPosts 
  } = usePost();
  
  const { 
    data: stories, 
    isLoading: isLoadingStories, 
    error: storiesError, 
    refetch: refetchStories 
  } = useStory();
  
  const { 
    data: user, 
    isLoading: isLoadingUser, 
    error: userError, 
    refetch: refetchUser 
  } = useProfile();

  // Memoized computed values
  const isLoading = useMemo(() => 
    isLoadingPosts || isLoadingStories || isLoadingUser, 
    [isLoadingPosts, isLoadingStories, isLoadingUser]
  );

  const hasError = useMemo(() => 
    postsError || storiesError || userError, 
    [postsError, storiesError, userError]
  );

  const isDataReady = useMemo(() => 
    !isLoading && !hasError && user && posts && stories, 
    [isLoading, hasError, user, posts, stories]
  );

  const errorMessage = useMemo(() => {
    if (userError) return userError.message;
    if (postsError) return postsError.message;
    if (storiesError) return storiesError.message;
    return "Something went wrong loading your feed";
  }, [userError, postsError, storiesError]);

  const refetchAll = () => {
    refetchUser();
    refetchPosts();
    refetchStories();
  };

  return {
    // Data
    user,
    posts,
    stories,
    
    // Loading states
    isLoading,
    isLoadingUser,
    isLoadingPosts,
    isLoadingStories,
    
    // Error states
    hasError,
    errorMessage,
    userError,
    postsError,
    storiesError,
    
    // Computed states
    isDataReady,
    
    // Actions
    refetchAll,
    refetchUser,
    refetchPosts,
    refetchStories,
  };
}; 