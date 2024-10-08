type Type = 'none' | 'application/json' | 'text/plain'
| 'application/xml' | 'text/html'
| 'application/octet-stream'

type MimeTypeMap = {
  'none': null,
  'application/json': Record<string, any>,
  'text/plain': string,
  'application/xml': string,
  'application/x-www-form-urlencoded': URLSearchParams,
  'application/octet-stream': ArrayBuffer,
  'multipart/form-data': FormData
}

type Body<T extends Type> = T extends keyof MimeTypeMap ? MimeTypeMap[T] : null

interface SourceItem {
  // json key
  key: string
  type: 'string' | 'integer' | 'number' | 'boolean' | 'array' | 'object' | 'number' | 'null'
  // faker.js mock type
  mock: string
  desc: string
  children?: SourceItem[]
}

function processResBody<T extends Type>(type: T, raw?: string, spec?: string): Body<T> {

  if (type === 'none') return null as Body<T>

  if (type === 'application/json') {
    if (spec) return JSON.parse(spec) as Body<T>
    if (!raw) return {} as Body<T>
    const source = JSON.parse(raw) as SourceItem[]
  }

return null as Body<T>
  return null as Body<T>
}

function sourceHandler(s: SourceItem) {

}

export {
  processResBody
}