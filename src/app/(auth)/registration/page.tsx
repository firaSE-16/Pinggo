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

const registrationSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(50),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  bio: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional(),
});

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
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

  // Check if user already exists in database
  useEffect(() => {
    const checkExistingUser = async () => {
      if (!isLoaded || !user) {
        return;
      }

      try {
        setCheckingRegistration(true);
        const response = await api.get('/user/check-registration');
        
        console.log('Registration page check response:', response.data);
        
        if (response.data.exists === true) {
          console.log('User exists in registration page, redirecting to home');
          toast.success("Welcome back! Redirecting to your home page.");
          router.push('/home');
          return;
        } else {
          console.log('User does not exist, showing registration form');
        }
      } catch (error) {
        console.error('Error checking user registration:', error);
        // If there's an error, continue with registration
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkExistingUser();
  }, [user, isLoaded, router]);

  // Pre-fill form with Clerk user data
  useEffect(() => {
    if (user && isLoaded && !checkingRegistration) {
      form.setValue('fullName', user.fullName || '');
      if (user.imageUrl) {
        setUploadedImageUrl(user.imageUrl);
        form.setValue('avatarUrl', user.imageUrl);
      }
    }
  }, [user, isLoaded, form, checkingRegistration]);

  useEffect(() => {
    if (uploadedImageUrl) {
      form.setValue('avatarUrl', uploadedImageUrl);
    }
  }, [uploadedImageUrl, form]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

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

  // Show loading while checking authentication or registration status
  if (!isLoaded || !user || checkingRegistration) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-lg font-medium">
            {checkingRegistration ? "Checking your registration..." : "Loading..."}
          </p>
          <p className="text-sm text-muted-foreground">
            {checkingRegistration 
              ? "Please wait while we verify your account status" 
              : "Please wait while we load your information"
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-hidden">
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

      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center mb-4"
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3">
                <UserPlus className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Complete your <span className="text-primary">Pinggo</span> account
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-foreground/80 max-w-xl mx-auto"
            >
              Welcome! Let's set up your profile to get you started.
            </motion.p>
          </div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                {/* Display form-level errors */}
                {formErrors.length > 0 && (
                  <div className="bg-destructive/10 p-4 rounded-lg border border-destructive">
                    <p className="text-destructive font-medium">Please fix the following errors:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {formErrors.map((error, index) => (
                        <li key={index} className="text-destructive text-sm">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Avatar Upload Section */}
                <div className="space-y-4">
                  <FormLabel className="text-base font-medium">Profile Picture</FormLabel>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      {uploadedImageUrl ? (
                        <div className="relative">
                          <Image
                            src={uploadedImageUrl}
                            alt="Profile preview"
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-full object-cover border-2 border-border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedImageUrl("");
                              form.setValue('avatarUrl', "");
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs hover:bg-destructive/90 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                          <UserPlus className="w-8 h-8 text-muted-foreground" />
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
                      className="ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90 ut-button:rounded-lg ut-button:px-4 ut-button:py-2"
                    />
                  </div>
                </div>

                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your username"
                          className="h-12 text-base"
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
                      <FormLabel className="text-base font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="h-12 text-base"
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
                      <FormLabel className="text-base font-medium">Bio (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tell us about yourself..."
                          className="h-12 text-base"
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
                    className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Privacy Notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="text-center text-sm text-muted-foreground"
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