import { defineConfig, Plugin } from 'vite'
import build from '@hono/vite-build/cloudflare-pages'
import { readFileSync, writeFileSync } from 'node:fs'

export default defineConfig({
  plugins: [
    build({
      entry: './src/entry.worker.ts',
      outputDir: '../../dist',
      minify: false,
    }),
    addNodePrefix(),
  ],
})

const builtinModules = [
  'assert',
  'buffer',
  'child_process',
  'cluster',
  'crypto',
  'dgram',
  'dns',
  'domain',
  'events',
  'fs',
  'fs/promises',
  'http',
  'https',
  'net',
  'os',
  'path',
  'punycode',
  'querystring',
  'readline',
  'stream',
  'string_decoder',
  'tls',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'zlib',
  'timers',
  'timers/promises',
  'process',
]

function addNodePrefix(): Plugin {
  return {
    name: 'add-node-prefix',
    writeBundle() {
      const raw = readFileSync('../../dist/_worker.js', 'utf-8')
      const workerJsLines = raw.split('\n').map((line) => {
        if (line.startsWith('import ')) {
          builtinModules.forEach((module) => {
            if (line.includes(`"${module}"`)) {
              switch (module) {
                case 'timers':
                  line = 'const require$$0$1 = { setTimeout, clearTimeout, setInterval, clearInterval }'
                  break
                default:
                  line = line.replace(`"${module}"`, `"node:${module}"`)
              }
            }
          })
        }
        return line
      })
      writeFileSync('../../dist/_worker.js', workerJsLines.join('\n'))
    },
  }
}
