import { Hono } from 'hono'
import { Bindings } from './utils/binding'
import dbMiddleware from './middleware/db'
import mockApp from './api/mock'
import crudApp from './api/crud'
import guard from './middleware/guard'

const app = new Hono<{ Bindings: Bindings }>()

app.use(dbMiddleware)
app.use('/mock/*', guard.mockGuard)
app.use('/api/*', guard.apiGuard)

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

app.route('/mock', mockApp)
app.route('/api', crudApp)

export default app