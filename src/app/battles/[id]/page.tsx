"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Clock, User, MessageCircle, ThumbsUp, Share } from "lucide-react";
import { SolutionsSection } from "@/components/solutions-section";

interface Post {
  id: string;
  title: string;
  description: string;
  type: string;
  images: string[];
  published: boolean;
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

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string);
    }
  }, [params.id]);

  const fetchPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        console.error("Failed to fetch post");
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading battle...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Battle Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The battle you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => router.push("/battles")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Battles
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/battles")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Battles
        </Button>

        {/* Post Content */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl">{post.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? "Published" : "Draft"}
                </Badge>
                <Badge variant="outline">
                  {post.author.userType === "prompt_engineer" ? "Engineer" : "Company"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap text-base leading-relaxed">
                {post.description}
              </div>
            </div>
            
            {post.images && post.images.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Battle Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Battle image ${index + 1}`}
                      className="w-full h-48 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Author Info */}
        <Card>
          <CardHeader>
            <CardTitle>About the Author</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={post.author.image || ""} alt={post.author.name} />
                <AvatarFallback>
                  {post.author.name?.charAt(0) || post.author.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{post.author.name}</h3>
                <p className="text-muted-foreground">{post.author.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    {post.author.points} points
                  </Badge>
                  <Badge variant="secondary">
                    {post.author.userType === "prompt_engineer" ? "Prompt Engineer" : "Company"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solutions Section */}
        <SolutionsSection postId={post.id} />
        </div>
      </div>
    </div>
  );
}
