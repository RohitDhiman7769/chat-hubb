import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv';
config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  ...(process.env.NODE_ENV === 'development'
    ? {
      define: {
        global: {},
    // 'process.env': process.env

      },
    }
    : {}),
 
})
