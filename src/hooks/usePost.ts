"use client";
import { getPost } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";

export const usePost = () => {
  return useQuery({
    queryKey: ['posts'], 
    queryFn: getPost,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};


