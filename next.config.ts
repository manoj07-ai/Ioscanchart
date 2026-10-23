import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow sharp for image optimization
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
};

export default nextConfig;
