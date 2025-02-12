"use client";

import { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  HeatmapLayer,
} from "@react-google-maps/api";

interface CrimeLocation {
  lat: number;
  lng: number;
  weight?: number;
}

interface CrimeHeatmapProps {
  crimeLocations: CrimeLocation[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

const libraries: ("places" | "visualization")[] = ["visualization"];

export function CrimeHeatmap({
  crimeLocations,
  center = { lat: 23.7500, lng: 90.3900 }, // Default center (between Mohammadpur and Kamlapur)
  zoom = 13,
}: CrimeHeatmapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-[500px] rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-500 font-medium mb-2">Error loading Google Maps</p>
          <p className="text-sm text-gray-600">Please check your API key configuration</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <HeatmapLayer
          data={crimeLocations.map(
            (location) =>
              new google.maps.LatLng(location.lat, location.lng)
          )}
          options={{
            radius: 20,
            opacity: 0.6,
          }}
        />
      </GoogleMap>
    </div>
  );
}
