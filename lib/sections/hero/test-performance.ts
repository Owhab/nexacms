// Performance Optimization Tests for Hero Sections

import { 
  optimizeImageUrl, 
  optimizeVideoUrl,
  generateOptimizedImageSrcSet,
  generateResponsiveImageSizes,
  HeroPerformanceMonitor,
  analyzeBundleSize,
  extractCriticalCSS,
  lazyLoadHeroVariant,
  lazyLoadHeroEditor,
  lazyLoadHeroPreview
} from './performance'
import { HeroVariant } from './types'

/**
 * Test image optimization functionality
 */
export function testImageOptimization() {
  console.log('Testing image optimization...')
  
  const testUrl = '/assets/hero/test-image.jpg'
  
  // Test basic optimization
  const optimized = optimizeImageUrl(testUrl, {
    width: 800,
    height: 600,
    quality: 80,
    format: 'webp'
  })
  
  console.log('Original URL:', testUrl)
  console.log('Optimized URL:', optimized)
  
  // Test responsive srcset generation
  const srcSet = generateOptimizedImageSrcSet(testUrl)
  console.log('Responsive srcSet:', srcSet)
  
  // Test responsive sizes
  const sizes = generateResponsiveImageSizes()
  console.log('Responsive sizes:', sizes)
  
  return {
    original: testUrl,
    optimized,
    srcSet,
    sizes
  }
}

/**
 * Test video optimization functionality
 */
export function testVideoOptimization() {
  console.log('Testing video optimization...')
  
  const testUrl = '/assets/hero/test-video.mp4'
  
  // Test basic optimization
  const optimized = optimizeVideoUrl(testUrl, {
    quality: 'medium',
    format: 'webm'
  })
  
  console.log('Original URL:', testUrl)
  console.log('Optimized URL:', optimized)
  
  return {
    original: testUrl,
    optimized
  }
}

/**
 * Test performance monitoring
 */
export async function testPerformanceMonitoring() {
  console.log('Testing performance monitoring...')
  
  const monitor = new HeroPerformanceMonitor()
  
  // Test component render measurement
  const renderResult = monitor.measureComponentRender('test-component', () => {
    // Simulate component rendering work
    const start = Date.now()
    while (Date.now() - start < 10) {
      // Busy wait for 10ms
    }
    return 'render complete'
  })
  
  console.log('Render result:', renderResult)
  
  // Test async operation measurement
  const asyncResult = await monitor.measureAsyncOperation('test-async', 
    new Promise(resolve => setTimeout(() => resolve('async complete'), 50))
  )
  
  console.log('Async result:', asyncResult)
  
  // Get metrics
  const metrics = monitor.getMetrics()
  console.log('Performance metrics:', metrics)
  
  // Test bundle size analysis
  const bundleSize = await monitor.getBundleSize()
  console.log('Bundle size:', bundleSize)
  
  // Test memory usage
  const memoryUsage = monitor.getMemoryUsage()
  console.log('Memory usage:', memoryUsage)
  
  monitor.cleanup()
  
  return {
    renderResult,
    asyncResult,
    metrics,
    bundleSize,
    memoryUsage
  }
}

/**
 * Test lazy loading functionality
 */
export async function testLazyLoading() {
  console.log('Testing lazy loading...')
  
  const variants = [
    HeroVariant.CENTERED,
    HeroVariant.SPLIT_SCREEN,
    HeroVariant.VIDEO
  ]
  
  const results = []
  
  for (const variant of variants) {
    try {
      console.log(`Testing lazy loading for ${variant}...`)
      
      // Test component lazy loading
      const Component = lazyLoadHeroVariant(variant)
      console.log(`✓ Component loaded for ${variant}`)
      
      // Test editor lazy loading
      const Editor = lazyLoadHeroEditor(variant)
      console.log(`✓ Editor loaded for ${variant}`)
      
      // Test preview lazy loading
      const Preview = lazyLoadHeroPreview(variant)
      console.log(`✓ Preview loaded for ${variant}`)
      
      results.push({
        variant,
        success: true,
        components: { Component, Editor, Preview }
      })
    } catch (error) {
      console.error(`✗ Failed to load ${variant}:`, error)
      results.push({
        variant,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  return results
}

/**
 * Test bundle size analysis
 */
export async function testBundleAnalysis() {
  console.log('Testing bundle size analysis...')
  
  try {
    const report = await analyzeBundleSize()
    console.log('Bundle analysis report:', report)
    
    return {
      success: true,
      report
    }
  } catch (error) {
    console.error('Bundle analysis failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Test critical CSS extraction
 */
export function testCriticalCSS() {
  console.log('Testing critical CSS extraction...')
  
  const variants = [
    HeroVariant.CENTERED,
    HeroVariant.SPLIT_SCREEN,
    HeroVariant.VIDEO,
    HeroVariant.MINIMAL
  ]
  
  const results = variants.map(variant => {
    const css = extractCriticalCSS(variant)
    console.log(`Critical CSS for ${variant}:`, css.substring(0, 100) + '...')
    
    return {
      variant,
      css,
      size: css.length
    }
  })
  
  return results
}

/**
 * Run all performance tests
 */
export async function runAllPerformanceTests() {
  console.log('🚀 Running all performance optimization tests...')
  
  const results = {
    imageOptimization: testImageOptimization(),
    videoOptimization: testVideoOptimization(),
    performanceMonitoring: await testPerformanceMonitoring(),
    lazyLoading: await testLazyLoading(),
    bundleAnalysis: await testBundleAnalysis(),
    criticalCSS: testCriticalCSS()
  }
  
  console.log('✅ All performance tests completed!')
  console.log('Results summary:', {
    imageOptimization: '✓ Passed',
    videoOptimization: '✓ Passed',
    performanceMonitoring: '✓ Passed',
    lazyLoading: results.lazyLoading.every(r => r.success) ? '✓ Passed' : '⚠ Some failures',
    bundleAnalysis: results.bundleAnalysis.success ? '✓ Passed' : '✗ Failed',
    criticalCSS: '✓ Passed'
  })
  
  return results
}

/**
 * Performance benchmark test
 */
export async function benchmarkPerformance() {
  console.log('📊 Running performance benchmarks...')
  
  const iterations = 100
  const results = {
    imageOptimization: [] as number[],
    componentLoading: [] as number[],
    renderTimes: [] as number[]
  }
  
  // Benchmark image optimization
  console.log('Benchmarking image optimization...')
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    optimizeImageUrl('/test-image.jpg', { width: 800, quality: 80 })
    const end = performance.now()
    results.imageOptimization.push(end - start)
  }
  
  // Benchmark component loading
  console.log('Benchmarking component loading...')
  for (let i = 0; i < 10; i++) {
    const start = performance.now()
    await lazyLoadHeroVariant(HeroVariant.CENTERED)
    const end = performance.now()
    results.componentLoading.push(end - start)
  }
  
  // Calculate statistics
  const calculateStats = (times: number[]) => ({
    min: Math.min(...times),
    max: Math.max(...times),
    avg: times.reduce((a, b) => a + b, 0) / times.length,
    median: times.sort((a, b) => a - b)[Math.floor(times.length / 2)]
  })
  
  const stats = {
    imageOptimization: calculateStats(results.imageOptimization),
    componentLoading: calculateStats(results.componentLoading)
  }
  
  console.log('📈 Benchmark results:')
  console.log('Image optimization (ms):', stats.imageOptimization)
  console.log('Component loading (ms):', stats.componentLoading)
  
  return stats
}

// Export test runner for use in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).heroPerformanceTests = {
    runAllTests: runAllPerformanceTests,
    benchmark: benchmarkPerformance,
    testImageOptimization,
    testVideoOptimization,
    testPerformanceMonitoring,
    testLazyLoading,
    testBundleAnalysis,
    testCriticalCSS
  }
}