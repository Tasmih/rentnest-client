'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MessageCircle, Home, Sparkles } from 'lucide-react';

interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

const FEATURES: FeatureCard[] = [
  {
    icon: ShieldCheck,
    title: 'Verified Listings',
    description: 'Browse genuine rental properties from trusted landlords.',
    iconBg: 'bg-rose-50 border-rose-100',
    iconColor: 'text-[#E91E63]',
  },
  {
    icon: MessageCircle,
    title: 'Direct Communication',
    description: 'Connect easily with landlords and manage rental requests.',
    iconBg: 'bg-teal-50 border-teal-100',
    iconColor: 'text-[#0EA5A4]',
  },
  {
    icon: Home,
    title: 'Better Living Choices',
    description: 'Find properties that match your lifestyle and budget.',
    iconBg: 'bg-amber-50 border-amber-100',
    iconColor: 'text-amber-600',
  },
];

export function TrustedExperienceSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-12 bg-[#FAFAFA] border-t border-gray-100">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3.5 py-1 text-xs font-semibold text-[#E91E63]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Trusted Rental Experience</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight leading-tight">
              A smarter way to rent your next home
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
              RentNest connects tenants with verified properties and trusted landlords through a simple and transparent rental experience.
            </p>
          </motion.div>

          {/* Right Column: 3 Compact Feature Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4">
            {FEATURES.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 space-y-3"
                >
                  <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${feat.iconBg}`}>
                    <Icon className={`h-5 w-5 ${feat.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#1F2937]">{feat.title}</h3>
                    <p className="text-xs text-gray-500 font-normal leading-relaxed mt-1">
                      {feat.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Alias for backwards compatibility if needed
export { TrustedExperienceSection as CtaSection };
