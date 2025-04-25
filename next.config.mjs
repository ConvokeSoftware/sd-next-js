/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
};

export default nextConfig;
