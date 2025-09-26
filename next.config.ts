import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@browserbasehq/stagehand', 'playwright'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude problematic packages from webpack bundling
      config.externals.push('@browserbasehq/stagehand', 'playwright');
    }
    return config;
  },
};

export default nextConfig;
