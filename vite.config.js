import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: [
          ['@babel/preset-flow', { all: true }]
        ],
        plugins: []
      }
    })
  ],
  base: '/module-builder/',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    open: true
  },
  define: {
    // This replaces process.env.PUBLIC_URL which was used by create-react-app
    'process.env.PUBLIC_URL': JSON.stringify('/module-builder')
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
  esbuild: {
    loader: 'jsx',
    include: /\.[jt]sx?$/,
    exclude: [],
    target: 'esnext'
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      target: 'esnext'
    },
    include: [
      'react', 
      'react-dom', 
      'react-ace'
    ]
  }
})
