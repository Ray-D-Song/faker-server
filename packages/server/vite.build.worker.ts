import { defineConfig } from 'vite'
import build from '@hono/vite-build/cloudflare-pages'
import fs from 'fs'

export default defineConfig({
  plugins: [
    build({
      entry: './src/entry.worker.ts',
      outputDir: '../../dist',
    }),
    generateWranglerToml(),
  ],
})

function generateWranglerToml() {
  return {
    name: 'generate-wrangler-toml',
    closeBundle: () => {
      const wranglerContent = fs.readFileSync('../../wrangler.toml').toString()
      fs.writeFileSync('../../dist/wrangler.toml', wranglerContent)
    },
  }
}
