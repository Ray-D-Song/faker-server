import { Context, Next } from 'hono'
import { MongoClient } from 'mongodb'
import { env } from 'hono/adapter'

export default async (c: Context, next: Next) => {
  const { MONGO_URL } = env(c)
  if (!MONGO_URL) {
    throw new Error('MONGO_URL is not set')
  }

  const client = new MongoClient(MONGO_URL)
  try {
    await client.connect()

    c.set('db', client.db())
    await next()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  } finally {
    await client.close()
  }
}