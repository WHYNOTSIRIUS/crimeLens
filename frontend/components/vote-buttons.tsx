"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteButtonsProps {
  initialUpvotes?: number;
  initialDownvotes?: number;
  userVote?: "up" | "down" | null;
  onVote?: (type: "up" | "down") => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export function VoteButtons({
  initialUpvotes = 0,
  initialDownvotes = 0,
  userVote: initialUserVote = null,
  onVote,
  disabled,
  className,
}: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (type: "up" | "down") => {
    if (isVoting || disabled) return;

    try {
      setIsVoting(true);
      await onVote?.(type);

      if (type === userVote) {
        // Remove vote
        setUserVote(null);
        if (type === "up") setUpvotes(prev => prev - 1);
        else setDownvotes(prev => prev - 1);
      } else {
        // Add/change vote
        if (userVote) {
          // Change vote
          if (userVote === "up") setUpvotes(prev => prev - 1);
          else setDownvotes(prev => prev - 1);
        }
        setUserVote(type);
        if (type === "up") setUpvotes(prev => prev + 1);
        else setDownvotes(prev => prev + 1);
      }
    } catch (error) {
      console.error("Failed to vote:", error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        className={cn(userVote === "up" && "bg-primary text-primary-foreground")}
        onClick={() => handleVote("up")}
        disabled={isVoting || disabled}
      >
        <ThumbsUp className="mr-1 h-4 w-4" />
        {upvotes}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          userVote === "down" && "bg-destructive text-destructive-foreground"
        )}
        onClick={() => handleVote("down")}
        disabled={isVoting || disabled}
      >
        <ThumbsDown className="mr-1 h-4 w-4" />
        {downvotes}
      </Button>
    </div>
  );
} 