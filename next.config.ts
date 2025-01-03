import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/dev/:path*",
        destination: "http://47.237.106.59:8083/:path*",
      },
    ];
  },
};

export default nextConfig;
