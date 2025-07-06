"use client";
import {toast} from 'sonner'
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
import { Shield, UserPlus, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from 'axios'
const registrationSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(7).max(50),
  fullName: z.string().min(2).max(100),
  bio: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional(),
});

const Page = () => {

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { user } = useUser();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      email: user?.emailAddresses[0].emailAddress,
      password: "",
      fullName: "",
      bio: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    toast("Toast test: If you see this, toasts are working!");
  }, []);

  async function onSubmit(values: z.infer<typeof registrationSchema>) {
    console.log("form submitted with values", values);
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.post("/api/registration", values);
      toast.success("Your account was created successfully!");
      console.log("API response:", response);
    } catch (error: unknown) {
      let msg = "";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data.message || "Registration failed";
        console.error("API error response:", error.response);
      } else {
        msg = "Something went wrong";
        console.error("Unknown error:", error);
      }
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-hidden">
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
              Join our community of creators and connect with your audience in meaningful ways.
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 md:space-y-8"
              >
                {errorMessage && (
                  <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">
                    {errorMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your username"
                            {...field}
                            className="rounded-lg h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            className="rounded-lg h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                            className="rounded-lg h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bio */}
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80">
                          Bio (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tell us about yourself"
                            {...field}
                            className="rounded-lg h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="avatarUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">
                            Profile Picture (Optional)
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              {uploadedImageUrl && (
                                <div className="flex items-center justify-center">
                                  <div className="relative">
                                    <img
                                      src={uploadedImageUrl}
                                      alt="Profile preview"
                                      className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setUploadedImageUrl("");
                                        field.onChange("");
                                      }}
                                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
                              )}
                              <div className="rounded-lg border border-dashed border-border p-6">
                                 <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          if (res && res[0]) {
            setUploadedImageUrl(res[0].ufsUrl);
            field.onChange(res[0].ufsUrl);
          }
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          console.error("Upload error:", error);
          alert(`ERROR! ${error.message}`);
        }}
      />
                                                            </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Privacy and Terms */}
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-sm text-foreground/70">
                    By creating an account, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="pt-2"
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer rounded-[10px] h-12 text-lg font-medium"
                  >
                    Complete Account <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>

                
              </form>
            </Form>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-8 text-foreground/70 text-sm"
          >
            Need help?{" "}
            <Link href="/support" className="text-primary hover:underline">
              Contact Support
            </Link>{" "}
            or{" "}
            <Link href="/faq" className="text-primary hover:underline">
              FAQ
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;