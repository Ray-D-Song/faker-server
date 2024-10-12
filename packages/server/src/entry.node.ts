import path from 'path'
import app from './main'
import dotenv from 'dotenv'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { configFile, generateDefaultConfig } from './utils/config'

const args = process.argv.slice(2)

if (args[0] === 'generate-config') {
  generateDefaultConfig()
  process.exit(0)
}

generateDefaultConfig()
dotenv.config({ path: configFile })

app.use(logger())

app.get(
  '/static/*',
  serveStatic({
    root: path.relative(process.cwd(), __dirname),
  }),
)

app.use('*', cors())

if (args.length === 0)
  serve(
    {
      ...app,
      port: Number(process.env.PORT) || 3000,
    },
    (info) => {
      console.log(`Listening on http://localhost:${info.port}`)
    },
  )
