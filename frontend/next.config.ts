import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "http",
        hostname: "sportsync-backend-8gbr.onrender.com",
        port: "",
        pathname: "/backend/team_logos/**"
      }
    ]
  }
}

export default nextConfig;
