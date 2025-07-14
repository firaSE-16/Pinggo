"use client"
import {  Group, Home, Map, Megaphone, Menu, MessageSquare, Plus, User, Video, VideoIcon, } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const menus = [
    {
        title: "Home",
        icon: Home,
        route: "/home",
        notification: false
    },
    {
        title: "Reels",
        icon: Video,
        route: "/reels",
        notification: false
    },
    {
        title: "Geomap",
        icon: Map,
        route: "/geomap",
        notification: false
    },
    {
        title: "Chat",
        icon: MessageSquare,
        route: "/chat",
        notification: true 
    },
    {
        title: "Events",
        icon: Group,
        route: "/events",
        notification: false
    },
    {
        title: "Profile",
        icon: User,
        route: "/profile",
        notification: false 
    },
];

const Sidebar = () => {
    const [setting, setSetting] = useState(false);
    const [chat,setChat]=useState(false)
    
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
        }
        return 'light';
    });


    const pathname= usePathname()

    useEffect(() => {
        
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', theme);
           
        }

     

    }, [theme]);

    useEffect(()=>{
       if(window.location.pathname.includes("/chat")){
        setChat(true)
    }else{
        setChat(false)
    }
    },[pathname])



    return (
        
        <div className={clsx(
            "w-full min-h-screen justify-center flex flex-col items-center gap-10 py-10 lg:gap-20 lg:py-20",
            "bg-background text-foreground transition-colors duration-300",
            theme === 'dark' && 'dark'
        )}>
            

            <Plus size={24} className="hidden lg:block text-foreground" />
            
            <div className="w-full flex flex-col items-center justify-center gap-3 lg:gap-5">
                {menus.map((menu, index) => (
                    <div key={index} className="w-full h-[40px] flex items-center relative">
                        <Link
                            href={menu.route}
                            className="flex md:justify-center lg:justify-start items-center gap-4 lg:gap-10 w-full h-full group hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] px-2 lg:px-4 rounded-[3px] py-6 text-foreground transition-all duration-200"
                        >
                            <menu.icon size={24} className="md:w-8 md:h-8 group-hover:scale-110 transition-transform " />
                            <span className={clsx("text-sm lg:text-lg font-medium ",chat===true?"md:hidden":"md:hidden lg:inline")}>{menu.title}</span>
                        </Link>

                        {menu.notification && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        )}
                    </div>
                ))}
            </div>

            <div className="relative pt-10 lg:top-1 mb-5">
                <ul className={clsx(
                    'absolute -top-22 left-10 w-48 rounded-md shadow-lg overflow-hidden',
                    'bg-popover text-popover-foreground transition-colors duration-300',
                    setting ? "flex flex-col" : "hidden"
                )}>
                    <li className="hover:bg-accent hover:text-accent-foreground h-10 flex items-center justify-center cursor-pointer px-4 py-2 transition-colors duration-200">Activity</li>
                    <li className="hover:bg-accent hover:text-accent-foreground h-10 flex items-center justify-center cursor-pointer px-4 py-2 transition-colors duration-200">Dashboard</li>
                </ul>

                <span 
                    className="flex items-center gap-3 lg:gap-5 cursor-pointer hover:text-muted-foreground transition-colors text-foreground"
                    onClick={() => setSetting(prev => !prev)}
                >
                    <Menu size={24} className="lg:w-8 lg:h-8" />
                    <span className={clsx("text-sm lg:text-xl hidden lg:inline"),chat?"hidden":""}>Settings</span>
                </span>
            </div>
        </div>
    );
};

export default Sidebar;