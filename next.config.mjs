/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "yzswukrjljsdoupmonyl.supabase.co",
      },
      {
        protocol: 'https',
        hostname: "drive.usercontent.google.com",
      },
    ]
  },
  trailingSlash: false,
};

export default nextConfig;
