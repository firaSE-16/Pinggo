import {api } from "@/lib/api";

export const getPost = async()=>{
    const res = await api.get('/post')
    return res.data.data
}


export const uploadPost = (data: any) => {
  return api.post("/profile/user-post", data);
};
