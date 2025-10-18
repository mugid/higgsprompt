"use client";

import { useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";

interface UserWithFields {
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

export function useUserWithFields() {
  const { data: session, isPending } = useSession();
  const [userWithFields, setUserWithFields] = useState<UserWithFields | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchUserWithFields();
    } else {
      setUserWithFields(null);
      setLoading(false);
    }
  }, [session?.user?.id]);

  const fetchUserWithFields = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const userData = await response.json();
        setUserWithFields(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data: userWithFields,
    isPending: isPending || loading,
    refetch: fetchUserWithFields,
  };
}
