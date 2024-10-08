import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import Dashboard from './dashboard'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0F1214',
      paper: '#0F1214',
    },
  },
});

function App() {

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  )
}

export default App
