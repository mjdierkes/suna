import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const isElectronBuild = process.env.ELECTRON_BUILD === 'true';

let nextConfig: NextConfig = {
  // Electron-specific configuration
  ...(isElectronBuild && {
    output: 'export',
    distDir: 'out',
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  }),
  webpack: (config) => {
    // This rule prevents issues with pdf.js and canvas
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];

    // Ensure node native modules are ignored
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };

    return config;
  },
};

// Only add Sentry in production web builds, not Electron builds
if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && !isElectronBuild) {
  nextConfig = withSentryConfig(nextConfig, {
    org: 'kortix-ai',
    project: 'suna-nextjs',
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: '/monitoring',
    disableLogger: true,
    automaticVercelMonitors: true,
  });
}

export default nextConfig;
