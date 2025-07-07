import { Group, Home, Map, Megaphone, Menu, MessageSquare, Plus, User, Video, VideoIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import clsx from "clsx";

const menus=[
    {
        title:"Home",
        icon:Home,
        route:"/home",
        notification:false
    },
    {
        title:"Reels",
        icon:Video,
        route:"/reels",
        notification:false
    },
    {
        title:"Geomap",
        icon:Map,
        route:"/geomap",
        notification:false
    },
    {
        title:"Chat",
        icon:MessageSquare,
        route:"/chat",
        notification:true
    },
    {
        title:"Events",
        icon:Group,
        route:"/evnets",
        notification:false
    },
    {
        title:"Live",
        icon:VideoIcon,
        route:"/live",
        notification:false
    },
    {
        title:"Channel",
        icon:Megaphone,
        route:"/channel",
        notification:false
    },
    {
        title:"Profile",
        icon:User,
        route:"/profile",
        notification:""
    },
    
]





const Sidebar = () => {


    const [setting,setSetting]=useState(false)

  return <div className="w-full min-h-screen flex flex-col items-center  gap-20 py-20">
        <Plus/>
    <div className="flex flex-col justify-center gap-5">

        {
            menus.map((menu,index)=>(
                <div key={index} className="flex gap-5 items-center w-full">
                   <Link href={menu.route} className="flex gap-5 items-center">
                    <menu.icon className="" size={40}/>
                    <p className="text-6xl">{menu.title}</p>
                   </Link>

                </div>
            ))
        }
    </div>


        
            <div className=" relative">
                <ul className={clsx('absolute -top-22 left-10 w-48 ',setting?"flex flex-col":"hidden")}>
                    <li className="bg-[#ffffff18] hover:bg-[#ffffff37] h-10 rounded-t-[5px] flex items-center justify-center ">Activity</li>
                    <li className="bg-[#ffffff18] hover:bg-[#ffffff37] h-10 rounded-b-[5px] flex items-center justify-center">Dashboard</li>
                    

                </ul>

            <span className="  flex items-center gap-5 curosr-pointer" onClick={()=>setSetting(prev=>!prev)}>
                <Menu/>
               <p>Settings</p> 
                </span>
            </div>

       

    


  </div>;
};

export default Sidebar;
