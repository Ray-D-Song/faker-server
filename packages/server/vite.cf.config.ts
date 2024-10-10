// DEPRECATED
import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    build({
      entry: 'src/entry.cf.ts',
      outputDir: '../../dist'
    }),
    devServer({
      adapter,
      entry: 'src/entry.cf.ts'
    }),
    {
      name: 'copy-wrangler-toml',
      closeBundle() {
        const srcPath = resolve(__dirname, 'wrangler.toml')
        const destPath = resolve(__dirname, '../../dist/wrangler.toml')
        copyFileSync(srcPath, destPath)
      }
    }
  ]
})
