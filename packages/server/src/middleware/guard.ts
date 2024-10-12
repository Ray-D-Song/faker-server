import { Context, Next } from 'hono'
import { env } from 'hono/adapter'

export default {
  mockGuard: async (c: Context, next: Next) => {
    const { ACCESS_KEY, PUBLIC_ACCESS } = env(c)
    if (PUBLIC_ACCESS) {
      await next()
    } else {
      const key = c.req.header('Faker-Server-Key')
      if (!key || key !== ACCESS_KEY) {
        return c.json({ error: 'Unauthorized' }, 401)
      }
      await next()
    }
  },
  apiGuard: async (c: Context, next: Next) => {
    const { ADMIN_KEY } = env(c)
    const key = c.req.header('Faker-Server-Key')
    if (!key || key !== ADMIN_KEY) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    await next()
  },
}
