import d1 from './d1'

let db

if (process.env.PLATEFORM === 'cloudflare') {
  db = d1
}

export default db