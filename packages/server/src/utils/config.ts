import os from 'os'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

const homeDir = os.homedir()
const configDir = path.join(homeDir, '.faker-server')
const configFile = path.join(configDir, '.env')

function generateDefaultConfig() {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true })
  }

  // check config file exists, if not create it
  if (!fs.existsSync(configFile)) {
    const accessKey = crypto.randomUUID()
    const adminKey = crypto.randomUUID()
    const readonlyKey = crypto.randomUUID()
    const defaultConfig = `
# Server Port
PORT=3000

# Access /mock/* API
ACCESS_KEY=${accessKey}

# If true, the server will allow public access to the /mock/* API
# /api/* will continue to require authentication
PUBLIC_ACCESS=false

# ADMIN_KEY is used to access the web page and modify the data
ADMIN_KEY=${adminKey}

# READONLY_KEY can access the web page, but cannot modify the data
READONLY_KEY=${readonlyKey}

# MongoDB URL
MONGO_URL=mongodb://admin:password@localhost:27017?authSource=admin
`.trim()

    fs.writeFileSync(configFile, defaultConfig)
    console.log('Created default configuration file at:', configFile)
  }
}

export { configDir, configFile, generateDefaultConfig }
