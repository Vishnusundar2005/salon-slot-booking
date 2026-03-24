/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/slotify',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
