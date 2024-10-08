import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

const adapter = new PrismaD1(c.env.DB)
const prisma = new PrismaClient({ adapter })

export default prisma