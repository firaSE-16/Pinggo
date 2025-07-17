"use client";
import { checkMediaType } from "@/lib/utils";
import { Heart, MessageSquare, Share, MoreHorizontal, Bookmark, Volume2, VolumeX } from "lucide-react";
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
  replies?: Comment[]; // Added for nested replies
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
      className="flex flex-col w-full max-w-[400px] border rounded-xl overflow-hidden bg-card shadow-sm"
    >
      <div className="flex justify-between items-center p-2 border-b">
        <div className="flex gap-2 items-center">
          <div className="rounded-full w-7 h-7 bg-gray-200 animate-pulse" />
          <div className="space-y-1">
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-2 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-7 w-7 bg-gray-200 rounded-full animate-pulse" />
      </div>

      <div className="w-full h-[450px] bg-gray-200 animate-pulse" />

      <div className="p-2 space-y-2">
        <div className="flex justify-between">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-7 w-7 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="h-7 w-7 bg-gray-200 rounded-full animate-pulse" />
        </div>

        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />

        <div className="space-y-1">
          <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="space-y-1">
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-3 w-full bg-gray-200 rounded animate-pulse" />
          ))}
        </div>

        <div className="flex gap-1">
          <div className="flex-1 h-7 bg-gray-200 rounded animate-pulse" />
          <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
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
      initialLikeStatus[post.id] = { liked: post.likes?.some(like => like.userId === currentUser?.id), likeCount: post.likes?.length ?? 0 };
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
      <div className="flex flex-col overflow-y-auto gap-4 w-full items-center scrollbar-hide py-2 bg-background text-foreground">
        {[...Array(3)].map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isLoading && (!userPosts || userPosts.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8">
        <div className="text-center space-y-2">
          <div className="text-muted-foreground text-lg">No posts yet</div>
          <p className="text-muted-foreground text-sm">When you create posts, they'll appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto gap-4 w-full items-center scrollbar-hide py-2 bg-background text-foreground">
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
            className="flex flex-col w-full max-w-[400px] border rounded-xl overflow-hidden bg-card shadow-sm"
          >
            <div className="flex justify-between items-center p-2 border-b">
              <Link href={post.user.id !== currentUser?.id ? `/chat/${post.user.id}` : '#'} className="flex gap-2 items-center group" prefetch={false}>
                <Image
                  src={post.user.avatarUrl || '/default-profile.png'}
                  width={32}
                  height={32}
                  alt={`${post.user.username}'s profile`}
                  className="rounded-full w-7 h-7 border border-primary/30 object-cover group-hover:ring-2 group-hover:ring-primary transition"
                />
                <div>
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">{post.user.username}</p>
                  {post.location && <p className="text-muted-foreground text-xs">{post.location}</p>}
                </div>
              </Link>
              <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="w-full h-[450px] bg-black flex items-center justify-center relative">
              {media && mediaType === 'image' && !mediaErrors[index] ? (
                <Image
                  src={media.mediaUrl}
                  alt={post.content || `Post by ${post.user.username}`}
                  fill
                  className="w-full h-full object-cover"
                  onError={() => {
                    console.error(`Error loading image for post ${post.id}`);
                    setMediaErrors(prev => ({ ...prev, [index]: true }));
                  }}
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
                    onError={() => {
                      console.error(`Error loading video for post ${post.id}`);
                      setMediaErrors(prev => ({ ...prev, [index]: true }));
                    }}
                  >
                    <source src={media.mediaUrl} type="video/mp4" />
                    <source src={media.mediaUrl} type="video/webm" />
                    Your browser does not support the video tag.
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
                    className="absolute bottom-2 right-2 bg-black/50 rounded-full p-1.5"
                    onClick={e => {
                      e.stopPropagation();
                      toggleMute(index);
                    }}
                  >
                    {mutedStates[index] ?? true ? (
                      <VolumeX className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">{mediaErrors[index] ? "Error loading media" : "No media available"}</p>
                </div>
              )}
            </div>

            <div className="p-2">
              <div className="flex justify-between items-center mb-1">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleLike(post.id, index)}
                    className="rounded-full hover:bg-primary/10 h-7 w-7"
                    disabled={isLiked}
                  >
                    <Heart
                      fill={isLiked ? "#ef4444" : "none"}
                      stroke={isLiked ? "#ef4444" : "currentColor"}
                      className="w-4 h-4"
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-primary/10 h-7 w-7"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-primary/10 h-7 w-7"
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSave(post.id)}
                  className="rounded-full hover:bg-primary/10 h-7 w-7"
                >
                  <Bookmark fill={savedPosts[post.id] ? "currentColor" : "none"} className="w-4 h-4" />
                </Button>
              </div>

              <p className="font-semibold text-xs mb-1">
                {formatLikeCount(likeCount)} like{likeCount !== 1 ? "s" : ""}
              </p>

              {post.content && (
                <p className="mb-1 text-xs">
                  <span className="font-semibold">{post.user.username}</span> <span>{post.content}</span>
                </p>
              )}

              {postComments.length > 0 ? (
                <div className="mb-1">
                  {postComments.length > 2 && !showAll && (
                    <button
                      className="text-muted-foreground text-xs mb-0.5 hover:text-foreground"
                      onClick={() => toggleShowComments(post.id)}
                    >
                      View all {postComments.length} comment{postComments.length !== 1 ? "s" : ""}
                    </button>
                  )}
                  {(showAll ? postComments : postComments.slice(0, 2)).map(comment => (
                    <div key={comment.id} className="mb-2 text-xs border-b border-border pb-2">
                      <Link href={comment.user.id !== currentUser?.id ? `/chat/${comment.user.id}` : '#'} prefetch={false}>
                        <Image
                          src={comment.user.avatarUrl || '/default-profile.png'}
                          alt={comment.user.username}
                          width={24}
                          height={24}
                          className="rounded-full w-6 h-6 object-cover border border-primary/20 hover:ring-2 hover:ring-primary transition"
                        />
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Link href={comment.user.id !== currentUser?.id ? `/chat/${comment.user.id}` : '#'} prefetch={false}>
                            <span className="font-semibold text-foreground hover:text-primary transition-colors">{comment.user.username}</span>
                          </Link>
                          <span className="text-muted-foreground text-2xs">{dayjs(comment.createdAt).fromNow()}</span>
                        </div>
                        <div className="text-foreground mt-0.5">{comment.content}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            className="text-primary text-xs hover:underline focus:outline-none"
                            onClick={() => setReplyingTo(prev => ({ ...prev, [comment.id]: prev[comment.id] ? null : post.id }))}
                          >
                            Reply
                          </button>
                        </div>
                        {/* Replies */}
                        {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                          <div className="ml-7 mt-2 space-y-2 bg-muted/40 rounded-lg p-2">
                            {comment.replies.map(reply => (
                              <div key={reply.id} className="flex items-start gap-2">
                                <Link href={reply.user.id !== currentUser?.id ? `/chat/${reply.user.id}` : '#'} prefetch={false}>
                                  <Image
                                    src={reply.user.avatarUrl || '/default-profile.png'}
                                    alt={reply.user.username}
                                    width={20}
                                    height={20}
                                    className="rounded-full w-5 h-5 object-cover border border-primary/10 hover:ring-2 hover:ring-primary transition"
                                  />
                                </Link>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Link href={reply.user.id !== currentUser?.id ? `/chat/${reply.user.id}` : '#'} prefetch={false}>
                                      <span className="font-semibold text-foreground hover:text-primary transition-colors">{reply.user.username}</span>
                                    </Link>
                                    <span className="text-muted-foreground text-2xs">{dayjs(reply.createdAt).fromNow()}</span>
                                  </div>
                                  <div className="text-foreground mt-0.5">{reply.content}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Reply form */}
                        {replyingTo[comment.id] === post.id && (
                          <form
                            className="flex gap-1 mt-2 ml-7"
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
                              className="resize-none flex-1 text-xs h-7"
                            />
                            <Button
                              type="submit"
                              variant="ghost"
                              disabled={!replyInputs[comment.id]?.trim()}
                              className="text-primary disabled:text-muted-foreground h-7 px-1.5 text-xs"
                            >
                              Reply
                            </Button>
                          </form>
                        )}
                      </div>
                    </div>
                  ))}
                  {showAll && postComments.length > 2 && (
                    <button
                      className="text-muted-foreground text-xs mb-0.5 hover:text-foreground"
                      onClick={() => toggleShowComments(post.id)}
                    >
                      Show less
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-2xs mb-1">No comments yet</p>
              )}

              <form onSubmit={e => handleSubmit(e, post.id)} className="mt-1">
                <div className="flex gap-1">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comments[post.id] || ""}
                    onChange={e => setComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                    rows={1}
                    className="resize-none flex-1 text-xs h-7"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    disabled={!comments[post.id]?.trim()}
                    className="text-primary disabled:text-muted-foreground h-7 px-1.5 text-xs"
                  >
                    Post
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Post;