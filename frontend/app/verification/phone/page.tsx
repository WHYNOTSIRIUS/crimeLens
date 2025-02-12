'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import api from '@/lib/axios';

export default function PhoneVerificationPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
 const token = searchParams.get('token');




  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Please enter the verification code",
      });
      return;
    }

    setLoading(true);
      try {
        
        if(!token){
          router.push('/login');
          return;
        }
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
     console.log(token,"token",code,"code")
      await api.post('/auth/verify-phone', { otp: code, token });
      
      toast({
        title: "Phone Verified Successfully",
        description: "Your account is now fully verified",
      });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Phone Verification</CardTitle>
          <CardDescription>
            Enter the verification code sent to {userPhone}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Development mode: Use code <code className="font-mono">123456</code>
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={loading}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify Phone"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 