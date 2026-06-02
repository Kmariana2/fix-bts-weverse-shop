/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Cloudflare Workers (workerd runtime)
  // @opennextjs/cloudflare handles the build transformation
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Cloudflare Images handles optimization at the edge
    unoptimized: true,
  },
  // Ensure no Vercel-specific features are used
  // Remove Vercel analytics dependency
  experimental: {
    // Needed for Cloudflare Workers edge runtime compatibility
  },
}

export default nextConfig
