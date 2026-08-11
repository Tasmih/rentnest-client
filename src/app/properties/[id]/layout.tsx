import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rentnest.vercel.app";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Server-side dynamic metadata for individual property detail pages.
 * Fetches property data directly from the backend (no axios interceptors needed
 * at the server level — just native fetch with a timeout fallback).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${API_BASE}/properties/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) throw new Error("Property not found");

    const json = await res.json();
    const property = json?.data ?? json;

    const title = property?.title || "Property Details";
    const area = property?.area || property?.address || "Bangladesh";
    const rent = property?.rent ? `৳${Number(property.rent).toLocaleString()}` : "";
    const type = property?.propertyType || "Property";
    const coverImage = property?.coverImage || null;

    const description = [
      `${type} for rent`,
      area && `in ${area}`,
      rent && `at ${rent}/month`,
      "— verified listing on RentNest.",
    ]
      .filter(Boolean)
      .join(" ");

    const ogImages = coverImage
      ? [{ url: coverImage, width: 1200, height: 630, alt: title }]
      : [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: "RentNest" }];

    return {
      title,
      description,
      openGraph: {
        type: "article",
        title: `${title} | RentNest`,
        description,
        url: `${siteUrl}/properties/${id}`,
        images: ogImages,
        siteName: "RentNest",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | RentNest`,
        description,
        images: coverImage ? [coverImage] : [`${siteUrl}/og-image.png`],
      },
      alternates: {
        canonical: `${siteUrl}/properties/${id}`,
      },
    };
  } catch {
    // Graceful fallback metadata if property fetch fails
    return {
      title: "Property Details",
      description: "View rental property details on RentNest.",
      openGraph: {
        title: "Property Details | RentNest",
        description: "View rental property details on RentNest.",
        images: [{ url: `${siteUrl}/og-image.png` }],
      },
    };
  }
}

/**
 * Passthrough layout — exists solely to attach server-side generateMetadata
 * to this route segment while the page itself remains a client component.
 */
export default function PropertyDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
