import React from 'react';
import {
  HomeHeroSection,
  WhyChooseSection,
  HowItWorksSection,
  CategoriesSection,
  StatisticsSection,
  TestimonialsSection,
  TrustedExperienceSection,
} from '@/components/home';
import { FeaturedProperties } from '@/components/property/FeaturedProperties';

export default function Home() {
  return (
    <main className="flex-1 w-full space-y-0">
      {/* 1. Hero Section */}
      <HomeHeroSection />

      {/* 2. Featured Properties */}
      <FeaturedProperties />

      {/* 3. Why Choose RentNest Section */}
      <WhyChooseSection />

      {/* 4. How It Works Section */}
      <HowItWorksSection />

      {/* 5. Property Categories Section */}
      <CategoriesSection />

      {/* 6. Statistics Section */}
      <StatisticsSection />

      {/* 7. Testimonials Section */}
      <TestimonialsSection />

      {/* 8. Trusted Rental Experience Section */}
      <TrustedExperienceSection />
    </main>
  );
}
