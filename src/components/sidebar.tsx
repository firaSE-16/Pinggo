"use client"
import { Home, Map, MessageSquare, User, Video, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { NotificationBell } from "./NotificationBell";
import { useNotifications } from "@/hooks/useNotifications";
import { useUser, UserButton, SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ModeToggle } from "./Global/mode-toggle";

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
        title: "Explore",
        icon: Map,
        route: "/explore",
        notification: false
    },
    {
        title: "Chat",
        icon: MessageSquare,
        route: "/chat",
        notification: true 
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
    const { unreadCount } = useNotifications();
    const { user, isLoaded } = useUser();
    const pathname = usePathname();
    
    

    // Responsive states
    const [isMobile, setIsMobile] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
          
            const handleResize = () => {
                setIsMobile(window.innerWidth <= 768);
                // Auto-collapse sidebar on medium screens when not on chat page
                if (window.innerWidth <= 1024 && !pathname.includes('/chat')) {
                    setIsCollapsed(true);
                } else {
                    setIsCollapsed(false);
                }
            };
            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [ pathname]);

    // Toggle sidebar collapse
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    // Pinggo Logo Component
    const PinggoLogo = () => (
        <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Pinggo
                </span>
            )}
        </motion.div>
    );

    if (isMobile) {
        return (
            <MobileNavigation />
        );
    }

    return (
        <motion.div 
            className={clsx(
                "hidden md:flex fixed top-0 left-0 h-full flex-col justify-between bg-card/80 shadow-xl border-r border-border/50 backdrop-blur-lg z-30 transition-all duration-300",
                isCollapsed ? "w-20 px-2" : "w-64 px-6"
            )}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background/60 pointer-events-none rounded-r-3xl" />
            
            {/* Main content */}
            <div className="relative flex flex-col gap-8 py-8 z-10 h-full">
                {/* Logo with collapse button */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/home">
                        <PinggoLogo />
                    </Link>
                    <button 
                        onClick={toggleCollapse}
                        className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            className={clsx(
                                "transition-transform duration-300",
                                isCollapsed ? "rotate-180" : ""
                            )}
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                    {menus.map((menu, index) => (
                        <Link
                            key={index}
                            href={menu.route}
                            className={clsx(
                                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group",
                                "hover:bg-primary/10 hover:text-primary font-medium",
                                pathname === menu.route 
                                    ? "bg-primary/20 text-primary shadow-md" 
                                    : "text-foreground/80",
                                isCollapsed ? "justify-center" : ""
                            )}
                            aria-label={menu.title}
                        >
                            <menu.icon 
                                size={24} 
                                className={clsx(
                                    "transition-transform group-hover:scale-110",
                                    pathname === menu.route ? "scale-110" : ""
                                )} 
                            />
                            {!isCollapsed && (
                                <motion.span 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-sm"
                                >
                                    {menu.title}
                                </motion.span>
                            )}
                            {menu.notification && unreadCount > 0 && (
                                <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Bottom section */}
            <div className="relative flex flex-col gap-4 pb-8 z-10">
               <button className="flex justify-center w-full">
                        <ModeToggle />
                      
                </button>

                {/* User section */}
                {isLoaded && user && (
                    <div className={clsx(
                        "flex items-center gap-3 p-3 rounded-xl transition-colors",
                        "hover:bg-primary/10",
                        isCollapsed ? "justify-center" : ""
                    )}>
                        <UserButton afterSignOutUrl="/sign-in" />
                        {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden">
                                <span className="font-semibold text-sm truncate">
                                    {user.fullName || user.username}
                                </span>
                                <SignOutButton>
                                    <button className="text-xs text-muted-foreground hover:text-primary transition-colors text-left">
                                        Sign out
                                    </button>
                                </SignOutButton>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Mobile Navigation Component
const MobileNavigation = () => {
    const pathname = usePathname();
    const { unreadCount } = useNotifications();
    const { user } = useUser();

    return (
        <motion.nav 
            className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-card/95 shadow-2xl flex justify-around items-center px-2 z-40 backdrop-blur-xl border-t border-border/50"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {menus.map((menu, index) => (
                <Link
                    key={index}
                    href={menu.route}
                    className={clsx(
                        "flex-1 flex flex-col items-center justify-center py-2 transition-all duration-200 relative",
                        "text-foreground/80 hover:text-primary",
                        pathname === menu.route ? "text-primary scale-110" : ""
                    )}
                    aria-label={menu.title}
                >
                    <menu.icon 
                        size={22} 
                        className={clsx(
                            "transition-transform",
                            pathname === menu.route ? "scale-125" : "group-hover:scale-110"
                        )} 
                    />
                    {menu.notification && unreadCount > 0 && (
                        <span className="absolute top-1 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                </Link>
            ))}
            
            {/* Pinggo logo in the center */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-12">
                <motion.div 
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg border-2 border-background"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                </motion.div>
            </div>
        </motion.nav>
    );
};

export default Sidebar;
export { MobileNavigation };