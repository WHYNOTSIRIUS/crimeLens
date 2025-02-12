"use client";

import { useState, useEffect } from "react";
import { CrimeHeatmap } from "@/components/crime-heatmap";
import { Leaderboard } from "@/components/leaderboard";

interface CrimeLocation {
  lat: number;
  lng: number;
  weight?: number;
}

export default function StatisticsPage() {
  const [crimeLocations, setCrimeLocations] = useState<CrimeLocation[]>([]);
  const [topContributors, setTopContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch crime locations for heatmap
        const locationsResponse = await fetch("/api/crimes/locations");
        const locationsData = await locationsResponse.json();
        setCrimeLocations(locationsData);

        // Fetch top contributors
        const contributorsResponse = await fetch("/api/users/top-contributors");
        const contributorsData = await contributorsResponse.json();
        setTopContributors(contributorsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Crime Statistics</h1>
        <p className="text-gray-600 mb-6">
          View crime hotspots and top community contributors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Crime Hotspots</h2>
          <CrimeHeatmap crimeLocations={crimeLocations} />
        </div>
        <div>
          <Leaderboard users={topContributors} />
        </div>
      </div>
    </div>
  );
}
