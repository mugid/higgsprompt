"use client";

import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export function Navbar() {
  const { data: session, isPending } = useSession();

  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold font-mono">higgsprompt</h1>
          {!session ? (
            <Button>
              <a href="/login">Log in</a>
            </Button>
          ) : (
            <></>
          )}
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
