"use client";

import { useSearchParams } from "next/navigation";
import { RegistrationForm } from "@/components/auth/registration-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const userType = searchParams.get('type') as "prompt_engineer" | "company" | null;

  if (!userType || !["prompt_engineer", "company"].includes(userType)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Invalid Registration</CardTitle>
            <CardDescription>
              Please select a valid account type to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <RegistrationForm 
        userType={userType} 
        onBack={() => window.history.back()} 
      />
    </div>
  );
}
