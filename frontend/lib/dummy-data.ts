export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  verified: boolean;
  phoneNumber: string;
}

export interface CrimeReport {
  id: string;
  title: string;
  description: string;
  division: string;
  district: string;
  images: string[];
  postTime: string;
  crimeTime: string;
  upvotes: number;
  downvotes: number;
  verificationScore: number;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  comments: {
    id: string;
    content: string;
    proof?: string;
    author: {
      id: string;
      name: string;
      avatar: string;
      verified: boolean;
    };
    timestamp: string;
  }[];
}

export const dummyUsers: User[] = [
  {
    id: "user1",
    email: "karim@example.com",
    password: "password123",
    name: "Karim Ahmed",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop",
    verified: true,
    phoneNumber: "+8801712345678"
  },
  {
    id: "user2",
    email: "sarah@example.com",
    password: "password123",
    name: "Sarah Rahman",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    verified: true,
    phoneNumber: "+8801812345678"
  }
];

export const dummyCrimeReports: CrimeReport[] = [
  {
    id: "1",
    title: "Motorcycle Theft at Dhanmondi",
    description: "A black Yamaha R15 motorcycle was stolen from in front of Star Kabab restaurant. The incident occurred around 8 PM when the owner was inside the restaurant.",
    division: "Dhaka",
    district: "Dhanmondi",
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1597404294360-feeeda04612e?w=800&h=600&fit=crop"
    ],
    postTime: "2024-03-20T14:30:00Z",
    crimeTime: "2024-03-20T14:00:00Z",
    upvotes: 45,
    downvotes: 2,
    verificationScore: 0.92,
    author: {
      id: "user1",
      name: "Karim Ahmed",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop",
      verified: true
    },
    comments: [
      {
        id: "c1",
        content: "I saw this incident. The thieves were wearing black helmets and rode away on another motorcycle.",
        proof: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=800&h=600&fit=crop",
        author: {
          id: "user2",
          name: "Rahim Khan",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
          verified: true
        },
        timestamp: "2024-03-20T15:00:00Z"
      }
    ]
  },
  {
    id: "2",
    title: "Phone Snatching at Gulshan 2",
    description: "Two men on a motorcycle snatched an iPhone from a pedestrian near Gulshan 2 circle. The incident was captured by nearby CCTV cameras.",
    division: "Dhaka",
    district: "Gulshan",
    images: [
      "https://images.unsplash.com/photo-1494726161322-5360d4d0eeae?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=600&fit=crop"
    ],
    postTime: "2024-03-19T10:15:00Z",
    crimeTime: "2024-03-19T10:00:00Z",
    upvotes: 32,
    downvotes: 1,
    verificationScore: 0.88,
    author: {
      id: "user3",
      name: "Sarah Rahman",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      verified: true
    },
    comments: [
      {
        id: "c2",
        content: "I have footage from my shop's CCTV that shows the suspects clearly.",
        proof: "https://images.unsplash.com/photo-1576344444573-5920dda9b6b3?w=800&h=600&fit=crop",
        author: {
          id: "user4",
          name: "Mohammad Ali",
          avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
          verified: true
        },
        timestamp: "2024-03-19T11:30:00Z"
      }
    ]
  }
];