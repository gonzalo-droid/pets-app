import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Fotos de animales (mock) — en producción serán URLs de Supabase Storage
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Avatares generados para albergues (mock)
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
}

export default nextConfig
