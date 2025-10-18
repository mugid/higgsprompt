"use client";

import { useSession } from "@/lib/auth-client";
import { LoginButton } from "./login-button";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Please sign in to continue
          </h1>
          <LoginButton />
        </div>
      )
    );
  }

  return <>{children}</>;
}
