"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { CrimeReport } from "@/lib/dummy-data";

interface CrimeHotspotMapProps {
  reports: CrimeReport[];
  apiKey: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export function CrimeHotspotMap({ reports, apiKey }: CrimeHotspotMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);

  // Load Google Maps script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey]);

  // Initialize map
  const initMap = () => {
    if (!mapRef.current) return;

    // Center on Bangladesh
    const center = { lat: 23.8103, lng: 90.4125 };
    
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      zoom: 7,
      center,
      mapTypeId: "satellite",
      styles: [
        {
          featureType: "all",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    setMap(mapInstance);

    // Create heatmap layer
    const heatmapData = reports.map((report) => ({
      location: new window.google.maps.LatLng(report.latitude, report.longitude),
      weight: calculateWeight(report),
    }));

    const heatmapLayer = new window.google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: mapInstance,
      radius: 20,
      gradient: [
        "rgba(0, 255, 255, 0)",
        "rgba(0, 255, 255, 1)",
        "rgba(0, 191, 255, 1)",
        "rgba(0, 127, 255, 1)",
        "rgba(0, 63, 255, 1)",
        "rgba(0, 0, 255, 1)",
        "rgba(0, 0, 223, 1)",
        "rgba(0, 0, 191, 1)",
        "rgba(0, 0, 159, 1)",
        "rgba(0, 0, 127, 1)",
        "rgba(63, 0, 91, 1)",
        "rgba(127, 0, 63, 1)",
        "rgba(191, 0, 31, 1)",
        "rgba(255, 0, 0, 1)",
      ],
    });

    setHeatmap(heatmapLayer);
  };

  // Calculate weight based on crime severity and recency
  const calculateWeight = (report: CrimeReport) => {
    const now = new Date();
    const reportDate = new Date(report.crimeTime);
    const daysDifference = Math.floor((now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Base weight on verification score
    let weight = report.verificationScore * 10;

    // Increase weight for recent crimes
    if (daysDifference < 7) {
      weight *= 1.5;
    } else if (daysDifference < 30) {
      weight *= 1.2;
    }

    // Increase weight for crimes with more upvotes
    weight *= (1 + (report.upvotes / 100));

    return weight;
  };

  return (
    <Card className="w-full h-[600px] overflow-hidden">
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </Card>
  );
}
