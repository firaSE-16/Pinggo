"use client"
import Sidebar from "@/components/sidebar";
import React from "react";

const layout = ({children}:{children:React.ReactNode}) => {
  return <div className="flex w-full min-h-screen">
     <div className="w-32 fixed lg:w-72  min-h-screen">

        
          <Sidebar />
      
      </div>
    <div className="ml-32 lg:ml-72 min-h-screen">
    {children}
    </div>
    </div>;
};

export default layout;
