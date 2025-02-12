"use client";

import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";

export default function EmailVerificationPage() {
  return (
    <div className="container max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email address.
            Please click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Once verified, you'll be prompted to verify your phone number.
          </p>
        </CardContent>
      </Card>
    </div>
  );    
} 