export {}

declare module 'hono' {
  interface ContextVariableMap {
    db: import('mongodb').Db
  }
}