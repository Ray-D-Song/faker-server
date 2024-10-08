import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import { Context, Next } from 'hono'

export default async (c: Context, next: Next) => {
  let prisma
  if (process.env.PLATEFORM === 'cloudflare') {
    const adapter = new PrismaD1(c.env.DB)
    prisma = new PrismaClient({ adapter })
  }

  if (!prisma) {
    throw new Error('Prisma client not initialized')
  }

  const seed = await prisma.api.findUnique({
    where: { path: 'hello' }
  })
  if (!seed)
    await prisma.api.create({
      data: {
        name: 'My API',
        path: 'hello',
        description: 'My first API',
        resStatus: 200,
        method: 'GET',
        resResponseType: 'application/json',
        resBody: JSON.stringify({ message: 'Hello, World!' }),
      }
    })


  c.set('db', prisma)
  await next()
}