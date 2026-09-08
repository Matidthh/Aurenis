import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: process.env.VERCEL ? undefined : "standalone",
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
