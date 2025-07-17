'use client'
import { Edit, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import clsx from "clsx";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface ChatPartner {
  id: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isOnline?: boolean;
}

const UserList = () => {
  const [search, setSearch] = useState("");
  const [partners, setPartners] = useState<ChatPartner[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/message/partners")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPartners(data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch chat partners:", err);
        setPartners([]);
      });
  }, []);

  const filteredPartners = partners.filter(
    (user) =>
      (user.fullName && user.fullName.toLowerCase().includes(search.toLowerCase())) ||
      (user.username && user.username.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-5">
      {/* top bar */}
      <div className="flex justify-between px-5 w-full pt-10 pb-5">
        <span className="font-semibold text-2xl">Chats</span>
      </div>
      {/* search bar */}
      <div>
        <form action="" className="w-full">
          <div className="relative w-[340px] mx-[5px]">
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 h-12 text-lg bg-muted rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </form>
      </div>
      {/* chat partner list */}
      {filteredPartners.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">No chats yet</div>
      ) : (
        filteredPartners.map((user) => (
          <div
            key={user.id}
            className={clsx(
              "w-full h-18 flex gap-5 border-1 p-2 border-[#7090f91e] rounded-[3px] cursor-pointer",
              pathname.includes(user.id) ? "bg-[#7090f913]" : "hover:bg-[#7090f913]"
            )}
            onClick={() => router.push(`/chat/${user.id}`)}
          >
            <div className="relative">
              <Image
                src={user.avatarUrl || "/default-profile.png"}
                alt={user.fullName || user.username}
                width={400}
                height={400}
                quality={100}
                className="w-14 h-14 rounded-full border-2 border-blue-400"
              />
              {user.isOnline && (
                <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              )}
            </div>
            <div className="h-full flex flex-col justify-center flex-1 min-w-0">
              <span className="truncate font-medium">{user.fullName || user.username}</span>
              <span className="text-sm text-[#bbbbbba4] truncate max-w-[180px]">
                {user.lastMessage || <span className="italic text-xs text-muted-foreground">No messages yet</span>}
              </span>
            </div>
            {user.lastMessageTime && (
              <span className="text-xs text-muted-foreground self-start pt-1 min-w-[60px] text-right">
                {new Date(user.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserList;
