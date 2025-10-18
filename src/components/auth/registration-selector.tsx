"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RegistrationSelectorProps {
  onSelectUserType: (userType: "prompt_engineer" | "company") => void;
}

export function RegistrationSelector({ onSelectUserType }: RegistrationSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Account Type</h2>
        <p className="text-muted-foreground">
          Select the type of account that best describes you
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
              Create and share AI prompts, earn points, and build your reputation in the community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">Earn Points</Badge>
                <span className="text-muted-foreground">Get rewarded for quality prompts</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">Community</Badge>
                <span className="text-muted-foreground">Connect with other engineers</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">Portfolio</Badge>
                <span className="text-muted-foreground">Build your prompt collection</span>
              </div>
            </div>
            <Button 
              onClick={() => onSelectUserType("prompt_engineer")}
              className="w-full mt-4"
            >
              I am a Prompt Engineer
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
              Hire prompt engineers, post projects, and find the best AI talent for your needs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
              onClick={() => onSelectUserType("company")}
              variant="outline"
              className="w-full mt-4"
            >
              I am a Company
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
