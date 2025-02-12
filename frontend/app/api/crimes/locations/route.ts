import { NextResponse } from "next/server";
import { dummyCrimeReports } from "@/lib/dummy-data";

export async function GET() {
  // Define hotspot areas
  const mohammadpurHotspots = [
    // Mohammadpur Bus Stand area
    { lat: 23.7674, lng: 90.3595, weight: 2.5, title: "Theft near Bus Stand" },
    { lat: 23.7684, lng: 90.3585, weight: 1.8, title: "Phone Snatching" },
    { lat: 23.7664, lng: 90.3575, weight: 1.5, title: "Harassment Case" },
    
    // Mohammadpur Krishi Market area
    { lat: 23.7694, lng: 90.3605, weight: 2.0, title: "Market Pickpocketing" },
    { lat: 23.7654, lng: 90.3615, weight: 1.7, title: "Shop Break-in" },
    
    // Mohammadpur Ring Road area
    { lat: 23.7674, lng: 90.3625, weight: 2.2, title: "Traffic Incident" },
    { lat: 23.7684, lng: 90.3635, weight: 1.9, title: "Street Crime" },
    { lat: 23.7664, lng: 90.3645, weight: 1.6, title: "Vehicle Theft" },
  ];

  const kamlapurHotspots = [
    // Kamlapur Railway Station area
    { lat: 23.7307, lng: 90.4265, weight: 2.8, title: "Station Theft" },
    { lat: 23.7317, lng: 90.4275, weight: 2.3, title: "Bag Snatching" },
    { lat: 23.7297, lng: 90.4255, weight: 2.0, title: "Platform Incident" },
    
    // Nearby residential areas
    { lat: 23.7327, lng: 90.4285, weight: 1.8, title: "Home Break-in" },
    { lat: 23.7287, lng: 90.4245, weight: 1.5, title: "Street Crime" },
    
    // Commercial areas
    { lat: 23.7307, lng: 90.4295, weight: 2.1, title: "Shop Robbery" },
    { lat: 23.7317, lng: 90.4305, weight: 1.9, title: "Market Theft" },
    { lat: 23.7297, lng: 90.4315, weight: 1.7, title: "Phone Snatching" },
  ];

  // Combine hotspots with actual reports
  const allLocations = [
    ...mohammadpurHotspots.map((spot, index) => ({
      ...spot,
      id: `mohammadpur-${index}`,
      time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random time within last 7 days
      division: "Dhaka",
      district: "Dhaka",
    })),
    ...kamlapurHotspots.map((spot, index) => ({
      ...spot,
      id: `kamlapur-${index}`,
      time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      division: "Dhaka",
      district: "Dhaka",
    })),
    // Include filtered actual reports if any
    ...dummyCrimeReports
      .filter(report => {
        const lat = Number(report.latitude);
        const lng = Number(report.longitude);
        
        return (
          typeof lat === 'number' &&
          typeof lng === 'number' &&
          !isNaN(lat) &&
          !isNaN(lng) &&
          lat >= -90 && lat <= 90 &&
          lng >= -180 && lng <= 180
        );
      })
      .map(report => ({
        lat: Number(report.latitude),
        lng: Number(report.longitude),
        weight: report.verificationScore * (1 + report.upvotes / 100),
        id: report.id,
        title: report.title,
        time: report.crimeTime,
        division: report.division,
        district: report.district,
      }))
  ];

  return NextResponse.json(allLocations);
}
