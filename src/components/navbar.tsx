"use client";

import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="text-xl font-semibold font-mono">higgsprompt</a>
          <div className="flex items-center gap-2">
            <a href="/leaders" className="text-sm text-muted-foreground hover:text-foreground">Leaders</a>
            <a href="/battles" className="text-sm text-muted-foreground hover:text-foreground">Battles</a>
            <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</a>
          </div>
          {!session ? (
            <Button>
              <a href="/login">Log in</a>
            </Button>
          ) : (
            <UserProfile />
          )}
        </div>
      </div>
    </header>
  );
}
