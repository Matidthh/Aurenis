import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aurenis.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/select-school", "/lpmm", "/prototipo-figma"],
      disallow: ["/api/", "/dashboard/", "/system/", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

