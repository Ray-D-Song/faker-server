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
      const wranglerContent = `
name = "faker-server"
compatibility_flags = [ "nodejs_compat" ]
compatibility_date = "2024-09-23"
      `.trim()

      fs.writeFileSync('../../dist/wrangler.toml', wranglerContent)
    },
  }
}