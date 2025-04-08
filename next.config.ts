import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // disablesd ESLint checks during the build because it was annoying
  },
};

export default nextConfig;
