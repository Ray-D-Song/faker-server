import { defineConfig } from 'vite'
import build from '@hono/vite-build/cloudflare-pages'

export default defineConfig({
  build: {
    target: 'esnext',
  },
  plugins: [
    build({
      entry: './src/entry.worker.ts',
      outputDir: '../../dist',
    }),
  ],
})