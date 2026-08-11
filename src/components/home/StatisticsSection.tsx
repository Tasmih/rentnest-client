'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, ShieldCheck, MapPin } from 'lucide-react';

interface StatItem {
  value: string;
  label: string;
  subText: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface StatisticsProps {
  stats?: StatItem[];
}

const DEFAULT_STATS: StatItem[] = [
  {
    value: '100+',
    label: 'Properties Listed',
    subText: 'Verified rental homes across major cities',
    icon: Building2,
  },
  {
    value: '50+',
    label: 'Happy Tenants',
    subText: 'Successful applications & smooth move-ins',
    icon: Users,
  },
  {
    value: '30+',
    label: 'Trusted Landlords',
    subText: 'Vetted property owners and managers',
    icon: ShieldCheck,
  },
  {
    value: '10+',
    label: 'Locations',
    subText: 'Popular residential areas and neighborhoods',
    icon: MapPin,
  },
];

export function StatisticsSection({ stats = DEFAULT_STATS }: StatisticsProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-12 bg-[#1F2937] text-white relative overflow-hidden">
      {/* Subtle Glow Overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E91E63]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0EA5A4]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0EA5A4]">
            Marketplace Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            RentNest by the numbers
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 font-normal">
            Empowering tenants and landlords with a transparent rental marketplace.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md text-center space-y-3 hover:bg-white/10 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-[#E91E63]/20 border border-[#E91E63]/30 flex items-center justify-center mx-auto text-[#E91E63]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs font-bold text-gray-200 mt-1">{stat.label}</p>
                </div>
                <p className="text-[11px] text-gray-400 font-normal">{stat.subText}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
