import esbuild from 'esbuild'
import fs from 'fs/promises'
import path from 'path'

const generateEnvFilePlugin = {
  name: 'generate-env-file',
  setup(build) {
    build.onEnd(async () => {
      const envContent = `
# Server Port
PORT=3000

# Remember to change this key
KEY=123456-123456-123456-123456

# MongoDB URL
MONGO_URL=mongodb://admin:password@localhost:27017?authSource=admin
`.trim()

      const outdir = path.dirname(build.initialOptions.outfile)
      const envFilePath = path.join(outdir, '.env')

      await fs.writeFile(envFilePath, envContent)
    })
  }
}

esbuild.build({
  entryPoints: ['src/entry.node.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: 'dist/index.cjs',
  plugins: [generateEnvFilePlugin],
}).catch(() => process.exit(1));