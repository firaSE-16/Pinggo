import { api } from "@/lib/api";


export const getOtherProfile = async(id:string)=>{
    const res= await api.get(`/other-detail/${id}`)
    return res.data
}

