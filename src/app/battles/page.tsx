"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowDown, ArrowUp} from "lucide-react";

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
  };
}

export default function BattlesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const router = useRouter();

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

  const filteredAndSortedPosts = posts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "title") {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return sortOrder === "asc"
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      }
      return 0;
    });

  const handlePostClick = (postId: string) => {
    router.push(`/battles/${postId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading battles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Competitions</h1>
            <p className="text-muted-foreground text-lg">
              Discover and engage with the best prompt engineering battles
            </p>
          </div>

          {/* Search and Sort */}
          <Card>
            <CardHeader>
              <CardTitle>Explore Competitions</CardTitle>
              <CardDescription>
                Find the most interesting prompt engineering challenges and
                solutions and earn points/money
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search battles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "date" | "title")
                    }
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="title">Sort by Title</option>
                  </select>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="flex items-center gap-1"
                  >
                    {sortOrder === "asc" ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    {sortOrder === "asc" ? "Ascending" : "Descending"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Grid */}
          {filteredAndSortedPosts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "No battles found matching your search."
                    : "No battles available yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredAndSortedPosts.map((post) => (
                <Card
                  key={post.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handlePostClick(post.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge>
                          {post.type === "image"
                            ? "Image Prompt"
                            : "Video Prompt"}
                        </Badge>
                        <Badge variant="outline">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span>by {post.author.name}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <p className="text-muted-foreground line-clamp-3">
                          {post.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
