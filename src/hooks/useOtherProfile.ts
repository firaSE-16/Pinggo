"use client";
import { getOtherProfile } from "@/services/useOtherService";
import { useQuery } from "@tanstack/react-query";

export const useOtherProfile = (id:string) => {
  return useQuery({
    queryKey: ['otherProfile',id],     
    queryFn:()=>getOtherProfile(id),
    enabled:!!id
  });
};


