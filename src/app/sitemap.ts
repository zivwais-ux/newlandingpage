import type { MetadataRoute } from "next";
import { business } from "@/content/site";

export const dynamic = "force-static";

// מפת האתר לגוגל: דף הבית והמסמכים.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${business.siteUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${business.siteUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${business.siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${business.siteUrl}/accessibility`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
