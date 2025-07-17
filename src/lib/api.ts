import axios from "axios"; 

export const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : "http://localhost:4000/api", 
  withCredentials: true,                
});
