/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Remove this block if you don't need server actions
  experimental: {
    serverActions: {}, // object, not boolean
  },
  // Optional: silence workspace-root warning
  turbopack: { root: __dirname },
};
export default nextConfig;
