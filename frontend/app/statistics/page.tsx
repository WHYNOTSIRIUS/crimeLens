"use client";

import { useEffect, useState } from "react";
import { CrimeHeatmap } from "@/components/crime-heatmap";
import { Leaderboard } from "@/components/leaderboard";
import { Loader2 } from "lucide-react";

interface StatsData {
  users: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    reports: number;
    upvotes: number;
    comments: number;
  }[];
  locations: {
    lat: number;
    lng: number;
    weight?: number;
    id?: string;
    title?: string;
    time?: string;
    division?: string;
    district?: string;
  }[];
}

export default function StatisticsPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const stats = await response.json();
        setData(stats);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError(err instanceof Error ? err.message : "Failed to load statistics");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-2">Error</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Crime Statistics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CrimeHeatmap crimeLocations={data.locations} />
        </div>
        <div>
          <Leaderboard users={data.users} />
        </div>
      </div>
    </div>
  );
}
