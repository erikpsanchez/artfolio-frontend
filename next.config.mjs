// next.config.mjs

import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@axios': path.resolve('./src/configs/axios')
    };

    return config;
  },
};

export default nextConfig;
