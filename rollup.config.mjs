import { env, cloudflare } from "unenv"

const {
  alias,
  inject,
  external,
  polyfill,
} = env(cloudflare)

export default {
  input: 'dist/_worker.js',
  output: {
    file: 'dist/_worker.js',
  },
  alias,
  external,
  inject,
  polyfill
}
