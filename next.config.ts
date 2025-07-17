import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'img.clerk.com',
      'utfs.io',
      // add other allowed domains here if needed
    ],
  },
  serverExternalPackages: ["uploadthing"],
  async headers() {
    return [
      {
        source: "/api/uploadthing",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
