"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, Bot, Heart, X, ZoomIn } from "lucide-react";
import { SolutionForm } from "./solution-form";
import { useUserWithFields } from "@/lib/use-user-with-fields";

interface Solution {
  id: string;
  text: string;
  modelName: string;
  mediaContent: string[];
  likes: number;
  isLiked: boolean;
  canLike: boolean;
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
  postType: "image" | "video";
}

export function SolutionsSection({ postId, postType }: SolutionsSectionProps) {
  const { data: user } = useUserWithFields();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
            // Refresh solutions immediately
            await fetchSolutions();
            // Also trigger a re-render by updating state
            setSolutions(prev => [...prev]);
          }
        } catch (error) {
          console.error("Failed to submit solution:", error);
        }
      };

  const handleLike = async (solutionId: string, isLiked: boolean) => {
    try {
      const response = await fetch(`/api/solutions/${solutionId}/like`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Update the solution in the local state
        setSolutions(prev => 
          prev.map(solution => 
            solution.id === solutionId 
              ? { 
                  ...solution, 
                  isLiked: !isLiked, 
                  likes: isLiked ? solution.likes - 1 : solution.likes + 1 
                }
              : solution
          )
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
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
        <SolutionForm postId={postId} postType={postType} onSolutionSubmit={handleSolutionSubmit} />
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
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                    {new Date(solution.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="whitespace-pre-wrap">{solution.text}</p>
                  
                  {solution.mediaContent.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-muted-foreground">Generated Media:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {solution.mediaContent.map((url, index) => (
                          <div key={index} className="relative group">
                            {url.includes('.mp4') || url.includes('video') || solution.modelName.includes('video') ? (
                              <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
                                <video
                                  src={url}
                                  controls
                                  className="w-full h-64 sm:h-56 lg:h-64 object-cover"
                                  preload="metadata"
                                  poster=""
                                >
                                  Your browser does not support the video tag.
                                </video>
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  Video
                                </div>
                              </div>
                            ) : (
                              <div className="relative bg-muted rounded-lg overflow-hidden shadow-lg cursor-pointer">
                                <img
                                  src={url}
                                  alt={`Generated image ${index + 1}`}
                                  className="w-full h-64 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                  onClick={() => setSelectedImage(url)}
                                />
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  Image
                                </div>
                                <div className="absolute top-2 left-2 bg-black/70 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <ZoomIn className="w-3 h-3" />
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Like Button - Only show for post creators */}
                  {solution.canLike && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(solution.id, solution.isLiked)}
                        className={`flex items-center gap-2 ${
                          solution.isLiked 
                            ? "text-red-500 hover:text-red-600" 
                            : "text-muted-foreground hover:text-red-500"
                        }`}
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            solution.isLiked ? "fill-current" : ""
                          }`} 
                        />
                        <span>{solution.likes}</span>
                      </Button>
                    </div>
                  )}
                  
                  {/* Show likes count for everyone, but only show like button for post creators */}
                  {!solution.canLike && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Heart className="w-4 h-4" />
                        <span>{solution.likes} likes</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )          )}
        </div>
      )}

      {/* Full-screen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <img
              src={selectedImage}
              alt="Full size image"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
