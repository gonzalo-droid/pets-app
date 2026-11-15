import path from 'node:path'
import type { NextConfig } from 'next'

// Imágenes subidas por los albergues a Supabase Storage (bucket público "huellas").
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname
  } catch {
    return null
  }
})()

const nextConfig: NextConfig = {
  // Letras de las imágenes para compartir (se leen del disco al generarlas).
  outputFileTracingIncludes: {
    '/api/share/[slug]': ['./assets/fonts/**'],
    '/donate/[slug]/opengraph-image-*': ['./assets/fonts/**'],
    '/donate/[slug]/*': ['./assets/fonts/**'],
  },
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
      ...(supabaseHost
        ? [
            {
              protocol: 'https' as const,
              hostname: supabaseHost,
              pathname: '/storage/v1/object/public/huellas/**',
            },
          ]
        : []),
    ],
  },
}

export default nextConfig
