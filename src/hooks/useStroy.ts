"use client";
import { getStory } from "@/services/storyService";
import { useQuery } from "@tanstack/react-query";

export const useStory = () => {
  return useQuery({
    queryKey: ['stories'], 
    queryFn: getStory,
    staleTime: 2 * 60 * 1000, // 2 minutes (stories are more dynamic)
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};


