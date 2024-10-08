import { Hono } from 'hono'
import { formatPath } from './utils/path'
import { Bindings } from './utils/binding'
import dbMiddleware from './middleware/db'

const app = new Hono<{ Bindings: Bindings }>()

app.use(dbMiddleware)

app.get('/', async (c) => {
  return c.html(
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script type="module" src="/static/index.js"></script>
  <link rel="stylesheet" href="/static/index.css">
  <title>Web Archive</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
  )
})

app.all('/mock/*', async c => {
  const token = c.req.header('Mock-Server-Auth')
  if (token !== c.env.TOKEN)
    return c.text('Mock Server Unauthorized', 401)

  const path = formatPath(
    c.req.path.replace('/mock', '')
  )

  const db = c.get('db')
  const api = await db.api.findUnique({
    where: {
      method: c.req.method.toUpperCase(),
      path,
      deleted: 0
    }
  })
  if (!api)
    return c.text('Not Found', 404)

  if (api.resHeaders) {
    const headers = JSON.parse(api.resHeaders)
    for (const key in headers)
      c.header(key, headers[key])
  }
  if (api.resBody) {
    const body = JSON.parse(api.resBody)
    return c.json(body)
  }
  return c.text('')
})

export default app
