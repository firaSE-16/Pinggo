"use client";
import { getProfile } from "@/services/profileService";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'], 
    queryFn:getProfile,
  });
};
