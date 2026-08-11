import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rentnest.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'RentNest - Find Your Perfect Rental Home',
    template: '%s | RentNest',
  },
  description:
    'RentNest helps tenants discover verified rental properties and connects landlords with trusted renters across Bangladesh.',
  keywords: [
    'rental property',
    'apartment rent',
    'house rent Bangladesh',
    'flat rent',
    'property marketplace',
    'RentNest',
    'verified rentals',
    'rent house Dhaka',
  ],
  authors: [{ name: 'RentNest Team' }],
  creator: 'RentNest',
  publisher: 'RentNest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'RentNest',
    title: 'RentNest - Find Your Perfect Rental Home',
    description:
      'RentNest helps tenants discover verified rental properties and connects landlords with trusted renters across Bangladesh.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RentNest Real Estate Rental Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RentNest - Find Your Perfect Rental Home',
    description:
      'RentNest helps tenants discover verified rental properties and connects landlords with trusted renters across Bangladesh.',
    images: ['/og-image.png'],
    creator: '@rentnest',
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col antialiased bg-[#FAFAFA]">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
