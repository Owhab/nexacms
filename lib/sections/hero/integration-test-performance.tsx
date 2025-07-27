'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  generateOptimizedImageSrcSet,
  generateResponsiveImageSizes,
  HeroPerformanceMonitor
} from './performance'
import { LazyImage } from './components/LazyImage'
import { LazyVideo, OptimizedVideo } from './components/LazyVideo'
import { usePerformanceOptimization } from './hooks/usePerformanceOptimization'
import { HeroVariant } from './types'

/**
 * Performance Integration Test Component
 * 
 * This component demonstrates and tests all performance optimization features
 * including lazy loading, image optimization, video optimization, and performance monitoring.
 */
export function PerformanceIntegrationTest() {
  const [testResults, setTestResults] = useState<any>({})
  const [isRunning, setIsRunning] = useState(false)

  const {
    optimizeImage,
    optimizeVideo,
    measureRender,
    measureAsync,
    getMetrics,
    markOptimized
  } = usePerformanceOptimization({
    variant: HeroVariant.CENTERED,
    enableMonitoring: true,
    preloadAssets: [
      { url: '/assets/hero/test-image.jpg', type: 'image' },
      { url: '/assets/hero/test-video.mp4', type: 'video' }
    ]
  })

  const runPerformanceTests = useCallback(async () => {
    setIsRunning(true)
    const results: any = {}

    try {
      // Test 1: Image Optimization
      console.log('Testing image optimization...')
      const testImageUrl = '/assets/hero/test-image.jpg'
      const optimizedImageUrl = optimizeImage(testImageUrl, {
        width: 800,
        height: 600,
        quality: 80,
        format: 'webp'
      })

      results.imageOptimization = {
        original: testImageUrl,
        optimized: optimizedImageUrl,
        srcSet: generateOptimizedImageSrcSet(testImageUrl),
        sizes: generateResponsiveImageSizes()
      }

      // Test 2: Video Optimization
      console.log('Testing video optimization...')
      const testVideoUrl = '/assets/hero/test-video.mp4'
      const optimizedVideoUrl = optimizeVideo(testVideoUrl, {
        quality: 'medium',
        format: 'webm'
      })

      results.videoOptimization = {
        original: testVideoUrl,
        optimized: optimizedVideoUrl
      }

      // Test 3: Performance Monitoring
      console.log('Testing performance monitoring...')
      const renderResult = measureRender('test-component', () => {
        // Simulate component rendering work
        const items = []
        for (let i = 0; i < 1000; i++) {
          items.push(`Item ${i}`)
        }
        return items.length
      })

      const asyncResult = await measureAsync('test-async-operation',
        new Promise(resolve => setTimeout(() => resolve('async complete'), 100))
      )

      results.performanceMonitoring = {
        renderResult,
        asyncResult,
        metrics: getMetrics()
      }

      // Test 4: Bundle Size Analysis
      console.log('Testing bundle size analysis...')
      const monitor = new HeroPerformanceMonitor()
      const bundleSize = await monitor.getBundleSize()
      const memoryUsage = monitor.getMemoryUsage()

      results.bundleAnalysis = {
        bundleSize,
        memoryUsage
      }

      monitor.cleanup()

      // Mark optimization as complete
      markOptimized()

      setTestResults(results)
      console.log('✅ All performance tests completed successfully!')

    } catch (error) {
      console.error('❌ Performance tests failed:', error)
      results.error = error instanceof Error ? error.message : 'Unknown error'
      setTestResults(results)
    } finally {
      setIsRunning(false)
    }
  }, [optimizeImage, optimizeVideo, measureRender, measureAsync, getMetrics, markOptimized])

  useEffect(() => {
    // Run tests on component mount
    runPerformanceTests()
  }, [runPerformanceTests])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Hero Sections Performance Integration Test</h1>

      {/* Test Status */}
      <div className="mb-8 p-4 rounded-lg bg-gray-100">
        <h2 className="text-xl font-semibold mb-2">Test Status</h2>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isRunning
            ? 'bg-yellow-100 text-yellow-800'
            : Object.keys(testResults).length > 0
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
          {isRunning ? '🔄 Running Tests...' : Object.keys(testResults).length > 0 ? '✅ Tests Complete' : '⏳ Waiting...'}
        </div>
      </div>

      {/* Lazy Image Test */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Lazy Image Loading Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Standard Lazy Image</h3>
            <LazyImage
              media={{
                id: 'test-lazy-image',
                url: '/assets/hero/1752750261939_uxl73eyx4zi.jpg',
                type: 'image',
                alt: 'Test lazy loading image',
                objectFit: 'cover',
                loading: 'lazy'
              }}
              className="rounded-lg w-full h-64"
              quality={80}
              onLoad={() => console.log('Lazy image loaded')}
            />
          </div>
          <div>
            <h3 className="font-medium mb-2">Priority Lazy Image</h3>
            <LazyImage
              media={{
                id: 'test-priority-image',
                url: '/assets/hero/1753082650747_1k3s7j3kf1y.png',
                type: 'image',
                alt: 'Test priority image',
                objectFit: 'cover',
                loading: 'eager'
              }}
              className="rounded-lg"
              priority={true}
              onLoad={() => console.log('Priority image loaded')}
            />
          </div>
        </div>
      </div>

      {/* Lazy Video Test */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Lazy Video Loading Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Standard Lazy Video</h3>
            <LazyVideo
              src="/assets/hero/sample-video.mp4"
              poster="/assets/hero/1752750261939_uxl73eyx4zi.jpg"
              width={400}
              height={300}
              className="rounded-lg"
              autoplay={false}
              loop={true}
              muted={true}
              onLoad={() => console.log('Lazy video loaded')}
            />
          </div>
          <div>
            <h3 className="font-medium mb-2">Optimized Video</h3>
            <OptimizedVideo
              src="/assets/hero/sample-video.mp4"
              poster="/assets/hero/1753082650747_1k3s7j3kf1y.png"
              width={400}
              height={300}
              className="rounded-lg"
              autoplay={false}
              loop={true}
              muted={true}
              onLoad={() => console.log('Optimized video loaded')}
            />
          </div>
        </div>
      </div>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm overflow-auto max-h-96">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800">Image Optimization</h3>
            <p className="text-sm text-blue-600 mt-1">
              WebP format, responsive srcsets, lazy loading
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800">Video Optimization</h3>
            <p className="text-sm text-green-600 mt-1">
              Format detection, lazy loading, poster fallbacks
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800">Code Splitting</h3>
            <p className="text-sm text-purple-600 mt-1">
              Dynamic imports, lazy components, performance monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={runPerformanceTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? 'Running Tests...' : 'Run Tests Again'}
        </button>
        <button
          onClick={() => {
            console.log('Current test results:', testResults)
            console.log('Performance metrics:', getMetrics())
          }}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Log Results to Console
        </button>
      </div>
    </div>
  )
}

export default PerformanceIntegrationTest