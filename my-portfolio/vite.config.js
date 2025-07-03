import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ADD THIS BLOCK TO EXPLICITLY CONFIGURE HMR
  server: {
    hmr: {
      host: 'localhost',
      port: 5173, // or whatever port your Vite server is running on
    }
  }
})