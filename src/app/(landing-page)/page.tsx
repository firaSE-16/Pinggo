"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Brain,
  Video,
  ShoppingBag,
  Users,
  DollarSign,
  ChevronRight,
  ArrowRight,
  Sparkles,
  UserPlus,
  LayoutDashboard,
  Twitter,
  Instagram,
  Linkedin,

} from "lucide-react";
import { ModeToggle } from "@/components/Global/mode-toggle";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    title: "Private & Secure Messaging",
    description:
      "Connect with friends and communities through secure, private messaging. Share thoughts, ideas, and experiences without the noise of traditional social media.",
    icon: MessageSquare,
    color: "bg-blue-500",
  },
  {
    title: "AI Content Tools",
    description:
      "Boost creativity with AI-powered tools to auto-generate captions, suggest hashtags, and improve your posts intelligently.",
    icon: Brain,
    color: "bg-purple-500",
  },
  {
    title: "Reels & Stories for Creators",
    description:
      "Create engaging short videos and stories to express yourself, showcase your talent, or connect with your audience in real-time.",
    icon: Video,
    color: "bg-pink-500",
  },
  {
    title: "Built-in Marketplace",
    description:
      "Buy, sell, or promote products and services right inside the platform — designed for creators, influencers, and brands.",
    icon: ShoppingBag,
    color: "bg-green-500",
  },
  {
    title: "Groups & Communities",
    description:
      "Join or create interest-based groups and communities to share content, host discussions, and build your tribe.",
    icon: Users,
    color: "bg-orange-500",
  },
  {
    title: "Monetize Your Audience",
    description:
      "Turn your influence into income with built-in tools for tips, subscriptions, product sales, and more.",
    icon: DollarSign,
    color: "bg-yellow-500",
  },
];

const comments = [
  {
    user: "Daniel K., Craft Seller",
    text: "Thanks to the built-in marketplace, I sold 3x more handmade items this month — directly through my profile.",
    avatar: "DK",
  },
  {
    user: "Selam A., Community Member",
    text: "I've connected with so many amazing people on Pinggo — it's like my own little corner of the internet.",
    avatar: "SA",
  },
  {
    user: "Alex P., Content Creator",
    text: "The AI tools on Pinggo have completely transformed my content strategy. I'm more productive and creative than ever!",
    avatar: "AP",
  },
];

const steps = [
  {
    title: "Create an account",
    description: "Sign up in seconds with email or social login",
    icon: UserPlus,
  },
  {
    title: "Build your profile",
    description: "Customize your space and connect with like-minded people",
    icon: LayoutDashboard,
  },
  {
    title: "Share & grow",
    description: "Engage with content and watch your network expand",
    icon: ArrowRight,
  },
];

const faqs = [
  {
    question: "What is Pinggo?",
    answer:
      "Pinggo is a next-gen social platform focused on meaningful connections through shared interests and real-time engagement.",
  },
  {
    question: "How do I create an account?",
    answer:
      "Simply click 'Sign Up' and choose between email registration or quick social login options.",
  },
  {
    question: "Is Pinggo free to use?",
    answer:
      "Yes, Pinggo is free with optional premium features for power users and businesses.",
  },
];

const LandingPage = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % comments.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center w-full">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          {/* Floating particles */}
          {[...Array(30)].map((_, i) => {
            const size = Math.random() * 6 + 2;
            const left = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = Math.random() * 15 + 10;
            const opacity = Math.random() * 0.4 + 0.1;
            const color = i % 3 === 0 ? "var(--primary)" : i % 2 === 0 ? "var(--secondary)" : "var(--muted)";

            return (
              <motion.span
                key={i}
                className="absolute bottom-0 rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  backgroundColor: color,
                  opacity,
                }}
                animate={{
                  y: [-1000, window.innerHeight + 100],
                  x: [0, Math.random() * 100 - 50],
                  rotate: [0, 360],
                }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            );
          })}

          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_120%)]">
            <svg
              className="absolute inset-0 h-full w-full stroke-foreground/5 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
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
        </div>

        {/* Navigation */}
        <nav className="absolute top-0 w-full flex justify-between items-center p-6 md:p-10 z-50">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Pinggo</span>
          </motion.div>
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:flex gap-4"
            >
             
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <Link href="/sign-in">
              <Button variant="ghost" className="cursor-pointer text-foreground/80 hover:text-foreground">
                Login
              </Button>
              </Link>
              <Link href="/sign-up">
              <Button className="text-white cursor-pointer rounded-[10px] px-6 h-10 font-medium">
                Sign Up
              </Button>
              </Link>
              <ModeToggle />
            </motion.div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex flex-col items-center text-center px-6 md:px-10 max-w-6xl mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6 px-4 py-2 rounded-full bg-foreground/5 border border-border flex items-center gap-2"
          >
            <span className="text-sm font-medium text-foreground/80">
              Introducing Pinggo 2.0
            </span>
            <ChevronRight className="w-4 h-4 text-foreground/60" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-4xl md:text-6xl font-bold leading-tight mb-6"
          >
            The Next Generation of{" "}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Social Media
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-lg md:text-xl text-foreground/80 max-w-2xl mb-10"
          >
            Step into a smarter, more authentic social world.{" "}
            <span className="font-semibold text-foreground">Pinggo</span> is built for
            creators, communities, and businesses ready to connect with purpose.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link href="/sign-up">
            <Button className="rounded-[10px] px-8 h-12 text-lg font-medium text-white">
              Get Started Free
            </Button>
            </Link>
            <Link href="/learn-more">
            <Button variant="outline" className="rounded-[10px] px-8 h-12 text-lg font-medium">
              Learn More
            </Button>
          </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl bg-muted/50"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Logo Cloud Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-6">
          <p className="text-center text-foreground/60 mb-10 text-sm uppercase tracking-wider">
            Trusted by creators and brands worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 items-center opacity-80">
            {["Forbes", "Vogue", "TechCrunch", "The Verge", "Wired"].map(
              (logo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-2xl font-bold text-foreground/70 hover:text-foreground transition-colors"
                >
                  {logo}
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Real Engagement
              </span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Everything you need to connect, create, and grow your audience in
              one place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-6`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 bg-muted/50 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Started in{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Join thousands of creators and businesses already using Pinggo.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-1 max-w-md"
              >
                <div className="bg-card rounded-2xl p-8 h-full border border-border hover:border-primary/50 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-4">
                      {index + 1}
                    </div>
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-foreground/70 mb-6">{step.description}</p>
                  <Button
                    variant="outline"
                    className="border-primary cursor-pointer text-primary hover:bg-primary/10"
                  >
                    Learn more
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Community Says
              </span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Join thousands of creators and businesses already using Pinggo.
            </p>
          </motion.div>

          <div className="relative h-96">
            {comments.map((comment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }}
                animate={{
                  opacity: activeTestimonial === index ? 1 : 0,
                  x: activeTestimonial === index ? 0 : index % 2 === 0 ? 100 : -100,
                  zIndex: activeTestimonial === index ? 1 : 0,
                }}
                transition={{ duration: 0.5 }}
                className={`absolute top-0 left-0 w-full h-full flex items-center justify-center`}
              >
                <div className="bg-card rounded-2xl p-8 max-w-2xl mx-auto border border-border relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
                  <div className="flex items-start mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-4">
                      {comment.avatar}
                    </div>
                    <div>
                      <p className="text-foreground/90 italic text-lg">
                        "{comment.text}"
                      </p>
                      <p className="text-primary mt-3 font-medium">
                        {comment.user}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {comments.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeTestimonial === index
                    ? "bg-primary w-6"
                    : "bg-foreground/20"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Everything you need to know about Pinggo.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300">
                  <h3 className="text-xl font-bold mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-foreground/70">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="bg-card rounded-3xl p-8 md:p-12 border border-border">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Join the{" "}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Pinggo Community?
                </span>
              </h2>
              <p className="text-lg text-foreground/70 mb-8">
                Join thousands of creators and businesses already using Pinggo to
                connect with their audience in meaningful ways.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <Button className="text-white cursor-pointer rounded-[10px] px-8 h-12 text-lg font-medium">
                    Get Started Free
                  </Button>
                </Link>
                <Button variant="outline" className="cursor-pointer rounded-[10px] px-8 h-12 text-lg font-medium">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Pinggo</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8 md:mb-0">
              <Button variant="ghost" className="text-foreground/70 hover:text-foreground">
                Features
              </Button>
              <Button variant="ghost" className="text-foreground/70 hover:text-foreground">
                Pricing
              </Button>
              <Button variant="ghost" className="text-foreground/70 hover:text-foreground">
                About
              </Button>
              <Button variant="ghost" className="text-foreground/70 hover:text-foreground">
                Blog
              </Button>
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground/50 text-sm mb-4 md:mb-0">
              © 2025 Pinggo. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Button variant="ghost" size="sm" className="text-foreground/50 hover:text-foreground">
                Privacy Policy
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground/50 hover:text-foreground">
                Terms of Service
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;