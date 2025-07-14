import { User } from "lucide-react";
import Image from "next/image";
import React from "react";

const suggestedPerson = [
    {
        name: "David A.",
        profile: "/developerimage/person1.jpg",
        followed: "Fira"
    },
    {
        name: "Andriw B.",
        profile: "/developerimage/person2.jpg",
        followed: "Fira"
    },
    {
        name: "Jhon T.",
        profile: "/developerimage/person3.jpg",
        followed: "Fira"
    },
    {
        name: "Jonson D.",
        profile: "/developerimage/person.jpg",
        followed: "Fira"
    },
];

const Suggestion = () => {
    return (
        <div className="w-full flex flex-col gap-3 items-start mt-20">
            <span className="text-muted-foreground text-sm font-semibold">Suggested for you</span>

            {suggestedPerson.map((person, index) => (
                <div className="flex w-full items-center gap-3 px-10" key={index}>
                    <Image
                        src={person.profile}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="rounded-full object-cover w-11 h-11 border-2 border-transparent group-hover:border-primary transition-colors duration-200"
                    />

                        <div className="flex flex-col flex-grow w-32">
                            <h1 className="text-foreground font-medium">{person.name}</h1>
                            <span className="text-xs text-muted-foreground">Followed by {person.followed} and other 24+</span>
                        </div>
                    <button className="text-sm font-semibold text-primary hover:text-white  cursor-pointer px-3 py-1 rounded-full transition-colors duration-200">
                        Follow
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Suggestion;