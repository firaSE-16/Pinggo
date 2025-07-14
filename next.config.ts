import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  image:{
    domains:['utfs.io']
  },
  experimental: {
    serverComponentsExternalPackages: ["uploadthing"],
  },
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
