/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['https://otsvblatniybfdufcjum.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
