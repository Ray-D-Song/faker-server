import { createContext } from 'react'

const KeyContext = createContext({
  apiKey: '',
  setApiKey: (key: string) => {},
})

export default KeyContext
