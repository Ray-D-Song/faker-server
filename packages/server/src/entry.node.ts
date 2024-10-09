import path from 'path'
import { readFile } from 'fs/promises'
import { getMimeType } from 'hono/utils/mime'
import app from './entry.cf'
import dotenv from 'dotenv'
import { serve } from '@hono/node-server'

dotenv.config()

app.use('static/*', async (c) => {
  const filePath = path.join('./static', c.req.path.replace('/static/', ''))
  try {
    const content = await readFile(filePath)
    if (!content) {
      return c.text('Not Found', 404)
    }
    const mimeType = getMimeType(filePath)
    return c.body(content, 200, { 'Content-Type': mimeType || 'text/plain' })
  } catch (_error) {
    return c.text('Not Found', 404)
  }
})

serve({
  ...app,
  port: Number(process.env.PORT) || 3000
}, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
})
