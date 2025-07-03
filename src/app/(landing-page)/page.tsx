import { Button } from "@/components/ui/button";
import React from "react";
import {
  MessageSquare,
  Brain,
  Video,
  ShoppingBag,
  Users,
  DollarSign,
} from "lucide-react";
import { ModeToggle } from "@/components/Global/mode-toggle";

const features = [
  {
    title: "Private & Secure Messaging",
    description:
      "Connect with friends and communities through secure, private messaging. Share thoughts, ideas, and experiences without the noise of traditional social media.",
    icon: MessageSquare,
  },
  {
    title: "AI Content Tools",
    description:
      "Boost creativity with AI-powered tools to auto-generate captions, suggest hashtags, and improve your posts intelligently.",
    icon: Brain,
  },
  {
    title: "Reels & Stories for Creators",
    description:
      "Create engaging short videos and stories to express yourself, showcase your talent, or connect with your audience in real-time.",
    icon: Video,
  },
  {
    title: "Built-in Marketplace",
    description:
      "Buy, sell, or promote products and services right inside the platform — designed for creators, influencers, and brands.",
    icon: ShoppingBag,
  },
  {
    title: "Groups & Communities",
    description:
      "Join or create interest-based groups and communities to share content, host discussions, and build your tribe.",
    icon: Users,
  },
  {
    title: "Monetize Your Audience",
    description:
      "Turn your influence into income with built-in tools for tips, subscriptions, product sales, and more.",
    icon: DollarSign,
  },
];

const comments = [
    {
        user:"Daniel K., Craft Seller",
        text:"Thanks to the built-in marketplace, I sold 3x more handmade items this month — directly through my profile."

    },
    {
        user:"Selam A., Community Member",
        text:"I've connected with so many amazing people on Pinggo — it's like my own little corner of the internet."

    },
    {
        user:"Alex P., Content Creator",
        text:"The AI tools on Pinggo have completely transformed my content strategy. I'm more productive and creative than ever!"

    },
    {
        user:"Jamie L., Small Business Owner",
        text:"Pinggo has helped me reach new customers and grow my business in ways I never thought possible."

    },
    {
        user:"Taylor R., Influencer",
        text:"The community on Pinggo is so supportive and engaging. I've made genuine connections here."

    },

    {
        user:"Jordan T., App Developer",
        text:"Pinggo's features have made it easier for me to collaborate with other creators and share my work."

    },
    
    
]

const LandingPage = () => {
  return (
    <div className="relative min-h-screen w-full margin-auto">
      {/* Navigation */}

      {/* Hero Section */}
      <section className="relative min-h-screen mx-5 md:mx-10 flex gap-5 flex-col items-center justify-center w-full h-[80vh]">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          {/* Floating bubbles */}
          {[...Array(30)].map((_, i) => {
            const size = Math.random() * 8 + 2;
            const left = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = Math.random() * 10 + 5;
            const opacity = Math.random() * 0.4 + 0.2;
            const color = i % 3 === 0 ? "#621ae8" : "#ffffff";

            return (
              <span
                key={i}
                className="absolute bottom-0 rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  backgroundColor: color,
                  opacity,
                  animation: `floatUp ${duration}s ease-in-out ${delay}s infinite`,
                }}
              ></span>
            );
          })}

          {/* Grid background */}
                <nav className="relative flex justify-end w-full pr-5 md:pr-10 gap-5 pt-10 z-50">
                  <Button variant="ghost" className="hover:bg-[#621ae8]/20">
                    Login
                  </Button>
                  <Button className="bg-[#621ae8a6] hover:bg-[#621ae8] rounded-[8px]">
                    Sign Up
                  </Button>
                  <ModeToggle />
                </nav>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#dbdcde10_1px,transparent_1px),linear-gradient(to_bottom,#dbdcde10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_120%)]">
            <svg
              className="absolute inset-0 h-full w-full stroke-white/5 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="hero"
                  width="80"
                  height="80"
                  x="50%"
                  y="-1"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M.5 200V.5H200" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" strokeWidth="0" fill="url(#hero)" />
            </svg>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#621ae8]/10 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center max-w-4xl px-5">
          <h1 className="font-bold text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 pb-4">
            The Next Generation of <span className="text-[#621ae8]">Social Media</span>
          </h1>
          <p className="text-lg text-[#ffffffcc] max-w-2xl mt-6 mb-10">
            Step into a smarter, more authentic social world. <strong className="text-white">Pinggo</strong> is built for creators, communities, and businesses ready to connect with purpose — not just popularity.
          </p>
          <div className="flex gap-5 flex-col sm:flex-row">
            <Button className="bg-[#621ae8a6] hover:bg-[#621ae8] rounded-[8px] w-48 h-12 text-lg font-medium transition-all duration-300 transform hover:scale-105">
              Get Started
            </Button>
            <Button className="bg-white text-[#621ae8] hover:bg-gray-100 rounded-[8px] w-48 h-12 text-lg font-medium transition-all duration-300 transform hover:scale-105">
              Download App
            </Button>
          </div>
        </div>

        {/* Animation styles */}
        <style>
          {`
            @keyframes floatUp {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              50% { opacity: 0.8; }
              100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
          `}
        </style>
      </section>

      {/* Rest of your existing sections... */}
      {/* Features section */}
      <section>
        {features.map((feature, index) => (
          <div key={index}>
            <feature.icon size={24} />
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>

      {/* How It Works section */}
      <section>
        <h1>How It Works</h1>
        <ol>
          <li>Create an account</li>
          <li>Build your profile or join communities</li>
          <li>Share, chat and grow</li>
        </ol>
      </section>

      {/* Testimonials section */}
      <section>
        <h1>What People Say About Pinggo</h1>
        <div>
          {comments.map((comment, index) => (
            <div key={index}>
              <p>{comment.text}</p>
              <p>{comment.user}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ section */}
      <section>
        <h1>FAQS</h1>
        <ul>
          <li>What is Pinggo?</li>
          <li>How do I create an account?</li>
          <li>Can I use Pinggo on mobile?</li>
        </ul>
      </section>

      {/* CTA section */}
      <section>
        <p>Join thousands already using Pinggo.</p>
        <Button>Get Started Free</Button>
      </section>

      {/* Footer */}
      <footer>
        <div>
          <p>About Pinggo</p>
          <p>Help Center</p>
          <p>Terms of Service</p>
          <p>Privacy Policy</p>
        </div>
        <div>
          <p>© 2025 Pinggo. All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;