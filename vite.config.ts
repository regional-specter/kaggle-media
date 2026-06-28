import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/kaggle': {
        target: 'https://www.kaggle.com/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kaggle/, ''),
      },
    },
  },
})
