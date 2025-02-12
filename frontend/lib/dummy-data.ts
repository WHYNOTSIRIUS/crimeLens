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
    avatar: "/images/avatars/avatar1.png",
    verified: true,
    phoneNumber: "+8801712345678"
  },
  {
    id: "user2",
    email: "rahim@example.com",
    password: "password123",
    name: "Rahim Khan",
    avatar: "/images/avatars/avatar2.png",
    verified: true,
    phoneNumber: "+8801712345679"
  },
  {
    id: "user3",
    email: "sarah@example.com",
    password: "password123",
    name: "Sarah Rahman",
    avatar: "/images/avatars/avatar3.png",
    verified: true,
    phoneNumber: "+8801712345680"
  }
];

export const dummyCrimeReports: CrimeReport[] = [
  {
    id: "1",
    title: "Motorcycle Theft in Gulshan",
    description: "A black Yamaha R15 was stolen from Gulshan-1 circle. The incident occurred around 2 PM.",
    division: "Dhaka",
    district: "Dhaka",
    images: ["/images/crimes/crime1.jpg", "/images/crimes/crime2.jpg"],
    postTime: "2025-02-12T08:00:00Z",
    crimeTime: "2025-02-12T07:00:00Z",
    upvotes: 15,
    downvotes: 2,
    verificationScore: 0.85,
    author: {
      id: dummyUsers[0].id,
      name: dummyUsers[0].name,
      avatar: dummyUsers[0].avatar,
      verified: dummyUsers[0].verified
    },
    comments: [
      {
        id: "comment1",
        content: "I saw a similar bike near Banani yesterday",
        author: {
          id: dummyUsers[1].id,
          name: dummyUsers[1].name,
          avatar: dummyUsers[1].avatar,
          verified: dummyUsers[1].verified
        },
        timestamp: "2025-02-12T09:00:00Z"
      }
    ]
  },
  {
    id: "2",
    title: "Phone Snatching at Dhanmondi Lake",
    description: "Two men on a motorcycle snatched a phone from a pedestrian near Dhanmondi Lake Road 2.",
    division: "Dhaka",
    district: "Dhaka",
    images: ["/images/crimes/crime3.jpg"],
    postTime: "2025-02-12T07:30:00Z",
    crimeTime: "2025-02-12T07:00:00Z",
    upvotes: 25,
    downvotes: 1,
    verificationScore: 0.9,
    author: {
      id: dummyUsers[1].id,
      name: dummyUsers[1].name,
      avatar: dummyUsers[1].avatar,
      verified: dummyUsers[1].verified
    },
    comments: []
  },
  {
    id: "3",
    title: "Shoplifting at Chittagong Shopping Complex",
    description: "A group of teenagers were caught shoplifting from a store in Chittagong Shopping Complex.",
    division: "Chittagong",
    district: "Chittagong",
    images: ["/images/crimes/crime4.jpg"],
    postTime: "2025-02-12T06:00:00Z",
    crimeTime: "2025-02-12T05:30:00Z",
    upvotes: 8,
    downvotes: 3,
    verificationScore: 0.75,
    author: {
      id: dummyUsers[0].id,
      name: dummyUsers[0].name,
      avatar: dummyUsers[0].avatar,
      verified: dummyUsers[0].verified
    },
    comments: []
  },
  {
    id: "4",
    title: "Car Break-in at Uttara Sector 4",
    description: "Multiple cars were broken into overnight at Uttara Sector 4. Valuables were stolen.",
    division: "Dhaka",
    district: "Dhaka",
    images: ["/images/crimes/crime5.jpg", "/images/crimes/crime6.jpg"],
    postTime: "2025-02-11T23:00:00Z",
    crimeTime: "2025-02-11T20:00:00Z",
    upvotes: 45,
    downvotes: 2,
    verificationScore: 0.95,
    author: {
      id: dummyUsers[0].id,
      name: dummyUsers[0].name,
      avatar: dummyUsers[0].avatar,
      verified: dummyUsers[0].verified
    },
    comments: []
  },
  {
    id: "5",
    title: "Vandalism in Sylhet City Park",
    description: "Park benches and playground equipment were vandalized in Sylhet City Park.",
    division: "Sylhet",
    district: "Sylhet",
    images: ["/images/crimes/crime7.jpg"],
    postTime: "2025-02-11T22:00:00Z",
    crimeTime: "2025-02-11T21:00:00Z",
    upvotes: 12,
    downvotes: 1,
    verificationScore: 0.8,
    author: {
      id: dummyUsers[1].id,
      name: dummyUsers[1].name,
      avatar: dummyUsers[1].avatar,
      verified: dummyUsers[1].verified
    },
    comments: []
  },
  {
    id: "6",
    title: "Robbery Attempt in Khulna Market",
    description: "Attempted robbery at a jewelry shop in Khulna Market was prevented by local security.",
    division: "Khulna",
    district: "Khulna",
    images: ["/images/crimes/crime8.jpg"],
    postTime: "2025-02-11T21:00:00Z",
    crimeTime: "2025-02-11T20:30:00Z",
    upvotes: 30,
    downvotes: 2,
    verificationScore: 0.88,
    author: {
      id: dummyUsers[0].id,
      name: dummyUsers[0].name,
      avatar: dummyUsers[0].avatar,
      verified: dummyUsers[0].verified
    },
    comments: []
  },
  {
    id: "7",
    title: "Drug Dealing Spotted in Rajshahi",
    description: "Suspicious drug dealing activity reported near Rajshahi College area.",
    division: "Rajshahi",
    district: "Rajshahi",
    images: ["/images/crimes/crime9.jpg"],
    postTime: "2025-02-11T20:00:00Z",
    crimeTime: "2025-02-11T19:00:00Z",
    upvotes: 28,
    downvotes: 4,
    verificationScore: 0.7,
    author: {
      id: dummyUsers[1].id,
      name: dummyUsers[1].name,
      avatar: dummyUsers[1].avatar,
      verified: dummyUsers[1].verified
    },
    comments: []
  },
  {
    id: "8",
    title: "Pickpocketing at Rangpur Bus Terminal",
    description: "Multiple incidents of pickpocketing reported at Rangpur Central Bus Terminal.",
    division: "Rangpur",
    district: "Rangpur",
    images: ["/images/crimes/crime10.jpg"],
    postTime: "2025-02-11T19:00:00Z",
    crimeTime: "2025-02-11T18:00:00Z",
    upvotes: 15,
    downvotes: 2,
    verificationScore: 0.82,
    author: {
      id: dummyUsers[0].id,
      name: dummyUsers[0].name,
      avatar: dummyUsers[0].avatar,
      verified: dummyUsers[0].verified
    },
    comments: []
  },
  {
    id: "9",
    title: "Cyber Cafe Theft in Barisal",
    description: "Computer equipment stolen from a cyber cafe in Barisal city center.",
    division: "Barisal",
    district: "Barisal",
    images: ["/images/crimes/crime11.jpg"],
    postTime: "2025-02-11T18:00:00Z",
    crimeTime: "2025-02-11T17:00:00Z",
    upvotes: 20,
    downvotes: 1,
    verificationScore: 0.86,
    author: {
      id: dummyUsers[1].id,
      name: dummyUsers[1].name,
      avatar: dummyUsers[1].avatar,
      verified: dummyUsers[1].verified
    },
    comments: []
  },
  {
    id: "10",
    title: "Street Fight in Mymensingh",
    description: "A violent street fight broke out between two groups near Mymensingh Medical College.",
    division: "Mymensingh",
    district: "Mymensingh",
    images: ["/images/crimes/crime12.jpg"],
    postTime: "2025-02-11T17:00:00Z",
    crimeTime: "2025-02-11T16:30:00Z",
    upvotes: 35,
    downvotes: 3,
    verificationScore: 0.89,
    author: {
      id: dummyUsers[0].id,
      name: dummyUsers[0].name,
      avatar: dummyUsers[0].avatar,
      verified: dummyUsers[0].verified
    },
    comments: []
  },
  {
    id: "11",
    title: "ATM Fraud in Dhaka",
    description: "Skimming device found at ATM booth in Mohakhali DOHS area.",
    division: "Dhaka",
    district: "Dhaka",
    images: ["/images/crimes/crime13.jpg"],
    postTime: "2025-02-11T16:00:00Z",
    crimeTime: "2025-02-11T15:00:00Z",
    upvotes: 50,
    downvotes: 1,
    verificationScore: 0.92,
    author: {
      id: dummyUsers[1].id,
      name: dummyUsers[1].name,
      avatar: dummyUsers[1].avatar,
      verified: dummyUsers[1].verified
    },
    comments: []
  },
  {
    id: "12",
    title: "Burglary in Chittagong Residential Area",
    description: "House break-in reported in Chittagong's Nasirabad residential area.",
    division: "Chittagong",
    district: "Chittagong",
    images: ["/images/crimes/crime14.jpg"],
    postTime: "2025-02-11T15:00:00Z",
    crimeTime: "2025-02-11T02:00:00Z",
    upvotes: 40,
    downvotes: 2,
    verificationScore: 0.87,
    author: {
      id: dummyUsers[0].id,
      name: dummyUsers[0].name,
      avatar: dummyUsers[0].avatar,
      verified: dummyUsers[0].verified
    },
    comments: []
  },
  {
    id: "13",
    title: "Vehicle Racing in Sylhet",
    description: "Dangerous motorcycle racing reported on Sylhet-Sunamganj highway.",
    division: "Sylhet",
    district: "Sylhet",
    images: ["/images/crimes/crime15.jpg"],
    postTime: "2025-02-11T14:00:00Z",
    crimeTime: "2025-02-11T13:00:00Z",
    upvotes: 25,
    downvotes: 5,
    verificationScore: 0.78,
    author: {
      id: dummyUsers[1].id,
      name: dummyUsers[1].name,
      avatar: dummyUsers[1].avatar,
      verified: dummyUsers[1].verified
    },
    comments: []
  },
  {
    id: "14",
    title: "Counterfeit Money in Khulna",
    description: "Fake currency notes being circulated in Khulna's Daulatpur area markets.",
    division: "Khulna",
    district: "Khulna",
    images: ["/images/crimes/crime16.jpg"],
    postTime: "2025-02-11T13:00:00Z",
    crimeTime: "2025-02-11T12:00:00Z",
    upvotes: 38,
    downvotes: 3,
    verificationScore: 0.85,
    author: {
      id: dummyUsers[0].id,
      name: dummyUsers[0].name,
      avatar: dummyUsers[0].avatar,
      verified: dummyUsers[0].verified
    },
    comments: []
  },
  {
    id: "15",
    title: "School Vandalism in Rajshahi",
    description: "Local school property damaged during overnight break-in.",
    division: "Rajshahi",
    district: "Rajshahi",
    images: ["/images/crimes/crime17.jpg"],
    postTime: "2025-02-11T12:00:00Z",
    crimeTime: "2025-02-11T01:00:00Z",
    upvotes: 42,
    downvotes: 1,
    verificationScore: 0.91,
    author: {
      id: dummyUsers[1].id,
      name: dummyUsers[1].name,
      avatar: dummyUsers[1].avatar,
      verified: dummyUsers[1].verified
    },
    comments: []
  }
];