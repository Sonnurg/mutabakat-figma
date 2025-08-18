import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mutabakat-figma/', // GitHub repository adınızı yazın
  build: {
    outDir: 'dist'
  }
})