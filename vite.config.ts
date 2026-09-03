import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const DEFAULT_API_TARGET = 'https://kyomeiapi-production.up.railway.app'

// Keep the browser on the Vite origin. Vite forwards API requests server-side,
// so local development does not depend on the Railway CORS policy.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const apiTarget = env.KYOMEI_API_PROXY_TARGET ?? env.VITE_KYOMEI_API_BASE_URL ?? DEFAULT_API_TARGET

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
