"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Share2, AlertTriangle, ThumbsUp } from "lucide-react";
import { CommentsDialog } from "./comments-dialog";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  displayName: string;
  image?: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: User;
}

interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: Date;
  location: string;
  category: string;
  user: User;
  likes: number;
  isLiked?: boolean;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onReport?: (postId: string) => void;
}

export function PostCard({ post, onLike, onShare, onReport }: PostCardProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (content: string) => {
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      
      const newComment = await response.json();
      setComments((prev) => [newComment, ...prev]);
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  const handleLikeClick = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        onLike?.(post.id);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = async () => {
    try {
      // Create the share text
      const shareText = `Check out this crime report: ${post.title}\n${post.content}\nLocation: ${post.location}`;
      
      // Use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: window.location.href,
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareText);
        alert('Link copied to clipboard!');
      }
      
      onShare?.(post.id);
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const handleReport = async () => {
    const reason = prompt('Please specify the reason for reporting this post:');
    if (!reason) return;

    try {
      const response = await fetch(`/api/posts/${post.id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        alert('Thank you for your report. Our team will review it shortly.');
        onReport?.(post.id);
      }
    } catch (error) {
      console.error('Error reporting post:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      {/* Post Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative w-10 h-10">
          <Image
            src={post.user.image || "/default-avatar.png"}
            alt={post.user.displayName}
            className="rounded-full"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{post.user.displayName}</h3>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            <span>•</span>
            <span>{post.location}</span>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-4">{post.content}</p>
        {post.image && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn("space-x-2", isLiked && "text-blue-600")}
            onClick={handleLikeClick}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{likesCount}</span>
          </Button>

          <CommentsDialog
            postId={post.id}
            comments={comments}
            onAddComment={handleAddComment}
          />

          <Button
            variant="ghost"
            size="sm"
            className="space-x-2"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="space-x-2 text-yellow-600"
            onClick={handleReport}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Report</span>
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          <span className="font-medium px-2 py-1 bg-gray-100 rounded">
            {post.category}
          </span>
        </div>
      </div>
    </div>
  );
}
