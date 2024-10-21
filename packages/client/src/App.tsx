import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import Dashboard from './dashboard'
import KeyContext from './ctx/key'
import { useState } from 'react'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0F1214',
      paper: '#0F1214',
    },
  },
})

function App() {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('mockServerKey') || '',
  )
  return (
    <ThemeProvider theme={darkTheme}>
      <KeyContext.Provider value={{ apiKey, setApiKey }}>
        <CssBaseline />
        <Dashboard />
      </KeyContext.Provider>
    </ThemeProvider>
  )
}

export default App
