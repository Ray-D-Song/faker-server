export {}

declare module 'hono' {
  interface ContextVariableMap {
    db: import('@prisma/client').PrismaClient
  }
}