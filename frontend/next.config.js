/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  optimizeFonts: true,
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
