import { Hono } from 'hono'
import { Bindings } from '../utils/binding'
import { ObjectId } from 'mongodb'
import { formatPath } from '../utils/path'

const crudApp = new Hono<{ Bindings: Bindings }>()

crudApp.post('/create', async (c) => {
  const api = await c.req.json<Api>()
  const db = c.get('db')
  const collection = db.collection<Api>('apis')

  try {
    // check if the path and method is already exists
    const existingApi = await collection.findOne({
      path: formatPath(api.path),
      method: api.method,
      deleted: { $ne: true },
    })
    if (existingApi) {
      return c.json({ error: 'API already exists' }, 400)
    }
    const result = await collection.insertOne({
      ...api,
      path: formatPath(api.path),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    if (result.acknowledged) {
      const createdApi = await collection.findOne({ _id: result.insertedId })
      return c.json(createdApi, 201)
    } else {
      return c.json({ error: 'Failed to create API' }, 500)
    }
  } catch (error) {
    console.error('Error creating API:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

crudApp.post('/update', async (c) => {
  const api = await c.req.json<Api>()
  const db = c.get('db')
  const collection = db.collection<Api>('apis')

  if (!api._id) {
    return c.json({ error: 'API ID is required' }, 400)
  }

  try {
    const id = new ObjectId(api._id)
    // check if the path and method is already exists, except only one api
    const existingApis = await collection
      .find({
        path: formatPath(api.path),
        method: api.method,
        deleted: { $ne: true },
      })
      .toArray()
    if (existingApis.length > 1) {
      return c.json({ error: 'API path and method must be unique' }, 400)
    }
    if (
      existingApis.length === 1 &&
      existingApis[0]._id.toString() !== id.toString()
    ) {
      return c.json({ error: 'API path and method must be unique' }, 400)
    }
    delete api._id
    const result = await collection.updateOne(
      { _id: id },
      {
        $set: {
          ...api,
          path: formatPath(api.path),
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return c.json({ error: 'API not found' }, 404)
    }

    const updatedApi = await collection.findOne({ _id: api._id })
    return c.json(updatedApi)
  } catch (error) {
    console.error('Error updating API:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

crudApp.delete('/delete/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.get('db')
  const collection = db.collection<Api>('apis')

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { deleted: true, updatedAt: new Date() } },
    )

    if (result.matchedCount === 0) {
      return c.json({ error: 'API not found' }, 404)
    }

    return c.json({ message: 'API deleted successfully' })
  } catch (error) {
    console.error('Error deleting API:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

crudApp.get('/list', async (c) => {
  const db = c.get('db')
  const collection = db.collection<Api>('apis')

  try {
    const apis = await collection
      .find(
        { deleted: { $ne: true } },
        { projection: { _id: 1, name: 1, method: 1, path: 1 } },
      )
      .toArray()
    return c.json(apis)
  } catch (error) {
    console.error('Error fetching API list:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

// 添加新的详情接口
crudApp.get('/detail/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.get('db')
  const collection = db.collection<Api>('apis')

  try {
    const api = await collection.findOne({
      _id: new ObjectId(id),
      deleted: { $ne: true },
    })
    if (!api) {
      return c.json({ error: 'API not found' }, 404)
    }
    return c.json(api)
  } catch (error) {
    console.error('Error fetching API detail:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

export default crudApp
