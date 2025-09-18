import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Include .jsx files
      include: "**/*.jsx",
    })
  ],
  
  // Development server configuration
  server: {
    port: 3000, // Run on port 3000 to match your backend CORS settings
    host: true, // Allow external connections
    open: true, // Automatically open browser
    cors: true,
    // Proxy API requests to backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true, // Generate source maps for debugging
    minify: 'terser', // Use terser for better minification
    target: 'es2015', // Support modern browsers
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          react: ['react', 'react-dom'],
          // Add more chunks as needed for optimization
        }
      }
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@context': resolve(__dirname, 'src/context'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@utils': resolve(__dirname, 'src/utils'),
    }
  },
  
  // Define environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      // If you plan to use SCSS later
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  
  // Environment variables configuration
  envPrefix: 'VITE_', // Only expose env vars starting with VITE_
  
  // Preview configuration (for production preview)
  preview: {
    port: 3000,
    host: true,
    cors: true
  },
  
  // Optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom'
    ],
    exclude: [
      // Add any dependencies you want to exclude from pre-bundling
    ]
  },
  
  // ESBuild configuration
  esbuild: {
    target: 'es2015',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  }
})