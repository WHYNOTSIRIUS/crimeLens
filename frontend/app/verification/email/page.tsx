"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';

export default function EmailVerificationPage() {
  const [status, setStatus] = useState<'verifying' | 'verified' | 'failed'>('verifying');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          throw new Error('Verification token is missing');
        }

        await api.get(`/auth/verify-email/${token}`);
        
        toast({
          title: "Email Verified Successfully",
          description: "Please proceed with phone verification",
        });

        setStatus('verified');
        
        // Automatically redirect to phone verification after a short delay
        setTimeout(() => {
          router.push(`/verification/phone?token=${token}`);
        }, 2000);

      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: error.response?.data?.message || "Something went wrong",
        });
        setStatus('failed');
      }
    };

    verifyEmail();
  }, [searchParams, toast, router]);

  return (
    <div className="container max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {status === 'verifying' && 'Verifying your email address...'}
            {status === 'verified' && 'Email verified successfully!'}
            {status === 'failed' && 'Email verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'verifying' && (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          
          {status === 'verified' && (
            <div className="text-center space-y-4">
              <p className="text-green-600">
                Your email has been verified successfully!
              </p>
              <p>
                Redirecting to phone verification...
              </p>
            </div>
          )}
          
          {status === 'failed' && (
            <div className="text-center space-y-4">
              <p className="text-red-600">
                Failed to verify your email. Please try again or contact support.
              </p>
              <Button onClick={() => router.push('/register')}>
                Back to Registration
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 