import path from 'path'
import app from './entry.cf'
import dotenv from 'dotenv'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import fs from 'fs'
import os from 'os'
import { logger } from 'hono/logger'

const homeDir = os.homedir()
const configDir = path.join(homeDir, '.faker-server')
const configFile = path.join(configDir, '.env')

// 检查配置目录是否存在,不存在则创建
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true })
}

// 检查配置文件是否存在,不存在则创建
if (!fs.existsSync(configFile)) {
  const defaultConfig = `
# Server Port
PORT=3000

# Remember to change this key
KEY=123456-123456-123456-123456

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

serve({
  ...app,
  port: Number(process.env.PORT) || 3000
}, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
})
