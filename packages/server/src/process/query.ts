import { Context } from 'hono';

function processQuery(c: Context, q: string) {
  try {
    const query = JSON.parse(q)
    for (const key in query) {

    }
  } catch(e) {
    return c.status(500)
  }
}