import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Extra origins that may talk to the dev server (HMR / assets) from phones
  allowedDevOrigins: ["192.168.1.29", "10.5.0.2", "localhost"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
