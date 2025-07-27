// Webpack configuration for browser compatibility
// Add this to your next.config.js

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Add polyfills for client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "css-variables": require.resolve("css-vars-ponyfill"),
        "intersection-observer": require.resolve("intersection-observer"),
        "resize-observer": require.resolve("@juggle/resize-observer"),
        "webp-support": require.resolve("webp-hero")
      }
    }
    
    return config
  },
  
  // Browser compatibility settings
  experimental: {
    browsersListForSwc: true,
  },
  
  // Transpilation for older browsers
  transpilePackages: [
    'lucide-react',
    // Add other packages that need transpilation
  ]
}

module.exports = nextConfig