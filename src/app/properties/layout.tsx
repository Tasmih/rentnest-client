import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rentnest.vercel.app';

export const metadata: Metadata = {
  title: 'Explore Properties for Rent | RentNest',
  description:
    'Search and filter verified apartments, rooms, hostels, sublets, and seats across Bangladesh with transparent pricing and direct landlord contact.',
  openGraph: {
    title: 'Explore Rental Properties | RentNest',
    description:
      'Search verified flats, rooms, hostels, and sublets across Dhaka and Bangladesh with zero hidden fees.',
    url: `${siteUrl}/properties`,
    siteName: 'RentNest',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${siteUrl}/properties`,
  },
};

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
