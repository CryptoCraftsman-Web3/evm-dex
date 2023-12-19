const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.stories\.(tsx|ts)$/,
      loader: 'ignore-loader',
    })
    config.resolve.alias['@'] = path.resolve(__dirname, "./");
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

module.exports = nextConfig;
