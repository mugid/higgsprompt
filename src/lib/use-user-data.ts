"use client";

import { useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  userType?: string;
  points?: number;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function useUserData() {
  const { data: session, isPending } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [session?.user?.id]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data: userData,
    isPending: isPending || loading,
    refetch: fetchUserData,
  };
}
