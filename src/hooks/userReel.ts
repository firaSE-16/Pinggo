"use client";
import { getReel } from "@/services/reelService";
import { useQuery } from "@tanstack/react-query";

export const useReel = () => {
  return useQuery({
    queryKey: ['reel'], 
    queryFn:getReel,
  });
};


