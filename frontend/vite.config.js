import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss';


export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'build', // Aquí cambias 'dist' por 'build'
  },
})
