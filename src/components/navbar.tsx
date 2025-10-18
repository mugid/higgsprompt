import { UserProfile } from "@/components/auth/user-profile";

export function Navbar() {
  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold">
            higgsprompt
          </h1>
          <UserProfile />
        </div>
      </div>
    </header>
  )
}