import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  // Asegurar que los assets estáticos se sirvan correctamente
  assetPrefix: process.env.NODE_ENV === "production" ? undefined : "",
  trailingSlash: false,
  // Optimizar para Vercel
  generateEtags: true,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
