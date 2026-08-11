import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  Sparkles,
  ShieldCheck,
  Users,
  Target,
  Heart,
  Search,
  Send,
  MessageSquare,
  Bell,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';
import { CtaSection } from '@/components/home/CtaSection';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rentnest.vercel.app';

export const metadata: Metadata = {
  title: 'About Us | RentNest - Modern Real Estate Marketplace',
  description:
    'Learn about RentNest mission, values, and how we are revolutionizing property rentals across Bangladesh with transparent pricing, verified listings, and direct landlord communication.',
  openGraph: {
    title: 'About RentNest - Making Rental Living Simple',
    description:
      'Learn how RentNest connects tenants and landlords directly with verified listings, digital applications, and zero hidden fees.',
    url: `${siteUrl}/about`,
    siteName: 'RentNest',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

const FEATURES = [
  {
    icon: Search,
    title: 'Smart Property Discovery',
    description: 'Filter verified properties by location, rent range, and category with shareable URL filters.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Listings Guarantee',
    description: 'All properties undergo verification to prevent fake photos and misleading descriptions.',
  },
  {
    icon: Send,
    title: 'Digital Applications',
    description: 'Submit rental applications online with preferred move-in dates and direct landlord messages.',
  },
  {
    icon: Users,
    title: 'Role-Based Portals',
    description: 'Tailored dashboards for Tenants, Landlords, and Admins to manage applications and listings.',
  },
  {
    icon: MessageSquare,
    title: 'Ratings & Feedback',
    description: 'Authentic 1–5 star reviews and comments from verified tenants who stayed in the property.',
  },
  {
    icon: Bell,
    title: 'Instant Notifications',
    description: 'Receive real-time alerts when rental applications are submitted, accepted, or updated.',
  },
];

export default function AboutPage() {
  return (
    <main className="flex-1 w-full bg-[#FAFAFA] space-y-16 pb-12">
      {/* ── 1. Hero Section ── */}
      <section className="relative bg-[#1F2937] text-white py-20 px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-gray-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E91E63]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0EA5A4]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-4xl text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-semibold text-[#0EA5A4] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>About RentNest</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Making Rental Living{' '}
            <span className="bg-gradient-to-r from-[#E91E63] via-rose-400 to-[#0EA5A4] bg-clip-text text-transparent">
              Simple
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl mx-auto">
            RentNest is Bangladesh&apos;s digital real estate marketplace designed to connect tenants and landlords directly with complete transparency, zero broker commissions, and verified listings.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#0EA5A4]" />
              <span>Zero Agent Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#E91E63]" />
              <span>Verified Properties</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#0EA5A4]" />
              <span>Direct Landlord Contact</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Our Mission Section ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center rounded-3xl bg-white p-8 sm:p-12 border border-gray-100 shadow-sm">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3.5 py-1 text-xs font-semibold text-[#E91E63]">
              <Target className="h-3.5 w-3.5" />
              <span>Our Purpose</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
              Our Mission
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              Finding a rental home used to mean dealing with unverified photos, hidden broker charges, and uncertain pricing. RentNest was built to transform property renting into a transparent, digital-first experience.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              We empower renters to explore authentic home options across Bangladesh while providing property owners with modern tools to manage listings and tenant applications effortlessly.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-2xl bg-[#FAFAFA] p-4 border border-gray-100">
                <p className="text-2xl font-extrabold text-[#E91E63]">100%</p>
                <p className="text-xs font-bold text-[#1F2937] mt-0.5">Transparent Pricing</p>
                <p className="text-[11px] text-gray-400">No hidden fees or extra commissions</p>
              </div>
              <div className="rounded-2xl bg-[#FAFAFA] p-4 border border-gray-100">
                <p className="text-2xl font-extrabold text-[#0EA5A4]">Direct</p>
                <p className="text-xs font-bold text-[#1F2937] mt-0.5">Landlord Contact</p>
                <p className="text-[11px] text-gray-400">Instant application submission</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 border border-gray-200 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
              alt="RentNest Team & Mission"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <p className="text-white text-xs sm:text-sm font-semibold">
                &ldquo;Transforming home rentals through digital trust and direct communication.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Why RentNest Section ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200/60 px-3.5 py-1 text-xs font-semibold text-[#0EA5A4]">
            <Heart className="h-3.5 w-3.5" />
            <span>Core Values</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
            Why choose RentNest?
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            We put transparency, security, and convenience at the heart of everything we do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white p-8 border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-rose-50 text-[#E91E63] flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="text-lg font-extrabold text-[#1F2937]">Zero Middlemen</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
              Connect directly with verified landlords without paying exorbitant broker fees or dealing with unauthorized third-party agents.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-[#0EA5A4] flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="text-lg font-extrabold text-[#1F2937]">Verified Listings</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
              Every property listing features genuine photos, floor details, amenities, and exact rent breakdowns before you visit.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="text-lg font-extrabold text-[#1F2937]">Seamless Management</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
              Track your applications live, save properties to your personal wishlist, and manage your rental requests through a unified dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. Platform Features Section ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="rounded-3xl bg-white p-8 sm:p-12 border border-gray-100 shadow-sm space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3.5 py-1 text-xs font-semibold text-[#E91E63]">
              <Building2 className="h-3.5 w-3.5" />
              <span>Full Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
              Powerful platform features
            </h2>
            <p className="text-sm text-gray-500 font-normal">
              Designed from the ground up for both prospective tenants and property owners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-2xl bg-[#FAFAFA] p-6 border border-gray-100 space-y-3 hover:border-rose-200 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-white border border-gray-200 text-[#E91E63] flex items-center justify-center shadow-xs">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1F2937]">{feat.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. CTA Section ── */}
      <CtaSection />
    </main>
  );
}
