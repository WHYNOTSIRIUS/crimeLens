"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface UserStats {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  reports: number;
  upvotes: number;
  comments: number;
}

interface LeaderboardProps {
  users: UserStats[];
}

export function Leaderboard({ users }: LeaderboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Contributors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              {index < 3 && (
                <div className="absolute -top-1 -right-1">
                  <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"}>
                    #{index + 1}
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{user.name}</p>
                {user.verified && (
                  <Badge variant="success" className="h-5 px-1">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>{user.reports} reports</span>
                <span>{user.upvotes} upvotes</span>
                <span>{user.comments} comments</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
