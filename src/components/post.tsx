"use client";
import { checkMediaType } from "@/lib/utils";
import { Heart, MessageSquare, Share, MoreHorizontal, Bookmark, Volume2, VolumeX, Sparkles } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);

interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  fullName?: string;
  bio?: string;
  email?: string;
  location?: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: User;
  postId: string;
  parentId: string | null;
  replies?: Comment[];
}

interface Like {
  userId: string;
  postId: string;
  user: User;
}

interface Bookmark {
  userId: string;
  postId: string;
  user: User;
}

interface Media {
  id: string;
  mediaUrl: string;
  postId: string;
  mediaType: 'image' | 'video';
}

interface Mention {
  id: string;
  mentionedId: string;
  postId: string;
  user: User;
}

interface Post {
  id: string;
  content: string | null;
  mediat: Media[];
  location: string | null;
  createdAt: string;
  userId: string;
  user: User;
  likes: Like[];
  comments: Comment[];
  bookmarks: Bookmark[];
  mentions: Mention[];
}

interface PostProps {
  postData: {
    success: boolean;
    data: {
      id: string;
      username: string;
      email: string;
      fullName: string;
      bio: string;
      avatarUrl: string;
      location: string | null;
      posts: Post[];
    };
  };
  isLoading?: boolean;
  refetchPosts?: () => void;
}

const PostSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full max-w-xl bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg overflow-hidden"
    >
      <div className="flex justify-between items-center p-4 border-b border-border/40">
        <div className="flex gap-3 items-center">
          <div className="rounded-full w-10 h-10 bg-muted/60 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-28 bg-muted/40 rounded animate-pulse" />
            <div className="h-3 w-20 bg-muted/30 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-10 bg-muted/60 rounded-full animate-pulse" />
      </div>
      <div className="w-full aspect-square bg-muted/40 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 w-8 bg-muted/60 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="h-8 w-8 bg-muted/60 rounded-full animate-pulse" />
        </div>
        <div className="h-4 w-20 bg-muted/40 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted/40 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted/30 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-28 bg-muted/40 rounded animate-pulse" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-4 w-full bg-muted/30 rounded animate-pulse" />
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-muted/40 rounded animate-pulse" />
          <div className="h-8 w-20 bg-muted/60 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};

const Post = ({ postData, isLoading = false, refetchPosts }: PostProps) => {
  const { user: currentUser } = useUser();
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [allComments, setAllComments] = useState<{ [key: string]: Comment[] }>({});
  const [showAllComments, setShowAllComments] = useState<{ [key: string]: boolean }>({});
  const [savedPosts, setSavedPosts] = useState<{ [key: string]: boolean }>({});
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [mutedStates, setMutedStates] = useState<{ [key: number]: boolean }>({});
  const [mediaErrors, setMediaErrors] = useState<{ [key: number]: boolean }>({});
  const [mediaTypes, setMediaTypes] = useState<{ [key: number]: 'image' | 'video' | 'unknown' }>({});
  const [likeStatus, setLikeStatus] = useState<{ [key: string]: { liked: boolean; likeCount: number } }>({});
  const [replyingTo, setReplyingTo] = useState<{ [key: string]: string | null }>({});
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);

  const user = {
    id: postData.data.id,
    username: postData.data.username,
    avatarUrl: postData.data.avatarUrl,
    fullName: postData.data.fullName,
    bio: postData.data.bio,
    email: postData.data.email,
    location: postData.data.location,
  };

  const userPosts = useMemo(() => postData.data.posts.map(post => ({
    ...post,
    likes: post.likes || [],
    comments: post.comments || [],
    bookmarks: post.bookmarks || [],
    mentions: post.mentions || [],
  })), [postData.data.posts]);

  const postIds = useMemo(() => userPosts.map(p => p.id).join(','), [userPosts]);

  // Initialize states
  useEffect(() => {
    const initialComments: { [key: string]: Comment[] } = {};
    const initialSaved: { [key: string]: boolean } = {};
    const initialLikeStatus: { [key: string]: { liked: boolean; likeCount: number } } = {};

    userPosts.forEach(post => {
      initialComments[post.id] = post.comments || [];
      initialSaved[post.id] = post.bookmarks?.some(bookmark => bookmark.userId === currentUser?.id) || false;
      initialLikeStatus[post.id] = { 
        liked: post.likes?.some(like => like.userId === currentUser?.id), 
        likeCount: post.likes?.length ?? 0 
      };
    });

    setAllComments(initialComments);
    setSavedPosts(initialSaved);
    setLikeStatus(initialLikeStatus);
  }, [postIds, currentUser?.id]);

  // Fetch media types
  useEffect(() => {
    const fetchMediaTypes = async () => {
      const types: { [key: number]: 'image' | 'video' | 'unknown' } = {};
      for (let index = 0; index < userPosts.length; index++) {
        const post = userPosts[index];
        if (post.mediat[0]?.mediaUrl) {
          if (post.mediat[0].mediaType) {
            types[index] = post.mediat[0].mediaType;
          } else {
            types[index] = await checkMediaType(post.mediat[0].mediaUrl);
          }
        } else {
          types[index] = 'unknown';
        }
      }
      setMediaTypes(types);
    };

    fetchMediaTypes();
  }, [userPosts]);

  const handleSubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const commentContent = comments[postId]?.trim();
    if (!commentContent) return;

    try {
      const response = await api.post(`/post/${postId}/comment`, {
        content: commentContent,
        parentId: null
      });

      if (response.data.success) {
        const newComment = response.data.data;
        setAllComments(prev => ({
          ...prev,
          [postId]: [newComment, ...(prev[postId] || [])]
        }));
        setComments(prev => ({ ...prev, [postId]: '' }));
        refetchPosts?.();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleReply = async (postId: string, parentCommentId: string) => {
    const replyContent = replyInputs[parentCommentId]?.trim();
    if (!replyContent) return;
    try {
      const response = await api.post(`/post/${postId}/comment`, {
        content: replyContent,
        parentId: parentCommentId,
      });
      if (response.data.success) {
        const newReply = response.data.data;
        setAllComments(prev => ({
          ...prev,
          [postId]: prev[postId].map(comment =>
            comment.id === parentCommentId
              ? { ...comment, replies: [...(comment.replies || []), newReply] }
              : comment
          ),
        }));
        setReplyInputs(prev => ({ ...prev, [parentCommentId]: '' }));
        setReplyingTo(prev => ({ ...prev, [parentCommentId]: null }));
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const toggleShowComments = (postId: string) => {
    setShowAllComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleLike = async (postId: string, index: number) => {
    const post = userPosts[index];
    const isLiked = likeStatus[postId]?.liked ?? post.likes?.some(like => like.userId === currentUser?.id);
    if (isLiked) return; // Prevent double-like
    try {
      const response = await api.post(`/post/${postId}/like`);
      if (response.data.success) {
        setLikeStatus(prev => ({
          ...prev,
          [postId]: {
            liked: response.data.liked,
            likeCount: response.data.likeCount,
          },
        }));
        refetchPosts?.();
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSave = async (postId: string) => {
    try {
      const response = await api.post(`/post/${postId}/bookmark`);
      
      if (response.data.success) {
        setSavedPosts(prev => ({
          ...prev,
          [postId]: !prev[postId],
        }));
        refetchPosts?.();
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const toggleMute = (index: number) => {
    setMutedStates(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const formatLikeCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const toggleVideoPlay = (index: number) => {
    const video = videoRefs.current[index];
    if (video && !mediaErrors[index]) {
      if (video.paused) {
        if (playingIndex !== null && playingIndex !== index) {
          const currentVideo = videoRefs.current[playingIndex];
          if (currentVideo) currentVideo.pause();
        }
        video.play().then(() => setPlayingIndex(index)).catch(e => {
          console.error("Video playback error:", e);
          setMediaErrors(prev => ({ ...prev, [index]: true }));
        });
      } else {
        video.pause();
        setPlayingIndex(null);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      let closestIndex: number | null = null;
      let smallestDistance = Infinity;

      postRefs.current.forEach((post, index) => {
        if (post && userPosts[index]?.mediat[0] && mediaTypes[index] === 'video' && !mediaErrors[index]) {
          const rect = post.getBoundingClientRect();
          const centerY = window.innerHeight / 2;
          const postCenter = rect.top + rect.height / 2;
          const distance = Math.abs(postCenter - centerY);

          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestIndex = index;
          }
        }
      });

      if (closestIndex !== null) {
        const post = postRefs.current[closestIndex];
        if (post) {
          const rect = post.getBoundingClientRect();
          const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
          const visibilityRatio = visibleHeight / rect.height;

          if (visibilityRatio > 0.5) {
            if (playingIndex !== closestIndex) {
              if (playingIndex !== null) {
                const currentVideo = videoRefs.current[playingIndex];
                if (currentVideo) currentVideo.pause();
              }
              const video = videoRefs.current[closestIndex];
              if (video) {
                video.play().then(() => setPlayingIndex(closestIndex)).catch(e => {
                  console.error("Video playback error:", e);
                  setMediaErrors(prev => ({ ...prev, [closestIndex as number]: true }));
                });
              }
            }
          } else if (playingIndex === closestIndex) {
            const video = videoRefs.current[closestIndex];
            if (video) video.pause();
            setPlayingIndex(null);
          }
        }
      } else if (playingIndex !== null) {
        const video = videoRefs.current[playingIndex];
        if (video) video.pause();
        setPlayingIndex(null);
      }
    };

    const debouncedScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', debouncedScroll);
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, [playingIndex, userPosts, mediaErrors, mediaTypes]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full items-center py-4">
        {[...Array(3)].map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isLoading && (!userPosts || userPosts.length === 0)) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-full py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg p-8 text-center space-y-3 max-w-md">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Pinggo</span>
          </div>
          <div className="text-muted-foreground text-lg font-semibold">No posts yet</div>
          <p className="text-muted-foreground">When you create posts, they'll appear here</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full items-center py-4">
      {userPosts.map((post, index) => {
        const media = Array.isArray(post.mediat) && post.mediat.length > 0 ? post.mediat[0] : undefined;
        const mediaType = mediaTypes[index] || 'unknown';
        const postComments = allComments[post.id] || [];
        const showAll = showAllComments[post.id];
        const isLiked = likeStatus[post.id]?.liked ?? post.likes?.some(like => like.userId === currentUser?.id);
        const likeCount = likeStatus[post.id]?.likeCount ?? post.likes?.length ?? 0;

        return (
          <motion.div
            key={post.id}
            ref={el => { postRefs.current[index] = el; }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex flex-col w-full max-w-xl bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-lg overflow-hidden"
          >
            {/* Post Header */}
            <div className="flex justify-between items-center p-4 border-b border-border/40">
              <Link 
                href={post.user.id !== currentUser?.id ? `/chat/${post.user.id}` : '#'} 
                className="flex gap-3 items-center group"
                prefetch={false}
              >
                <Image
                  src={post.user.avatarUrl || '/default-profile.png'}
                  width={40}
                  height={40}
                  alt={`${post.user.username}'s profile`}
                  className="rounded-full w-10 h-10 border-2 border-primary/30 object-cover group-hover:ring-2 group-hover:ring-primary transition"
                />
                <div>
                  <p className="font-bold text-base group-hover:text-primary transition-colors">
                    {post.user.username}
                  </p>
                  {post.location && (
                    <p className="text-muted-foreground text-xs">
                      {post.location}
                    </p>
                  )}
                </div>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-10 w-10 hover:bg-primary/10"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>

            {/* Media Content */}
            <div className="relative w-full aspect-square bg-muted/40 flex items-center justify-center">
              {media && mediaType === 'image' && !mediaErrors[index] ? (
                <Image
                  src={media.mediaUrl}
                  alt={post.content || `Post by ${post.user.username}`}
                  fill
                  className="w-full h-full object-cover"
                  onError={() => setMediaErrors(prev => ({ ...prev, [index]: true }))}
                />
              ) : media && mediaType === 'video' && !mediaErrors[index] ? (
                <>
                  <video
                    ref={el => { videoRefs.current[index] = el; }}
                    className="w-full h-full object-cover cursor-pointer"
                    src={media.mediaUrl}
                    loop
                    muted={mutedStates[index] ?? true}
                    playsInline
                    onClick={() => toggleVideoPlay(index)}
                    onError={() => setMediaErrors(prev => ({ ...prev, [index]: true }))}
                  >
                    <source src={media.mediaUrl} type="video/mp4" />
                    <source src={media.mediaUrl} type="video/webm" />
                  </video>
                  
                  {playingIndex !== index && (
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      onClick={() => toggleVideoPlay(index)}
                    >
                      <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  <button
                    className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2 backdrop-blur-sm"
                    onClick={e => {
                      e.stopPropagation();
                      toggleMute(index);
                    }}
                  >
                    {mutedStates[index] ?? true ? (
                      <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                </>
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">
                    {mediaErrors[index] ? "Error loading media" : "No media available"}
                  </p>
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleLike(post.id, index)}
                    className={cn(
                      "rounded-full h-9 w-9",
                      isLiked ? "text-destructive hover:bg-destructive/10" : "hover:bg-primary/10"
                    )}
                  >
                    <Heart
                      fill={isLiked ? "currentColor" : "none"}
                      className="w-5 h-5"
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 hover:bg-primary/10"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 hover:bg-primary/10"
                  >
                    <Share className="w-5 h-5" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSave(post.id)}
                  className={cn(
                    "rounded-full h-9 w-9",
                    savedPosts[post.id] ? "text-primary hover:bg-primary/10" : "hover:bg-primary/10"
                  )}
                >
                  <Bookmark
                    fill={savedPosts[post.id] ? "currentColor" : "none"}
                    className="w-5 h-5"
                  />
                </Button>
              </div>

              {/* Likes */}
              <p className="font-semibold text-sm">
                {formatLikeCount(likeCount)} like{likeCount !== 1 ? "s" : ""}
              </p>

              {/* Caption */}
              {post.content && (
                <p className="text-sm">
                  <span className="font-semibold">{post.user.username}</span>{" "}
                  <span>{post.content}</span>
                </p>
              )}

              {/* Comments */}
              {postComments.length > 0 && (
                <div className="space-y-3">
                  {postComments.length > 2 && !showAll && (
                    <button
                      className="text-muted-foreground text-sm hover:text-foreground"
                      onClick={() => toggleShowComments(post.id)}
                    >
                      View all {postComments.length} comments
                    </button>
                  )}
                  
                  {(showAll ? postComments : postComments.slice(0, 2)).map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <Link 
                        href={comment.user.id !== currentUser?.id ? `/chat/${comment.user.id}` : '#'}
                        className="flex-shrink-0"
                        prefetch={false}
                      >
                        <Image
                          src={comment.user.avatarUrl || '/default-profile.png'}
                          alt={comment.user.username}
                          width={32}
                          height={32}
                          className="rounded-full w-8 h-8 object-cover border border-primary/20 hover:ring-2 hover:ring-primary transition"
                        />
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Link 
                            href={comment.user.id !== currentUser?.id ? `/chat/${comment.user.id}` : '#'}
                            className="font-semibold text-sm hover:text-primary transition-colors"
                            prefetch={false}
                          >
                            {comment.user.username}
                          </Link>
                          <span className="text-muted-foreground text-xs">
                            {dayjs(comment.createdAt).fromNow()}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            className="text-primary text-xs hover:underline"
                            onClick={() => setReplyingTo(prev => ({ ...prev, [comment.id]: prev[comment.id] ? null : post.id }))}
                          >
                            Reply
                          </button>
                        </div>
                        {/* Reply form */}
                        {replyingTo[comment.id] === post.id && (
                          <form
                            className="flex gap-2 mt-3"
                            onSubmit={e => {
                              e.preventDefault();
                              handleReply(post.id, comment.id);
                            }}
                          >
                            <Textarea
                              placeholder="Add a reply..."
                              value={replyInputs[comment.id] || ''}
                              onChange={e => setReplyInputs(prev => ({ ...prev, [comment.id]: e.target.value }))}
                              rows={1}
                              className="resize-none flex-1 text-sm min-h-[40px]"
                            />
                            <Button
                              type="submit"
                              variant="ghost"
                              disabled={!replyInputs[comment.id]?.trim()}
                              className="text-primary disabled:text-muted-foreground h-10 px-3 text-sm"
                            >
                              Post
                            </Button>
                          </form>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {showAll && postComments.length > 2 && (
                    <button
                      className="text-muted-foreground text-sm hover:text-foreground"
                      onClick={() => toggleShowComments(post.id)}
                    >
                      Show less
                    </button>
                  )}
                </div>
              )}

              {/* Timestamp */}
              <p className="text-muted-foreground text-xs">
                {dayjs(post.createdAt).fromNow()}
              </p>

              {/* Add Comment */}
              <form 
                onSubmit={e => handleSubmit(e, post.id)} 
                className="flex gap-2 pt-2 border-t border-border/40"
              >
                <Textarea
                  placeholder="Add a comment..."
                  value={comments[post.id] || ""}
                  onChange={e => setComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                  rows={1}
                  className="resize-none flex-1 text-sm min-h-[40px]"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  disabled={!comments[post.id]?.trim()}
                  className="text-primary disabled:text-muted-foreground h-10 px-3 text-sm"
                >
                  Post
                </Button>
              </form>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Post;