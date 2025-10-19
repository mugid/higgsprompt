
import { HeroSection } from "@/components/hero-section";
import { CoolTextSection } from "@/components/cool-text-section";
import { ReviewSection } from "@/components/review-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <CoolTextSection />
        <ReviewSection />
      </main>
    </div>
  );
}