"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info } from "lucide-react";
import { format } from "date-fns";
import { loadGoogleMaps } from "@/lib/load-google-maps";

interface CrimeLocation {
  lat: number;
  lng: number;
  weight?: number;
  id?: string;
  title?: string;
  time?: string;
  division?: string;
  district?: string;
}

interface CrimeHeatmapProps {
  crimeLocations: CrimeLocation[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

const mapOptions = {
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
  mapTypeId: "terrain",
  styles: [
    {
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "on" }]
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#e9e9e9" }]
    }
  ]
};

const getCircleOptions = (weight: number) => {
  // Normalize weight to be between 0 and 1
  const normalizedWeight = Math.min(Math.max(weight / 3, 0), 1);
  
  // Calculate radius based on weight (between 300 and 1000 meters)
  const radius = 300 + (normalizedWeight * 700);
  
  // Calculate opacity based on weight (between 0.3 and 0.7)
  const opacity = 0.3 + (normalizedWeight * 0.4);
  
  // Calculate color based on weight
  const hue = (1 - normalizedWeight) * 120; // 120 is green, 0 is red
  
  return {
    strokeWeight: 0,
    fillColor: `hsl(${hue}, 100%, 50%)`,
    fillOpacity: opacity,
    radius: radius,
    zIndex: Math.floor(weight * 10)
  };
};

export function CrimeHeatmap({
  crimeLocations,
  center = { lat: 23.8103, lng: 90.4125 }, // Default center (Dhaka)
  zoom = 10,
}: CrimeHeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [circles, setCircles] = useState<google.maps.Circle[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<CrimeLocation | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate and filter locations
  const validLocations = crimeLocations.filter(
    (location) => 
      typeof location.lat === 'number' && 
      typeof location.lng === 'number' && 
      !isNaN(location.lat) && 
      !isNaN(location.lng) &&
      location.lat >= -90 && location.lat <= 90 &&
      location.lng >= -180 && location.lng <= 180
  );



  // Handle map initialization error
  const [error, setError] = useState<string | null>(null);

  // Load Google Maps script and initialize map
  useEffect(() => {
    if (!mapRef.current || map) return;

    const initializeMap = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        console.log('API Key available:', !!apiKey); // Debug log
        
        if (!apiKey) {
          throw new Error('Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.');
        }

        console.log('Loading Google Maps...'); // Debug log
        await loadGoogleMaps(apiKey);
        console.log('Google Maps loaded successfully'); // Debug log

        if (!mapRef.current) {
          throw new Error('Map container reference is not available');
        }

        console.log('Initializing map...'); // Debug log
        const mapInstance = new google.maps.Map(mapRef.current, {
          ...mapOptions,
          center,
          zoom,
        });
        console.log('Map initialized successfully'); // Debug log

        setMap(mapInstance);
        setInfoWindow(new google.maps.InfoWindow());
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(err instanceof Error ? err.message : 'Failed to load Google Maps. Please check your API key and internet connection.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      circles.forEach(circle => circle.setMap(null));
    };
  }, [mapRef.current]);

  if (error) {
    return (
      <Card className="w-full h-[500px] bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500 font-medium mb-2">Error</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full h-[500px] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </Card>
    );
  }

  // Update circles when map or locations change
  useEffect(() => {
    if (!map) return;

    // Clear existing circles
    circles.forEach(circle => circle.setMap(null));

    // Create new circles
    const newCircles = validLocations.map(location => {
      const circle = new google.maps.Circle({
        map,
        center: { lat: Number(location.lat), lng: Number(location.lng) },
        ...getCircleOptions(location.weight || 1),
      });

      // Add click listener
      circle.addListener('click', () => {
        if (!infoWindow) return;

        const content = `
          <div class="p-4 max-w-xs">
            <h3 class="font-medium text-lg mb-2">${location.title}</h3>
            <p class="text-gray-600 mb-2">${location.division}, ${location.district}</p>
            <p class="text-gray-500 text-sm">
              ${format(new Date(location.time || ""), "PPp")}
            </p>
            <div class="mt-2 py-1 px-2 bg-red-100 text-red-800 rounded-full text-sm inline-block">
              Risk Level: ${Math.round((location.weight || 1) * 100 / 3)}%
            </div>
          </div>
        `;

        infoWindow.setContent(content);
        infoWindow.setPosition({ lat: Number(location.lat), lng: Number(location.lng) });
        infoWindow.open(map);
      });

      return circle;
    });

    setCircles(newCircles);

    // Fit bounds
    if (validLocations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      validLocations.forEach(location => {
        bounds.extend({ 
          lat: Number(location.lat), 
          lng: Number(location.lng) 
        });
      });
      map.fitBounds(bounds);
    }

    return () => {
      newCircles.forEach(circle => circle.setMap(null));
    };
  }, [map, validLocations, infoWindow]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium">Risk Levels:</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-sm">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-sm">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm">High</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {validLocations.length} crime reports
        </p>
      </div>

      <Card className="w-full h-[500px] overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />
      </Card>
    </div>
  );
}
