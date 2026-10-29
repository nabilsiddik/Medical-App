export const dynamic = "force-dynamic";

import { MetadataRoute } from "next";
import { getServices } from "@/services/doctor/clinicServices";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://drsarahrahman.com";
  const lastModified = new Date();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/book`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/services`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic service detail routes
  try {
    const services = await getServices();
    if (Array.isArray(services)) {
      const serviceRoutes: MetadataRoute.Sitemap = services
        .filter((s: any) => s.slug && s.isActive !== false)
        .map((s: any) => ({
          url: `${siteUrl}/services/${s.slug}`,
          lastModified: s.updatedAt ? new Date(s.updatedAt) : lastModified,
          changeFrequency: "weekly",
          priority: 0.85,
        }));
      return [...staticRoutes, ...serviceRoutes];
    }
  } catch (error) {
    console.error("Failed to fetch dynamic routes for sitemap:", error);
  }

  return staticRoutes;
}
