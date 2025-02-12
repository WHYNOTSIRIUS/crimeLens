"use client";

import { CrimeReport } from "@/lib/dummy-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ThumbsDown, ThumbsUp, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CrimeCommentsDialog } from "./crime-comments-dialog";
import { LoginPromptDialog } from "./login-prompt-dialog";
import { useSession } from "next-auth/react";

interface CrimeCardProps {
  report: CrimeReport;
}

export function CrimeCard({ report }: CrimeCardProps) {
  const { data: session } = useSession();
  const [showComments, setShowComments] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptMessage, setLoginPromptMessage] = useState("");

  const handleAuthRequired = (action: string) => {
    if (!session) {
      setLoginPromptMessage(`Please log in to ${action}`);
      setShowLoginPrompt(true);
      return true;
    }
    return false;
  };
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
            {report.author.verified && (
              <Badge variant="secondary">Verified User</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(report.postTime), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-bold mb-2">{report.title}</h2>
        <div className="flex gap-2 mb-4">
          <Badge variant="outline">{report.division}</Badge>
          <Badge variant="outline">{report.district}</Badge>
          <Badge 
            variant={report.verificationScore >= 0.8 ? "success" : "warning"}
          >
            {Math.round(report.verificationScore * 100)}% Verified
          </Badge>
        </div>
        <p className="mb-4">{report.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {report.images.map((image, index) => (
            <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={`Evidence ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (!handleAuthRequired("upvote")) {
                  // Handle upvote logic here
                }
              }}
            >
              <ThumbsUp className="mr-1 h-4 w-4" />
              {report.upvotes}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (!handleAuthRequired("downvote")) {
                  // Handle downvote logic here
                }
              }}
            >
              <ThumbsDown className="mr-1 h-4 w-4" />
              {report.downvotes}
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              if (!handleAuthRequired("view and add comments")) {
                setShowComments(true);
              }
            }}
          >
            <MessageSquare className="mr-1 h-4 w-4" />
            {report.comments.length} Comments
          </Button>
          <CrimeCommentsDialog
            isOpen={showComments}
            onClose={() => setShowComments(false)}
            report={report}
          />
          <LoginPromptDialog
            isOpen={showLoginPrompt}
            onClose={() => setShowLoginPrompt(false)}
            message={loginPromptMessage}
          />
        </div>

        {report.comments.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="font-semibold mb-2">Latest Comment</h3>
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={report.comments[0].author.avatar} />
                <AvatarFallback>{report.comments[0].author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{report.comments[0].author.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(report.comments[0].timestamp), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm mt-1">{report.comments[0].content}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}