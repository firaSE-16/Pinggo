import {api } from "@/lib/api";

export const getStory = async()=>{
    const res = await api.get('/story')
    return res.data.data
    
}



export const uploadStory = (data: any) => {
  return api.post("/profile/story", data);
};