"use client";
import { toast } from 'sonner'
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadButton } from "@/utils/uploadthing";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Shield, UserPlus, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from 'axios'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ModeToggle } from '@/components/Global/mode-toggle';
import { UserButton } from "@clerk/nextjs";

const registrationSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(50),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  bio: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional(),
});

const Page = () => {
  const [loading, setLoading] = useState(false);
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      fullName: "",
      bio: "",
      avatarUrl: "",
    },
  });

  // Only redirect to sign-in if not logged in
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  // Pre-fill form with Clerk user data
  useEffect(() => {
    if (user && isLoaded) {
      form.setValue('fullName', user.fullName || '');
      if (user.imageUrl) {
        setUploadedImageUrl(user.imageUrl);
        form.setValue('avatarUrl', user.imageUrl);
      }
    }
  }, [user, isLoaded, form]);

  useEffect(() => {
    if (uploadedImageUrl) {
      form.setValue('avatarUrl', uploadedImageUrl);
    }
  }, [uploadedImageUrl, form]);

  async function onSubmit(values: z.infer<typeof registrationSchema>) {
    try {
      console.log("Form values before submission:", values);
      setLoading(true);
      setFormErrors([]);
      
      // Validate the form again before submission
      const result = registrationSchema.safeParse(values);
      if (!result.success) {
        const errors = result.error.errors.map(err => err.message);
        setFormErrors(errors);
        console.error("Validation errors:", errors);
        toast.error("Please fix the form errors");
        return;
      }

      const response = await axios.post("/api/registration", values);
      console.log("API Response:", response.data);
      
      if (response.data.success) {
        toast.success("Account created successfully!");
        router.push('/home');
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed";
      
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.statusText;
      } else if (error.request) {
        errorMessage = "No response from server";
      } else {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Show loading while Clerk is loading or user is not loaded
  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-lg font-medium">Loading...</p>
          <p className="text-sm text-muted-foreground">Please wait while we load your information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-hidden flex flex-col items-center justify-center">
      {/* Top bar with dark mode toggle and user/login button */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-4">
        <ModeToggle />
        {isLoaded && user ? (
          <UserButton afterSignOutUrl="/sign-in" />
        ) : (
          <Link href="/sign-in">
            <Button variant="outline" className="rounded-full px-6 py-2 font-semibold">Login</Button>
          </Link>
        )}
      </div>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem]">
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
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center mb-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-3 shadow-lg">
                <UserPlus className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary drop-shadow-lg">
                Complete your <span className="text-primary">Pinggo</span> account
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-foreground/80 max-w-xl mx-auto mt-2"
            >
              Welcome! Let's set up your profile to get you started.
            </motion.p>
          </div>
          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card/80 rounded-3xl p-8 md:p-12 border border-border shadow-2xl backdrop-blur-xl"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 md:space-y-10">
                {/* Display form-level errors */}
                {formErrors.length > 0 && (
                  <div className="bg-destructive/10 p-4 rounded-lg border border-destructive shadow-md">
                    <p className="text-destructive font-semibold">Please fix the following errors:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {formErrors.map((error, index) => (
                        <li key={index} className="text-destructive text-sm">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Avatar Upload Section */}
                <div className="space-y-4 flex flex-col items-center">
                  <FormLabel className="text-base font-semibold">Profile Picture</FormLabel>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      {uploadedImageUrl ? (
                        <div className="relative">
                          <Image
                            src={uploadedImageUrl}
                            alt="Profile preview"
                            width={112}
                            height={112}
                            className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedImageUrl("");
                              form.setValue('avatarUrl', "");
                            }}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-lg hover:bg-destructive/90 shadow-md transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-muted border-4 border-dashed border-primary/40 flex items-center justify-center shadow-lg">
                          <UserPlus className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <UploadButton
                      endpoint="mediaUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res[0]) {
                          setUploadedImageUrl(res[0].url);
                          toast.success("Image uploaded successfully!");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Upload failed: ${error.message}`);
                      }}
                      className="ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90 ut-button:rounded-lg ut-button:px-4 ut-button:py-2 mt-2"
                    />
                  </div>
                </div>
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your username"
                          className="h-12 text-base rounded-xl shadow-sm focus:shadow-md transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Full Name Field */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="h-12 text-base rounded-xl shadow-sm focus:shadow-md transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Bio Field */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Bio (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tell us about yourself..."
                          className="h-12 text-base rounded-xl shadow-sm focus:shadow-md transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
                {/* Privacy Notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="text-center text-sm text-muted-foreground mt-4"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Your data is protected and secure</span>
                  </div>
                </motion.div>
              </form>
            </Form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;