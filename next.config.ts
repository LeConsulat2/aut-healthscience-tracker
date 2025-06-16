import type { NextConfig } from "next";

const nextConfig = {
  webpack: (config: any) => {
    // Add Promise.withResolvers polyfill
    config.resolve.fallback = {
      ...config.resolve.fallback,
      util: require.resolve("util/"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/"),
    };
    return config;
  },
};

export default nextConfig;