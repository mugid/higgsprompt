"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, User, Bot } from "lucide-react";
import { SolutionForm } from "./solution-form";
import { useUserWithFields } from "@/lib/use-user-with-fields";

interface Solution {
  id: string;
  text: string;
  modelName: string;
  mediaContent: string[];
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    userType: string;
    points: number;
  };
}

interface SolutionsSectionProps {
  postId: string;
}

export function SolutionsSection({ postId }: SolutionsSectionProps) {
  const { data: user } = useUserWithFields();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSolutions();
  }, [postId]);

  const fetchSolutions = async () => {
    try {
      const response = await fetch(`/api/solutions?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setSolutions(data);
      }
    } catch (error) {
      console.error("Failed to fetch solutions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSolutionSubmit = async (solution: {
    text: string;
    modelName: string;
    mediaContent: string[];
  }) => {
    try {
      const response = await fetch("/api/solutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...solution,
          postId,
        }),
      });

      if (response.ok) {
        fetchSolutions(); // Refresh solutions
      }
    } catch (error) {
      console.error("Failed to submit solution:", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading solutions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Solutions Header */}
      <Card>
        <CardHeader>
          <CardTitle>Community Solutions</CardTitle>
          <CardDescription>
            {solutions.length} solution{solutions.length !== 1 ? 's' : ''} submitted by the community
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Solution Form - Only for Prompt Engineers */}
      {user?.userType === "prompt_engineer" && (
        <SolutionForm postId={postId} onSolutionSubmit={handleSolutionSubmit} />
      )}

      {/* Solutions List */}
      {solutions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              {user?.userType === "prompt_engineer" 
                ? "No solutions yet. Be the first to submit a solution!"
                : "No solutions submitted yet."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {solutions.map((solution) => (
            <Card key={solution.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={solution.author.image || ""} alt={solution.author.name} />
                      <AvatarFallback>
                        {solution.author.name?.charAt(0) || solution.author.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{solution.author.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Bot className="w-4 h-4" />
                        <span>{solution.modelName}</span>
                        <span>•</span>
                        <Clock className="w-4 h-4" />
                        <span>{new Date(solution.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {solution.author.userType === "prompt_engineer" ? "Engineer" : "Company"}
                    </Badge>
                    <Badge variant="secondary">
                      {solution.author.points} points
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="whitespace-pre-wrap">{solution.text}</p>
                  
                  {solution.mediaContent.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Media Content:</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {solution.mediaContent.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Solution media ${index + 1}`}
                              className="w-full h-32 object-cover rounded border"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
