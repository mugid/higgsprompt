"use client";

import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import  Link from "next/link";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center md:gap-4 gap-2">
            <Link href="/" className="md:text-xl text-md font-semibold font-mono">
              higgsprompt
            </Link>

            <Link
              href="/leaders"
              className="md:text-sm text-xs text-muted-foreground hover:text-foreground"
            >
              Leaders
            </Link>
            <Link
              href="/battles"
              className="md:text-sm text-xs text-muted-foreground hover:text-foreground"
            >
              Battles
            </Link>
            <Link
              href="/dashboard"
              className="md:text-sm text-xs text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
          </div>

          {!session ? (
            <Button>
              <Link href="/login">Log in</Link>
            </Button>
          ) : (
            <UserProfile />
          )}
        </div>
      </div>
    </header>
  );
}
