"use client"
import Image from "next/image";
import React, { useState } from "react";
import OpenStory from "./OpenStory";

const storyList =[
    {
        username:"loarif",
        profile:"/developerimage/person.jpg",
        media:"/developerimage/story1.jpg"
    },
    {
        username:"loarif",
        profile:"/developerimage/person1.jpg",
        media:"/developerimage/story2.jpg"
    },
    {
        username:"loarif",
        profile:"/developerimage/person2.jpg",
        media:"/developerimage/story9.jpg"
    },
    {
        username:"loarif",
        profile:"/developerimage/person3.jpg",
        media:"/developerimage/story4.jpg"
    },
    {
        username:"loarif",
        profile:"/developerimage/person4.jpg",
        media:"/developerimage/story5.jpg"
    },
    {
        username:"loarif",
        profile:"/developerimage/person1.jpg",
        media:"/developerimage/story6.jpg"
    },
    {
        username:"loarif",
        profile:"/developerimage/person2.jpg",
        media:"/developerimage/story7.jpg"
    },
    {
        username:"loarif",
        profile:"/developerimage/person3.jpg",
        media:"/developerimage/story8.jpg"
    },
    {
        username:"loarif",
        profile:"/developerimage/person4.jpg",
        media:"/developerimage/story9.jpg"
    },
]



const Story = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full">
      <OpenStory
        storyList={storyList}
        currentIndex={currentIndex}
        onClose={() => setIsOpen(false)}
      />
    </div>
  ) : (
    <div className="flex space-x-6 overflow-x-auto p-4 scrollbar-hide h-full bg-gradient-to-b from-background to-muted/40 rounded-xl ">
      {storyList.map((story, index) => (
        <div
          key={index}
          className="shrink-0 flex flex-col gap-2 items-center cursor-pointer group"
          onClick={() => {
            setCurrentIndex(index);
            setIsOpen(true);
          }}
        >
          <div className="rounded-full border-4 border-primary group-hover:scale-105 transition-transform duration-200 ">
            <Image
              src={story.profile}
              alt="story"
              width={72}
              height={72}
              className="object-cover rounded-full w-18 h-18"
            />
          </div>
          <span className="text-xs font-medium text-foreground/80 group-hover:text-primary transition-colors duration-200">
            {story.username}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Story;
