import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/') || id.includes('node_modules/@react-three/')) {
            return 'vendor-three'
          }
          if (id.includes('node_modules/motion/')) {
            return 'vendor-motion'
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
