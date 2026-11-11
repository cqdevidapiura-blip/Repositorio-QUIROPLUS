import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
    server: {
      host: true, // Esto permite que otros dispositivos de la red entren
      port: 5173  // (o el puerto que uses habitualmente)
    }
})