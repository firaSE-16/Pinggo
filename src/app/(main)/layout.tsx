"use client"
import Sidebar, { MobileNavigation } from "@/components/sidebar";
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
          <div className={clsx(
            "w-full min-h-screen transition-all duration-300",
            "mb-16 md:mb-0", // bottom margin for mobile nav
            "bg-gradient-to-br from-background via-primary/5 to-secondary/10 bg-fixed",
            // Always apply sidebar margin
            "md:ml-72 lg:ml-72"
          )}>
            {children}
          </div>
          {/* Mobile navigation - only visible on mobile */}
          <div className="md:hidden fixed bottom-0 left-0 w-full z-50">
            <MobileNavigation />
          </div>
        </div>
      </ProtectedRoute>
    </QueryClientProvider>
  );
};

export default Layout;