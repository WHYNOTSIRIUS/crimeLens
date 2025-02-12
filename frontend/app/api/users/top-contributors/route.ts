import { NextResponse } from "next/server";

export async function GET() {
  const dummyContributors = [
    {
      id: "1",
      displayName: "Karim Ahmed",
      image: "/avatars/user1.png",
      contributions: 47,
      rank: 1,
    },
    {
      id: "2",
      displayName: "Fatima Rahman",
      image: "/avatars/user2.png",
      contributions: 35,
      rank: 2,
    },
    {
      id: "3",
      displayName: "Mohammad Hasan",
      image: "/avatars/user3.png",
      contributions: 29,
      rank: 3,
    },
    {
      id: "4",
      displayName: "Nusrat Jahan",
      image: "/avatars/user4.png",
      contributions: 24,
      rank: 4,
    },
    {
      id: "5",
      displayName: "Rafiq Islam",
      image: "/avatars/user5.png",
      contributions: 18,
      rank: 5,
    },
  ];

  return NextResponse.json(dummyContributors);
}
