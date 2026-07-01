import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "images.unsplash.com",
    }, {
      protocol: 'https',
      hostname: 'fbhlqtaywmzkbppxvgvm.supabase.co',
      port: '',
      pathname: '/storage/v1/object/public/**',
    }]
  }

};

export default nextConfig;
