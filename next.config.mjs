/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "yzswukrjljsdoupmonyl.supabase.co",
      },
    ]
  }
};

export default nextConfig;
