import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Get top contributors
  const users = await prisma.user.findMany({
    take: 5,
    orderBy: {
      reports: 'desc'
    },
    select: {
      id: true,
      name: true,
      avatar: true,
      verified: true,
      reports: true,
      upvotes: true,
      comments: true
    }
  });

  // Get crime hotspots
  const crimeHotspots = await prisma.crimeReport.findMany({
    take: 20,
    orderBy: {
      postTime: 'desc'
    },
    select: {
      id: true,
      lat: true,
      lng: true,
      weight: true,
      title: true,
      division: true,
      district: true
    }
  });

  // Add timestamps to hotspots
  const hotspots = crimeHotspots.map((spot, index) => ({
    ...spot,
    id: `hotspot-${index}`,
    time: spot.postTime.toISOString()
  }));

  // Get locations from actual crime reports
  const reportLocations = await prisma.crimeReport.findMany({
    take: 20,
    orderBy: {
      postTime: 'desc'
    },
    select: {
      id: true,
      lat: true,
      lng: true,
      weight: true,
      title: true,
      time: true,
      division: true,
      district: true
    }
  });

  return NextResponse.json({
    users,
    locations: [...hotspots, ...reportLocations]
  });
}
