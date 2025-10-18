"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SelectTypePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectType = async (userType: "prompt_engineer" | "company") => {
    if (!session?.user) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/update-type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userType }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        console.error("Failed to update user type");
      }
    } catch (error) {
      console.error("Error updating user type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in first</h1>
          <p className="text-muted-foreground">You need to be signed in to select your account type.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {session.user.name}!</h1>
          <p className="text-muted-foreground">
            Please select your account type to continue
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Prompt Engineer Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <CardTitle className="text-xl">Prompt Engineer</CardTitle>
              <CardDescription>
                Create and share AI prompts, earn points, and build your reputation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">Earn Points</Badge>
                  <span className="text-muted-foreground">Get rewarded for quality prompts</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">Portfolio</Badge>
                  <span className="text-muted-foreground">Build your prompt collection</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">Community</Badge>
                  <span className="text-muted-foreground">Connect with other engineers</span>
                </div>
              </div>
              <Button 
                onClick={() => handleSelectType("prompt_engineer")}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Setting up..." : "I am a Prompt Engineer"}
              </Button>
            </CardContent>
          </Card>

          {/* Company Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <CardTitle className="text-xl">Company</CardTitle>
              <CardDescription>
                Hire prompt engineers, post projects, and find the best AI talent.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">Hire Talent</Badge>
                  <span className="text-muted-foreground">Find skilled prompt engineers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">Post Projects</Badge>
                  <span className="text-muted-foreground">Share your AI challenges</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">Enterprise</Badge>
                  <span className="text-muted-foreground">Scale your AI operations</span>
                </div>
              </div>
              <Button 
                onClick={() => handleSelectType("company")}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? "Setting up..." : "I am a Company"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
