/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/slotify',
  assetPrefix: '/slotify',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
