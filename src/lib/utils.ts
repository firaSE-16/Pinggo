import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkMediaType(url:string){
  const extension = url.split('.').pop()?.toLowerCase() || "";

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];

  if(imageExtensions.includes(extension)){
    return 'image';

  }else if (videoExtensions.includes(extension)){
    return 'video'
  }else {
    return 'unkown';
  }

}


