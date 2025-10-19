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
import { UploadButton } from "@/components/uploadthing-provider";
import { X } from "lucide-react";

interface Post {
  id: string;
  title: string;
  description: string;
  type: string;
  images: string[];
  ideas?: string;
  companyWords?: string;
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
    images: [] as string[],
    ideas: "",
    companyWords: ""
  });
  const [generatingIdeas, setGeneratingIdeas] = useState(false);

  // Debug: Log user data

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

  const generateIdeas = async () => {
    if (!newPost.title.trim() || !newPost.description.trim()) return;

    setGeneratingIdeas(true);
    try {
      const response = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: {
            name: newPost.title,
            description: newPost.description,
          },
          company_words: newPost.companyWords || "",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewPost(prev => ({ ...prev, ideas: data.ideas }));
      }
    } catch (error) {
      console.error("Failed to generate ideas:", error);
    } finally {
      setGeneratingIdeas(false);
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
        setNewPost({ title: "", description: "", type: "image", images: [], ideas: "", companyWords: "" });
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
                    <Label htmlFor="title">Product Name</Label>
                    <Input
                      id="title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Product Description</Label>
                    <Textarea
                      id="description"
                      value={newPost.description}
                      onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                      placeholder="Describe the your product..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyWords">Your suggestions (Optional)</Label>
                    <Input
                      id="companyWords"
                      value={newPost.companyWords}
                      onChange={(e) => setNewPost({ ...newPost, companyWords: e.target.value })}
                      placeholder="What do you want to see in the advertisement?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ideas">Ideas (Optional)</Label>
                    <div className="space-y-2">
                      <Textarea
                        id="ideas"
                        value={newPost.ideas}
                        onChange={(e) => setNewPost({ ...newPost, ideas: e.target.value })}
                        placeholder="AI-generated ideas will appear here..."
                        rows={4}
                      />
                      <Button
                        type="button"
                        onClick={generateIdeas}
                        disabled={!newPost.title.trim() || !newPost.description.trim() || generatingIdeas}
                        className="w-full"
                      >
                        {generatingIdeas ? "Generating Ideas..." : "Generate Ideas"}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Advertisement Type</Label>
                    <select
                      id="type"
                      value={newPost.type}
                      onChange={(e) => setNewPost({ ...newPost, type: e.target.value as "image" | "video" })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="image">Image Generation</option>
                      <option value="video">Video Generation</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Competition Images</Label>
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            if (res) {
                              const urls = res.map(file => file.url);
                              setNewPost(prev => ({
                                ...prev,
                                images: [...prev.images, ...urls]
                              }));
                            }
                          }}
                          onUploadError={(error) => {
                            console.error("Upload error:", error);
                          }}
                          className="w-full h-auto bg-transparent hover:bg-muted/50 border-0 text-muted-foreground hover:text-foreground transition-colors"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          Click to upload or drag and drop images here
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          PNG, JPG, GIF up to 4MB each
                        </p>
                      </div>
                      
                      {newPost.images.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Uploaded Images ({newPost.images.length})</p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setNewPost(prev => ({ ...prev, images: [] }))}
                              className="text-xs"
                            >
                              Clear All
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {newPost.images.map((image, index) => (
                              <div key={index} className="relative group bg-muted rounded-lg overflow-hidden">
                                <div className="aspect-video relative">
                                  <img
                                    src={image}
                                    alt={`Competition image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-90 group-hover:scale-100"
                                    onClick={() => {
                                      setNewPost(prev => ({
                                        ...prev,
                                        images: prev.images.filter((_, i) => i !== index)
                                      }));
                                    }}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                                <div className="p-2">
                                  <p className="text-xs text-muted-foreground truncate">
                                    Image {index + 1}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Create Competition
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
                  <div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{user.points || 0}</div>
                      <div className="text-sm text-muted-foreground">Points Earned</div>
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
