import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rentnest.vercel.app';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_BASE}/properties/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Property not found');
    const json = await res.json();
    const property = json?.data;

    if (!property) {
      return {
        title: 'Property Details | RentNest',
        description: 'Explore verified rental property details on RentNest.',
      };
    }

    const title = `${property.title || 'Rental Property'} in ${property.location || 'Bangladesh'} | RentNest`;
    const description = `${property.type || 'Property'} for rent in ${property.location || 'Bangladesh'}. Rent: ৳${property.rent || property.price || 0}/month. View photos, amenities, and contact landlord directly on RentNest.`;
    const coverImage = property.coverImage || property.image || '/og-image.png';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${siteUrl}/properties/${id}`,
        siteName: 'RentNest',
        images: [{ url: coverImage, width: 1200, height: 630, alt: property.title }],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [coverImage],
      },
      alternates: {
        canonical: `${siteUrl}/properties/${id}`,
      },
    };
  } catch {
    return {
      title: 'Property Details | RentNest',
      description: 'Explore verified rental property details on RentNest.',
    };
  }
}

export default function PropertyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
