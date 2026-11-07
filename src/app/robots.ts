import type { MetadataRoute } from "next";
import { business } from "@/content/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${business.siteUrl}/sitemap.xml`,
  };
}
