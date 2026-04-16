import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      // Fotos de animales (mock) — en producción serán URLs de Supabase Storage
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Avatares generados para albergues (mock)
      { protocol: 'https', hostname: 'api.dicebear.com' },
      // Fotos de galería de albergues (mock)
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
}

export default nextConfig
