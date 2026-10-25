import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ais-dev-4mfjtpundvddavjyfs2o6y-344169282725.us-east1.run.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/select-school", "/lpmm", "/prototipo-figma"],
      disallow: ["/api/", "/dashboard/", "/system/", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
