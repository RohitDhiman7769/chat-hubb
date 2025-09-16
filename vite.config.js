import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv';
import tailwindcss from '@tailwindcss/vite'
config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  ...(process.env.NODE_ENV === 'development'
    ? {
      define: {
        global: {},
    // 'process.env': process.env

      },
    }
    : {}),
 
})
