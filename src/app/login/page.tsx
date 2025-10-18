import { AuthGuard } from "@/components/auth/auth-guard";
import { Dashboard } from "@/components/dashboard";
import { RegistrationFlow } from "@/components/auth/registration-flow";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AuthGuard
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <RegistrationFlow />
            </div>
          }
        >
          <Dashboard />
        </AuthGuard>
      </main>
    </div>
  );
}
