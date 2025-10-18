"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Award } from "lucide-react";

interface Leader {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  points: number;
  userType: string;
  createdAt: string;
}

export default function LeadersPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const response = await fetch("/api/leaders");
      if (response.ok) {
        const data = await response.json();
        setLeaders(data);
      }
    } catch (error) {
      console.error("Failed to fetch leaders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <Badge className="bg-yellow-500 text-white">#1</Badge>;
      case 1:
        return <Badge className="bg-gray-400 text-white">#2</Badge>;
      case 2:
        return <Badge className="bg-amber-600 text-white">#3</Badge>;
      default:
        return <Badge variant="secondary">#{index + 1}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading leaders...</p>
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
          <h1 className="text-4xl font-bold">🏆 Leaders Board</h1>
          <p className="text-muted-foreground text-lg">
            Top prompt engineers ranked by their points and contributions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Top Prompt Engineers
            </CardTitle>
            <CardDescription>
              Ranked by points earned through quality prompts and community contributions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leaders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No leaders found. Be the first to earn points!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Engineer</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Member Since</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaders.map((leader, index) => (
                    <TableRow key={leader.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getRankIcon(index)}
                          {getRankBadge(index)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={leader.image || ""} alt={leader.name} />
                            <AvatarFallback>
                              {leader.name?.charAt(0) || leader.email?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{leader.name}</p>
                            <p className="text-sm text-muted-foreground">{leader.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">{leader.points}</span>
                          <span className="text-sm text-muted-foreground">points</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(leader.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {leaders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>How Points Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">Quality Prompts</h4>
                  <p className="text-muted-foreground">
                    Earn points for creating high-quality, useful prompts that help the community.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Community Engagement</h4>
                  <p className="text-muted-foreground">
                    Get rewarded for helping others and contributing to discussions.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Innovation</h4>
                  <p className="text-muted-foreground">
                    Bonus points for creative and innovative prompt engineering techniques.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </div>
  );
}
