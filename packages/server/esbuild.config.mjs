import esbuild from 'esbuild'

esbuild
  .build({
    entryPoints: ['src/entry.node.ts'],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: ['node18'],
    outfile: '../../dist/index.cjs',
    banner: {
      js: `#!/usr/bin/env node`,
    },
  })
  .catch(() => process.exit(1))
