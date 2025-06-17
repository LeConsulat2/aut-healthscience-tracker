import type { NextConfig } from "next";

// next.config.js
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  telemetry: false,
};

module.exports = nextConfig;