import Post from "@/components/post";
import Story from "@/components/story";
import Suggestion from "@/components/suggestion";
import Image from "next/image";
import React from "react";

const HomePage = () => {
  return <div className="w-full flex  gap-10">
    <div className="w-full flex flex-col gap-10">

    {/**story*/}
    <div className="h-40  w-full p-5 ">
  <Story/>
    </div>

    {/**posts */}
    <Post/>
    </div>
    <div className="lg:w-[700px]  flex-col pt-10 hidden lg:flex ">
        <div className="flex w-full items-start gap-3" >
        
                                      <Image
                          src="/developerimage/person.jpg"
                          alt="Profile"
                          width={20}
                          height={20}
                          className="rounded-full object-cover w-11 h-11"
                        />
        
                        <div className="flex flex-col ">
                            <h1>loarif</h1>
                            <span className="text-sm text-[#ffffffa9]">Fira</span>
                        </div>
                        <span>Switch</span>
        
        
                    </div>
                    
          

           <Suggestion/>
          
                    
         </div>


  </div>;
};

export default HomePage;
