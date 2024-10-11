import path from 'path'
import app from './main'
import dotenv from 'dotenv'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import fs from 'fs'
import os from 'os'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

const homeDir = os.homedir()
const configDir = path.join(homeDir, '.faker-server')
const configFile = path.join(configDir, '.env')

if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true })
}

// check config file exists, if not create it
if (!fs.existsSync(configFile)) {
  const accessKey = crypto.randomUUID()
  const adminKey = crypto.randomUUID()
  const defaultConfig = `
# Server Port
PORT=3000

# Access /mock/* API
ACCESS_KEY=${accessKey}

# If true, the server will allow public access to the /mock/* API
# /api/* will continue to require authentication
PUBLIC_ACCESS=false

# Access /api/* API
ADMIN_KEY=${adminKey}

# MongoDB URL
MONGO_URL=mongodb://admin:password@localhost:27017?authSource=admin
`.trim()

  fs.writeFileSync(configFile, defaultConfig)
  console.log('Created default configuration file at:', configFile)
}

dotenv.config({ path: configFile })

app.use(logger())

app.get('/static/*', serveStatic({
  root: path.relative(process.cwd(), __dirname)
}))

app.use('*', cors())

serve({
  ...app,
  port: Number(process.env.PORT) || 3000
}, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
})
