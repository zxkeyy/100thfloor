import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    disableStaticImages: false,
    dangerouslyAllowSVG: true,
    remotePatterns: [],
  },
};

export default nextConfig;
