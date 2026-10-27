import type { NextConfig } from "next";

const apiOrigin =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://vac-server.vercel.app");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/health",
        destination: `${apiOrigin}/health`,
      },
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
