import { api } from "@/lib/api";


export const getProfile = async()=>{
    const res= await api.get('/profile/user-detail')
    return res.data.data
}

