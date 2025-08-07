// Ficheiro: src/app/manifest.ts (VERSÃO CORRIGIDA)
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Plataforma Soneh',
    short_name: 'Soneh',
    description: 'Plataforma de Controlo IoT para os seus dispositivos.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#1a202c',
    theme_color: '#2d3748',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
