import { Hono } from 'hono'
import { Bindings } from '../utils/binding'
import { formatPath } from '../utils/path'
import { processResBody } from '../process/body'

const mockApp = new Hono<{ Bindings: Bindings }>()

mockApp.all('/*', async (c) => {
  const path = formatPath(c.req.path.replace('/mock', ''))
  const method = c.req.method.toUpperCase()

  const db = c.get('db')
  const collection = db.collection<Api>('apis')

  try {
    const api = await collection.findOne({
      method,
      path,
      deleted: { $ne: true },
    })

    if (!api) {
      return c.json({ error: 'API not found' }, 404)
    }

    // 设置响应头
    if (api.resHeaders) {
      Object.entries(api.resHeaders).forEach(([key, value]) => {
        c.header(key, value as string)
      })
    }

    // 设置响应状态码
    c.status(200)

    // 返回响应体
    if (api.resBody) {
      switch (api.resResponseType) {
        case 'json':
          return c.json(processResBody(api.resBody))
        case 'text':
          return c.text(api.resBody)
        case 'html':
          return c.html(api.resBody)
        default:
          return c.body(null)
      }
    }

    return c.body(null)
  } catch (error) {
    console.error('error:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

export default mockApp
