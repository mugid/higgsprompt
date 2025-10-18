"use client";

import { useState, useEffect } from "react";
import { useUserWithFields } from "@/lib/use-user-with-fields";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Post {
  id: string;
  title: string;
  description: string;
  type: string;
  images: string[];
  published: boolean;
  createdAt: string;
}

export function Dashboard() {
  const { data: user, isPending: userLoading } = useUserWithFields();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ 
    title: "", 
    description: "", 
    type: "image" as "image" | "video",
    images: [] as string[]
  });

  // Debug: Log user data
  console.log("User data:", user);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.description.trim()) return;

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        setNewPost({ title: "", description: "", type: "image", images: [] });
        fetchPosts();
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || user?.email}!
          </h2>
          <p className="text-muted-foreground">
            Manage your posts and content from your dashboard.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={user?.userType === "company" ? "outline" : "default"}>
            {user?.userType === "prompt_engineer" ? "Prompt Engineer" : "Company"}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <span className="w-2 h-2 bg-primary rounded-full" />
            {user?.points || 0} points
          </Badge>
        </div>
      </div>

          {/* Create Post Form - Only for Companies */}
          {user?.userType === "company" && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Battle</CardTitle>
                <CardDescription>
                  Create a new prompt engineering battle for the community to solve.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={createPost} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Battle Title</Label>
                    <Input
                      id="title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Enter battle title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Battle Description</Label>
                    <Textarea
                      id="description"
                      value={newPost.description}
                      onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                      placeholder="Describe the prompt engineering challenge..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Battle Type</Label>
                    <select
                      id="type"
                      value={newPost.type}
                      onChange={(e) => setNewPost({ ...newPost, type: e.target.value as "image" | "video" })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="image">Image-based Battle</option>
                      <option value="video">Video-based Battle</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full">
                    Create Battle
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Profile Section - Only for Prompt Engineers */}
          {user?.userType === "prompt_engineer" && (
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  Manage your prompt engineering profile and showcase your skills.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                      <AvatarFallback>
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        Prompt Engineer
                      </Badge>
                      </div>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{user.points || 0}</div>
                      <div className="text-sm text-muted-foreground">Points Earned</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{posts.length}</div>
                      <div className="text-sm text-muted-foreground">Battles Participated</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Quick Actions</h4>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <a href="/battles">Explore Battles</a>
                      </Button>
                      <Button asChild variant="outline" className="flex-1">
                        <a href="/leaders">View Leaders</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {user?.userType === "company" ? "Created by you" : "Contributed to"}
          </CardTitle>
          <CardDescription>
            {user?.userType === "company" 
              ? "Manage and view all the battles you've created."
              : "View your contributions."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading posts...
            </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {user?.userType === "company" 
                    ? "No battles created yet. Create your first battle above!"
                    : "No battles participated yet. Check out the battles page to get started!"
                  }
                </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="p-4">
                  <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="text-lg font-medium">{post.title}</h4>
                          <p className="text-muted-foreground">{post.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{post.type === "image" ? "Image Prompt" : "Video Prompt"}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
