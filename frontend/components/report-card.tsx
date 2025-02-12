"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ThumbsUp, ThumbsDown, MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface ReportCardProps {
  report: {
    id: string;
    title: string;
    description: string;
    images: string[];
    video?: string;
    author: {
      name: string;
      avatar?: string;
      isVerified?: boolean;
    };
    location: {
      division: string;
      district: string;
    };
    timestamp: Date;
    verificationScore: number;
    upvotes: number;
    downvotes: number;
    commentCount: number;
  };
  onVote?: (type: "up" | "down") => void;
  onShare?: () => void;
  onComment?: () => void;
}

export function ReportCard({
  report,
  onVote,
  onShare,
  onComment,
}: ReportCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={report.author.avatar} />
          <AvatarFallback>{report.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{report.author.name}</span>
            {report.author.isVerified && (
              <Badge variant="secondary">Verified User</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(report.timestamp, { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-bold">{report.title}</h2>
        
        <div className="flex gap-2">
          <Badge variant="outline">{report.location.division}</Badge>
          <Badge variant="outline">{report.location.district}</Badge>
          <Badge 
            variant={report.verificationScore >= 0.8 ? "success" : "warning"}
          >
            {Math.round(report.verificationScore * 100)}% Verified
          </Badge>
        </div>

        <p className="text-muted-foreground">{report.description}</p>

        <div className="grid grid-cols-2 gap-2">
          {report.images.map((image, index) => (
            <AspectRatio key={index} ratio={16 / 9}>
              <Image
                src={image}
                alt={`Evidence ${index + 1}`}
                fill
                className="rounded-lg object-cover"
              />
            </AspectRatio>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onVote?.("up")}
            >
              <ThumbsUp className="mr-1 h-4 w-4" />
              {report.upvotes}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onVote?.("down")}
            >
              <ThumbsDown className="mr-1 h-4 w-4" />
              {report.downvotes}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onComment}
            >
              <MessageSquare className="mr-1 h-4 w-4" />
              {report.commentCount}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 