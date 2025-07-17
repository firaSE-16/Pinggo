import {api } from "@/lib/api";

export const getReel = async()=>{
    const res = await api.get('/reels')
   
    return res.data.data
}


export const uploadReel = (data: any) => {
  return api.post("/profile/user-reel", data);
};
