import { NextResponse } from "next/server";

// Dummy data for comments
const dummyComments = [
  {
    id: "1",
    content: "This is very concerning. The authorities should take immediate action.",
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    user: {
      id: "1",
      displayName: "Karim Ahmed",
      image: "/avatars/user1.png",
    },
  },
  {
    id: "2",
    content: "I've noticed increased police patrols in this area recently.",
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
    user: {
      id: "2",
      displayName: "Fatima Rahman",
      image: "/avatars/user2.png",
    },
  },
  {
    id: "3",
    content: "We need better street lighting in this area.",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    user: {
      id: "3",
      displayName: "Mohammad Hasan",
      image: "/avatars/user3.png",
    },
  },
];

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  // In a real app, you would fetch comments for the specific post from a database
  return NextResponse.json(dummyComments);
}

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const body = await request.json();
    const { content } = body;

    // In a real app, you would save this to a database
    const newComment = {
      id: Date.now().toString(),
      content,
      createdAt: new Date(),
      user: {
        id: "1", // This would be the logged-in user's ID
        displayName: "Karim Ahmed",
        image: "/avatars/user1.png",
      },
    };

    return NextResponse.json(newComment);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
