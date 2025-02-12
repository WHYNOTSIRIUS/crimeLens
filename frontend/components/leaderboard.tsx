"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface LeaderboardUser extends User {
  contributions: number;
  rank: number;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
}

export function Leaderboard({ users }: LeaderboardProps) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-600";
      default:
        return "text-gray-700";
    }
  };

  const getTrophyColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-600";
      default:
        return "text-gray-700";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Contributors</CardTitle>
        <CardDescription>
          Users with the most reports and helpful comments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="relative w-12 h-12">
                <Image
                  src={user.image || "/default-avatar.png"}
                  alt={user.displayName}
                  className="rounded-full"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{user.displayName}</h3>
                  {user.rank <= 3 && (
                    <Trophy
                      size={16}
                      className={getTrophyColor(user.rank)}
                    />
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {user.contributions} contributions
                </p>
              </div>
              <Badge
                variant="secondary"
                className={`${getRankColor(
                  user.rank
                )} font-semibold`}
              >
                #{user.rank}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
