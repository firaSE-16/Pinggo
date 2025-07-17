import axios from "axios"; 

export const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : "https://pinggo-t3jz.onrender.com/api", 
  withCredentials: true,                
});
