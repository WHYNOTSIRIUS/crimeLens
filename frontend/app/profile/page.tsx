"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditProfileDialog } from "@/components/edit-profile-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Phone, Mail, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Temporary type definitions until we have the actual types
interface User {
  id: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
  bio: string;
  contactInfo: string;
  verified: boolean;
  createdAt: string;
}

interface CrimeReport {
  id: string;
  title: string;
  location: string;
  crimeType: string;
  description: string;
  date: string;
  status: "pending" | "verified" | "resolved";
  createdAt: string;
}

// Temporary dummy data
const dummyUser: User = {
  id: "1",
  displayName: "John Doe",
  email: "john@example.com",
  phoneNumber: "+880 1234567890",
  profileImage: "/default-avatar.png",
  bio: "Committed to making our community safer.",
  contactInfo: "Available 9 AM - 5 PM",
  verified: true,
  createdAt: "2024-01-01",
};

const dummyReports: CrimeReport[] = [
  {
    id: "1",
    title: "Suspicious Activity in Park",
    location: "Central Park, Dhaka",
    crimeType: "suspicious_activity",
    description: "Observed suspicious behavior near the playground area.",
    date: "2024-02-10",
    status: "verified",
    createdAt: "2024-02-10T14:30:00Z",
  },
  // Add more dummy reports as needed
];

export default function ProfilePage() {
  const [user, setUser] = useState<User>(dummyUser);
  const [reports] = useState<CrimeReport[]>(dummyReports);

  const handleProfileUpdate = (updatedData: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Profile</CardTitle>
              <EditProfileDialog
                user={user}
                onProfileUpdate={handleProfileUpdate}
                trigger={<Button variant="outline" size="sm">Edit Profile</Button>}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32">
                <Image
                  src={user.profileImage}
                  alt={user.displayName}
                  fill
                  className="rounded-full object-cover"
                />
                {user.verified && (
                  <div className="absolute bottom-0 right-0">
                    <Badge variant="default" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Verified
                    </Badge>
                  </div>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">{user.displayName}</h2>
                <p className="text-muted-foreground">Member since {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phoneNumber}</span>
              </div>
              {user.contactInfo && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>{user.contactInfo}</span>
                </div>
              )}
            </div>

            {user.bio && (
              <div className="space-y-2">
                <h3 className="font-medium">About</h3>
                <p className="text-muted-foreground">{user.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reports Section */}
        <div className="md:col-span-2">
          <Tabs defaultValue="reports" className="space-y-4">
            <TabsList>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{report.location}</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          report.status === "verified"
                            ? "default"
                            : report.status === "resolved"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{report.description}</p>
                    <div className="mt-4 text-sm text-muted-foreground">
                      Reported {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">Recent activity will be shown here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
