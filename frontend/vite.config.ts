import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: [
      'd77d5454-5530-423e-b0b6-9dc9ba8366cd-00-2hvc8m3imn6go.spock.replit.dev',
      'd77d5454-5530-423e-b0b6-9dc9ba8366cd-00-2hvc8m3imn6go.spock.repl.co',
      'localhost'
    ],
    hmr: {
      port: 5000
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1/, '/v1')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})