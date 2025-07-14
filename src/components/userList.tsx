'use client'
import { Edit, Search } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./ui/input";
import clsx from "clsx";
import {users,chats} from "@/constants/constant"
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
const UserList = () => {
    const [search,setSearch] = useState('')

    const router = useRouter()
    const pathname=usePathname()

    
    
  return <div className="flex flex-col gap-5  ">
    {/**top bar */}
    <div className="flex justify-between px-5 w-full pt-10 pb-5">
        <span className="font-semibold text-2xl">loarif</span>
        <Edit width={16} height={16}/>
    </div>


    {/**search bar */}
    <div>
        <form action="" className="w-full">
      <div className="relative w-[340px] mx-[5px]">
        <Search className="absolute left-72 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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


    {/** */}
    <div className="flex flex-col gap-1">

        {
            (users.filter(user=>(user.fullName.includes(search)||user.username.includes(search)))).map((user,index)=>(
                <div key={index} className={clsx(
  "w-full h-18 flex gap-5 border-1 p-2 border-[#7090f91e] rounded-[3px] cursor-pointer",
  pathname.includes(user.id) ? "bg-[#7090f913]" : "hover:bg-[#7090f913]"
)}
 onClick={()=>router.push(`/chat/${user.id}`)}>
                    <Image src={user.avatar} alt='' width={400} height={400} quality={100} className="w-14 h-14 rounded-full border-2 border-blue-400" />
                    <div className="h-full flex flex-col">
                <span>{user.fullName}</span>
<span>
  <span className="text-sm text-[#bbbbbba4]">
  {
    chats
      .filter(chat => (chat.participants.includes("u1")&&chat.participants.includes(user.id)))
      .sort(
        (a, b) =>
          new Date(
            b.messages[b.messages.length - 1]?.timestamp || 0
          ).getTime() -
          new Date(
            a.messages[a.messages.length - 1]?.timestamp || 0
          ).getTime()
      )
      .at(0)?.messages.at(-1)?.text 
  }
</span>

</span>

                    </div>

                </div>
            ))
        }

    </div>

    

  </div>;
};

export default UserList;
