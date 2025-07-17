"use client"
import Sidebar from "@/components/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Layout = ({children}: {children: React.ReactNode}) => {
    const [client] = useState(()=> new QueryClient())

  const[chat, setChat]=useState(false)
const pathname=usePathname()
  useEffect(()=>{
         if(pathname.includes("/chat")){
          setChat(true)
      }else{
        setChat(false)
    }
      },[pathname])
  return (
     <QueryClientProvider client={client}>
      <ProtectedRoute>
        <div className="flex w-full min-h-screen">
          {/* Sidebar container - hidden on mobile, visible on md and up */}
          <div className={clsx("hidden md:flex md:w-24 fixed  min-h-screen", chat?"lg:w-24":"lg:w-72")}>
            <Sidebar />
            <div className="w-[1px] min-h-screen bg-[#c2dbfa35]"></div>
          </div>
          
          {/* Main content with responsive margin */}
          <div className={clsx("w-full md:ml-24  min-h-screen",chat?"lg:ml-24":"lg:ml-72")}>
            {children}
          </div>
          
        </div>
      </ProtectedRoute>
    </QueryClientProvider>
  );
};

export default Layout;