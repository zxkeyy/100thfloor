import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    disableStaticImages: false,
    dangerouslyAllowSVG: true,
    remotePatterns: [],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
