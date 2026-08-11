import { MetadataRoute } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rentnest.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Dynamic property routes
  try {
    const res = await fetch(`${API_BASE}/properties?limit=200&page=1`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Failed to fetch properties for sitemap");

    const json = await res.json();
    const rawData = json?.data?.data ?? json?.data ?? (Array.isArray(json) ? json : []);
    const properties: { id: string; updatedAt?: string; createdAt?: string }[] =
      Array.isArray(rawData) ? rawData : [];

    const dynamicRoutes: MetadataRoute.Sitemap = properties.map((property) => ({
      url: `${siteUrl}/properties/${property.id}`,
      lastModified: property.updatedAt
        ? new Date(property.updatedAt)
        : property.createdAt
        ? new Date(property.createdAt)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    // If the API is unavailable during build, return static routes only
    return staticRoutes;
  }
}
