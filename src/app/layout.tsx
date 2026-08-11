import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rentnest.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RentNest - Find Your Perfect Rental Home",
    template: "%s | RentNest",
  },
  description:
    "Discover verified rental apartments, rooms and properties across Bangladesh. Browse flats, rooms, hostels, sublets and seats with transparent pricing and direct landlord contact.",
  keywords: [
    "rental properties Bangladesh",
    "apartment for rent Dhaka",
    "flat for rent",
    "room for rent",
    "hostel Bangladesh",
    "sublet Dhaka",
    "RentNest",
    "verified rentals",
    "property search Bangladesh",
  ],
  authors: [{ name: "RentNest" }],
  creator: "RentNest",
  publisher: "RentNest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "RentNest",
    title: "RentNest - Find Your Perfect Rental Home",
    description:
      "Discover verified rental apartments, rooms and properties across Bangladesh with transparent pricing and direct landlord contact.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RentNest - Find Your Perfect Rental Home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RentNest - Find Your Perfect Rental Home",
    description:
      "Discover verified rental apartments, rooms and properties across Bangladesh.",
    images: ["/og-image.png"],
    creator: "@rentnest",
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
        </Providers>
      </body>
    </html>
  );
}
