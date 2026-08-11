import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rentnest.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/properties", "/properties/"],
        disallow: [
          "/dashboard/",
          "/api/",
          "/login",
          "/register",
        ],
      },
      {
        // Prevent AI crawlers from indexing private data
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "anthropic-ai"],
        disallow: ["/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
