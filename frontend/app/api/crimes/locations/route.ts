import { NextResponse } from "next/server";

export async function GET() {
  // Dummy data with multiple points around Mohammadpur and Kamlapur to create hotspots
  const dummyLocations = [
    // Mohammadpur area (multiple points to create a hotspot)
    { lat: 23.7674, lng: 90.3595, weight: 1 },
    { lat: 23.7684, lng: 90.3585, weight: 1 },
    { lat: 23.7664, lng: 90.3575, weight: 1 },
    { lat: 23.7694, lng: 90.3605, weight: 1 },
    { lat: 23.7654, lng: 90.3615, weight: 1 },
    { lat: 23.7674, lng: 90.3625, weight: 1 },
    { lat: 23.7684, lng: 90.3635, weight: 1 },
    { lat: 23.7664, lng: 90.3645, weight: 1 },
    
    // Kamlapur area (multiple points to create a hotspot)
    { lat: 23.7307, lng: 90.4265, weight: 1 },
    { lat: 23.7317, lng: 90.4275, weight: 1 },
    { lat: 23.7297, lng: 90.4255, weight: 1 },
    { lat: 23.7327, lng: 90.4285, weight: 1 },
    { lat: 23.7287, lng: 90.4245, weight: 1 },
    { lat: 23.7307, lng: 90.4295, weight: 1 },
    { lat: 23.7317, lng: 90.4305, weight: 1 },
    { lat: 23.7297, lng: 90.4315, weight: 1 },
  ];

  return NextResponse.json(dummyLocations);
}
