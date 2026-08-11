import { HomeHeroSection } from "@/components/home";
import { FeaturedProperties } from "@/components/property/FeaturedProperties";

export default function Home() {
  return (
    <main className="flex-1 space-y-4">
      <HomeHeroSection />
      <FeaturedProperties />
    </main>
  );
}
