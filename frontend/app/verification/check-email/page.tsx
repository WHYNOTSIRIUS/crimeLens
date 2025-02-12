"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="container max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12" />
          </div>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to your email address.
            Please click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Once verified, you&apos;ll be prompted to verify your phone number.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 