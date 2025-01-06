import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "8.219.11.39", // HTTP 资源的域名
        port: "8080",
        pathname: "/**", // 匹配所有路径
      },
    ],
  },
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
