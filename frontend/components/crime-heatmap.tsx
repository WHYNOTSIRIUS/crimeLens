"use client";

import { useState, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import {
  GoogleMap,
  useJsApiLoader,
  Circle,
  Marker,
  InfoWindow
} from "@react-google-maps/api";

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

const darkModeStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }]
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }]
  }
];

const lightModeStyle = [
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
];

export function CrimeHeatmap({
  crimeLocations,
  center = { lat: 23.8103, lng: 90.4125 }, // Default center (Dhaka)
  zoom = 12,
}: CrimeHeatmapProps) {
  const { theme } = useTheme();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [selectedMarker, setSelectedMarker] = useState<CrimeLocation | null>(null);

  // Validate and filter locations
  const validLocations = useMemo(() => 
    crimeLocations.filter(
      (location) => 
        typeof location.lat === 'number' && 
        typeof location.lng === 'number' && 
        !isNaN(location.lat) && 
        !isNaN(location.lng) &&
        location.lat >= -90 && location.lat <= 90 &&
        location.lng >= -180 && location.lng <= 180
    ),
    [crimeLocations]
  );

  const mapOptions = useMemo(() => ({
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    mapTypeId: "roadmap",
    styles: theme === 'dark' ? darkModeStyle : lightModeStyle
  }), [theme]);

  if (loadError) {
    return (
      <Card className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500 font-medium mb-2">Error</p>
          <p className="text-sm text-gray-600">Failed to load Google Maps</p>
        </div>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative">
      <Card className="w-full h-[600px]">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={zoom}
          options={mapOptions}
        >
          {validLocations.map((location) => {
            const weight = location.weight || 1;
            const intensity = weight / 3;
            const delay = Math.random() * 2;

            return (
              <div key={`circle-container-${location.id}`}>
                <Circle
                  key={`circle-${location.id}`}
                  center={{ lat: location.lat, lng: location.lng }}
                  options={{
                    fillColor: theme === 'dark' ? '#FF4444' : '#FF0000',
                    fillOpacity: 0.35 * intensity,
                    strokeColor: theme === 'dark' ? '#FF4444' : '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                    radius: 300,
                    className: 'crime-circle',
                    animation: {
                      duration: 2,
                      delay,
                      iterationCount: 'infinite'
                    }
                  }}
                />
                <Circle
                  key={`glow-${location.id}`}
                  center={{ lat: location.lat, lng: location.lng }}
                  options={{
                    fillColor: theme === 'dark' ? '#FF4444' : '#FF0000',
                    fillOpacity: 0.15 * intensity,
                    strokeColor: theme === 'dark' ? '#FF4444' : '#FF0000',
                    strokeOpacity: 0.4,
                    strokeWeight: 1,
                    radius: 400,
                    className: 'crime-circle',
                    animation: {
                      duration: 2,
                      delay: delay + 0.5,
                      iterationCount: 'infinite'
                    }
                  }}
                />
              </div>
            );
          })}

          {validLocations.map((location) => {
            const weight = location.weight || 1;
            const baseSize = 100; // Meters instead of pixels
            const markerSize = baseSize + (weight * 50);
            const glowRadius = markerSize * 8;
            
            return (
              <div key={`marker-group-${location.id}`}>
                {/* Outer glow */}
                <Circle
                  center={{ lat: location.lat, lng: location.lng }}
                  options={{
                    fillColor: theme === 'dark' ? '#FF4444' : '#FF0000',
                    fillOpacity: 0.2,
                    strokeColor: theme === 'dark' ? '#FF4444' : '#FF0000',
                    strokeOpacity: 0.3,
                    strokeWeight: 2,
                    radius: glowRadius,
                    animation: {
                      duration: 2000,
                      iterate: Infinity,
                    }
                  }}
                />
                {/* Middle glow */}
                <Circle
                  center={{ lat: location.lat, lng: location.lng }}
                  options={{
                    fillColor: theme === 'dark' ? '#FF4444' : '#FF0000',
                    fillOpacity: 0.3,
                    strokeColor: theme === 'dark' ? '#FF4444' : '#FF0000',
                    strokeOpacity: 0.4,
                    strokeWeight: 2,
                    radius: glowRadius * 0.6,
                  }}
                />
                {/* Inner glow */}
                <Circle
                  center={{ lat: location.lat, lng: location.lng }}
                  options={{
                    fillColor: theme === 'dark' ? '#FF4444' : '#FF0000',
                    fillOpacity: 0.4,
                    strokeColor: theme === 'dark' ? '#FF4444' : '#FF0000',
                    strokeOpacity: 0.5,
                    strokeWeight: 2,
                    radius: glowRadius * 0.3,
                  }}
                />
                {/* Main marker */}
                <Circle
                  center={{ lat: location.lat, lng: location.lng }}
                  options={{
                    fillColor: theme === 'dark' ? '#FF6666' : '#FF2222',
                    fillOpacity: 0.9,
                    strokeColor: theme === 'dark' ? '#FF8888' : '#FF4444',
                    strokeOpacity: 1,
                    strokeWeight: 3,
                    radius: markerSize * 0.15,
                    clickable: true,
                    zIndex: 1000,
                  }}
                  onClick={() => setSelectedMarker(location)}
                />
              </div>
            );
          })}

          {selectedMarker && (
            <InfoWindow
              position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-4 max-w-xs dark:bg-gray-800 dark:text-white">
                <h3 className="font-medium text-lg mb-2">{selectedMarker.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {selectedMarker.division}, {selectedMarker.district}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {selectedMarker.time ? format(new Date(selectedMarker.time), "PPp") : ""}
                </p>
                <div className="mt-2 py-1 px-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full text-sm inline-block">
                  Risk Level: {Math.round((selectedMarker.weight || 1) * 100 / 3)}%
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </Card>
    </div>
  );
}
