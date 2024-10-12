import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), UnoCSS()],
  server: {
    port: 9981,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: './src/main.tsx',
      output: {
        entryFileNames: 'index.js',
        assetFileNames: 'index.css',
      },
    },
    outDir: '../../dist/static',
  },
})
