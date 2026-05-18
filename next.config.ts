import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We vertellen de Next.js Image Optimization Engine welke externe servers veilig zijn
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;