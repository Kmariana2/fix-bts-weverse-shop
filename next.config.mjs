/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Cloudflare Workers (workerd runtime)
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Cloudflare handles image optimization at the edge
    unoptimized: true,
  },
}

export default nextConfig
