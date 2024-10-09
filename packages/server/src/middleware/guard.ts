import { Context, Next } from 'hono'
import { env } from 'hono/adapter'

export default async (c: Context, next: Next) => {
  const { KEY } = env(c)
  const key = c.req.header('Mock-Server-Key')
  if (!key || key !== KEY) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
}