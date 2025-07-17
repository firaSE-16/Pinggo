"use client";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadButton } from "@/utils/uploadthing";
import { motion } from "framer-motion";
import { ImageIcon, VideoIcon, CameraIcon } from "@radix-ui/react-icons";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { uploadPost } from "@/services/postService";
import { uploadStory } from "@/services/storyService";
import { uploadReel } from "@/services/reelService";
import Loading from "@/components/loading";
import Link from "next/link";

// Updated checkMediaType function to handle UploadThing URLs
export async function checkMediaType(url: string): Promise<'image' | 'video' | 'unknown'> {
  // Try extension-based check first
  const extension = url.split('.').pop()?.toLowerCase();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
  const videoExtensions = ['mp4', 'webm', 'ogv', 'mov', 'avi', 'mkv'];

  if (extension && imageExtensions.includes(extension)) return 'image';
  if (extension && videoExtensions.includes(extension)) return 'video';

  // Fallback to HEAD request for MIME type
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      console.error(`HEAD request failed for URL ${url}: ${response.status}`);
      return 'unknown';
    }

    const contentType = response.headers.get('Content-Type')?.toLowerCase();
    if (!contentType) {
      console.error(`No Content-Type header for URL ${url}`);
      return 'unknown';
    }

    if (contentType.startsWith('image/')) return 'image';
    if (contentType.startsWith('video/')) return 'video';
    return 'unknown';
  } catch (error) {
    console.error(`Error fetching media type for URL ${url}:`, error);
    return 'unknown';
  }
}

// Define form schemas with mediaType
const postSchema = z.object({
  content: z.string().optional(),
  location: z.string().optional(),
  mediaUrls: z
    .array(
      z.object({
        url: z.string().url(),
        mediaType: z.enum(['image', 'video']),
      })
    )
    .min(1, "At least one media file is required"),
});

const storySchema = z.object({
  caption: z.string().optional(),
  mediaUrl: z.string().url({ message: "A valid media URL is required" }),
  mediaType: z.literal('image', { message: "Stories can only include images" }),
});

const reelSchema = z.object({
  caption: z.string().optional(),
  mediaUrl: z.string().url({ message: "A valid video URL is required" }),
  mediaType: z.literal('video', { message: "Reels can only include videos" }),
});

type FormType = "post" | "story" | "reel";

export function MediaUploadForm() {
  const [activeTab, setActiveTab] = useState<FormType>("post");
  const [previewUrls, setPreviewUrls] = useState<{ url: string; mediaType: 'image' | 'video' | 'unknown' }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize forms
  const postForm = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      location: "",
      mediaUrls: [],
    },
  });

  const storyForm = useForm<z.infer<typeof storySchema>>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      caption: "",
      mediaUrl: "",
      mediaType: 'image',
    },
  });

  const reelForm = useForm<z.infer<typeof reelSchema>>({
    resolver: zodResolver(reelSchema),
    defaultValues: {
      caption: "",
      mediaUrl: "",
      mediaType: 'video',
    },
  });

  // Reset forms and previews when tab changes
  useEffect(() => {
    postForm.reset();
    storyForm.reset();
    reelForm.reset();
    setPreviewUrls([]);
  }, [activeTab, postForm, storyForm, reelForm]);

  // Handle form submission
  const onSubmit = async (
    values: z.infer<typeof postSchema> | z.infer<typeof storySchema> | z.infer<typeof reelSchema>
  ) => {
    setIsUploading(true);

    try {
      let response;

      if (activeTab === "post") {
        response = await uploadPost(values);
      } else if (activeTab === "story") {
        response = await uploadStory(values);
      } else if (activeTab === "reel") {
        response = await uploadReel(values);
      } else {
        throw new Error("Invalid content type");
      }

      if (response.data.success) {
        
        toast.success(`${activeTab} created successfully!`);
        console.log(`${activeTab} submission successful:`, response.data);

        // Reset the correct form
        if (activeTab === "post") postForm.reset();
        if (activeTab === "story") storyForm.reset();
        if (activeTab === "reel") reelForm.reset();

        setPreviewUrls([]);
      } else {
        console.log(`${activeTab} submission successful:`, response.data.message);

        throw new Error(response.data.message || `${activeTab} upload failed`);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || `${activeTab} upload failed`
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Render media preview
  const renderMediaPreview = (urls: { url: string; mediaType: 'image' | 'video' | 'unknown' }[]) => {
    if (urls.length === 0) return null;

    return (
      <div className="grid grid-cols-3 gap-2 mt-4">
        {urls.map((item, index) => (
          <div key={index} className="relative aspect-square rounded-md overflow-hidden">
            {item.mediaType === 'video' ? (
              <video src={item.url} controls className="w-full h-full object-cover" />
            ) : item.mediaType === 'image' ? (
              <img src={item.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Unsupported media</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                const newUrls = urls.filter((_, i) => i !== index);
                setPreviewUrls(newUrls);
                if (activeTab === "post") {
                  postForm.setValue(
                    "mediaUrls",
                    newUrls
                      .filter(u => u.mediaType !== "unknown")
                      .map(u => ({ url: u.url, mediaType: u.mediaType as 'image' | 'video' }))
                  );
                } else if (activeTab === "story") {
                  storyForm.setValue("mediaUrl", "");
                  storyForm.setValue("mediaType", 'image');
                } else if (activeTab === "reel") {
                  reelForm.setValue("mediaUrl", "");
                  reelForm.setValue("mediaType", 'video');
                }
              }}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  if (!isMounted) {
    return null;
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
              <pattern id="hero" width="80" height="80" x="50%" y="-1" patternUnits="userSpaceOnUse">
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
                <ImageIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Share your <span className="text-primary">Pinggo</span> content
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-foreground/80 max-w-xl mx-auto"
            >
              Create posts, stories, or reels to connect with your audience.
            </motion.p>
          </div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm"
          >
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FormType)}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="post">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Post
                </TabsTrigger>
                <TabsTrigger value="story">
                  <CameraIcon className="mr-2 h-4 w-4" />
                  Story
                </TabsTrigger>
                <TabsTrigger value="reel">
                  <VideoIcon className="mr-2 h-4 w-4" />
                  Reel
                </TabsTrigger>
              </TabsList>

              <TabsContent value="post">
                <Form {...postForm}>
                  <form onSubmit={postForm.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                    {!isUploading ? (
                      <div className="grid grid-cols-1 gap-6">
                        <FormField
                          control={postForm.control}
                          name="mediaUrls"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80">Media (Image or Video)</FormLabel>
                              <FormControl>
                                <div className="space-y-4">
                                  {renderMediaPreview(previewUrls)}
                                  <div className="rounded-lg border border-dashed border-border p-6">
                                    <UploadButton
                                      endpoint="mediaUploader"
                                      content={{
                                        allowedContent: "Images or Videos",
                                      }}
                                      onClientUploadComplete={async (res) => {
                                        if (res?.length) {
                                          const newUrls = await Promise.all(
                                            res.map(async (file) => {
                                              const mediaType = await checkMediaType(file.url);
                                              return { url: file.url, mediaType };
                                            })
                                          );
                                          setPreviewUrls(newUrls);
                                          postForm.setValue(
                                            "mediaUrls",
                                            newUrls
                                              .filter(u => u.mediaType !== "unknown")
                                              .map(u => ({ url: u.url, mediaType: u.mediaType as 'image' | 'video' }))
                                          );
                                        }
                                      }}
                                      onUploadError={(error: Error) => {
                                        console.error("Upload error:", error);
                                        toast.error(`Upload failed: ${error.message}`);
                                      }}
                                    />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={postForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80">Caption (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="What's on your mind?"
                                  className="resize-none rounded-lg h-24"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={postForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80">Location (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Add location" className="rounded-lg h-12" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-10 justify-center items-center h-80">
                        <Loading />
                        <p className="text-3xl font-bold">Just a moment...</p>
                      </div>
                    )}

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
                      <Button
                        type="submit"
                        disabled={isUploading}
                        className="w-full cursor-pointer rounded-[10px] h-12 text-lg font-medium"
                      >
                        Create Post <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="story">
                <Form {...storyForm}>
                  <form onSubmit={storyForm.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                    {!isUploading ? (
                      <div className="grid grid-cols-1 gap-6">
                        <FormField
                          control={storyForm.control}
                          name="mediaUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80">Image</FormLabel>
                              <FormControl>
                                <div className="space-y-4">
                                  {renderMediaPreview(previewUrls)}
                                  <div className="rounded-lg border border-dashed border-border p-6">
                                    <UploadButton
                                      endpoint="mediaUploader"
                                      content={{
                                        allowedContent: "Images (jpg, jpeg, png, gif, webp)",
                                      }}
                                      onClientUploadComplete={async (res) => {
                                        if (res?.[0]?.url) {
                                          const mediaType = await checkMediaType(res[0].url);
                                          if (mediaType !== 'image') {
                                            toast.error("Stories can only include images");
                                            return;
                                          }
                                          setPreviewUrls([{ url: res[0].url, mediaType }]);
                                          field.onChange(res[0].url);
                                          storyForm.setValue("mediaType", 'image');
                                        }
                                      }}
                                      onUploadError={(error: Error) => {
                                        console.error("Upload error:", error);
                                        toast.error(`Upload failed: ${error.message}`);
                                      }}
                                    />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={storyForm.control}
                          name="caption"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80">Caption (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Add a caption..."
                                  className="resize-none rounded-lg h-24"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-10 justify-center items-center h-80">
                        <Loading />
                        <p className="text-3xl font-bold">Just a moment...</p>
                      </div>
                    )}

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
                      <Button
                        type="submit"
                        disabled={isUploading}
                        className="w-full cursor-pointer rounded-[10px] h-12 text-lg font-medium"
                      >
                        Share Story <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="reel">
                <Form {...reelForm}>
                  <form onSubmit={reelForm.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                    {!isUploading ? (
                      <div className="grid grid-cols-1 gap-6">
                        <FormField
                          control={reelForm.control}
                          name="mediaUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80">Video</FormLabel>
                              <FormControl>
                                <div className="space-y-4">
                                  {renderMediaPreview(previewUrls)}
                                  <div className="rounded-lg border border-dashed border-border p-6">
                                    <UploadButton
                                      endpoint="mediaUploader"
                                      content={{
                                        allowedContent: "Videos (mp4, webm, mov)",
                                      }}
                                      onClientUploadComplete={async (res) => {
                                        if (res?.[0]?.url) {
                                          const mediaType = await checkMediaType(res[0].url);
                                          if (mediaType !== 'video') {
                                            toast.error("Reels can only include videos");
                                            return;
                                          }
                                          setPreviewUrls([{ url: res[0].url, mediaType }]);
                                          field.onChange(res[0].url);
                                          reelForm.setValue("mediaType", 'video');
                                        }
                                      }}
                                      onUploadError={(error: Error) => {
                                        console.error("Upload error:", error);
                                        toast.error(`Upload failed: ${error.message}`);
                                      }}
                                    />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={reelForm.control}
                          name="caption"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80">Caption (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Add a caption..."
                                  className="resize-none rounded-lg h-24"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-10 justify-center items-center h-80">
                        <Loading />
                        <p className="text-3xl font-bold">Just a moment...</p>
                      </div>
                    )}

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
                      <Button
                        type="submit"
                        disabled={isUploading}
                        className="w-full cursor-pointer rounded-[10px] h-12 text-lg font-medium"
                      >
                        Share Reel <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </motion.div>

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
}