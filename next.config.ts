import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const buildId = process.env.BUILD_ID || process.env.NEXT_PUBLIC_BUILD_ID || "aurenis-build-v1";

export default function (phase: string): NextConfig {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    output: isDev ? undefined : "standalone",
    reactStrictMode: true,
    devIndicators: false,
    allowedDevOrigins: [
      "*.run.app",
      "*.aistudio.google.com",
      "localhost:3000",
      "127.0.0.1:3000",
    ],
    transpilePackages: ["motion"],
    eslint: {
      ignoreDuringBuilds: true,
    },
    env: {
      NEXT_PUBLIC_BUILD_ID: buildId,
    },
    generateBuildId: async () => {
      return buildId;
    },
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
            {
              key: "Content-Security-Policy",
              value: [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: https: blob:",
                "font-src 'self' data: https:",
                "connect-src 'self' https: wss:",
                "frame-ancestors 'self' https://ai.studio https://*.google.com https://*.googleusercontent.com https://*.run.app https://*.aistudio.google.com",
                "form-action 'self'",
                "base-uri 'self'",
                "object-src 'none'",
              ].join("; "),
            },
          ],
        },
        {
          source: "/_next/static/:path*",
          headers: [
            { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          ],
        },
        {
          source: "/api/:path*",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: process.env.FRONTEND_URL || "http://localhost:5173" },
            { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
            { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Client-Version, X-Tenant-Id, Authorization" },
          ],
        },
      ];
    },
  };
}

