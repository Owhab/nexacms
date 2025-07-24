'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { 
  HeroPerformanceMonitor, 
  optimizeImageUrl, 
  optimizeVideoUrl,
  ImageOptimizationOptions,
  VideoOptimizationOptions,
  preloadCriticalAssets,
  addResourceHints
} from '../performance'
import { HeroVariant } from '../types'

export interface UsePerformanceOptimizationOptions {
  variant: HeroVariant
  enableMonitoring?: boolean
  preloadAssets?: Array<{ url: string; type: 'image' | 'video' | 'font' }>
  resourceHints?: string[]
}

export function usePerformanceOptimization({
  variant,
  enableMonitoring = true,
  preloadAssets = [],
  resourceHints = []
}: UsePerformanceOptimizationOptions) {
  const monitorRef = useRef<HeroPerformanceMonitor | null>(null)
  const [metrics, setMetrics] = useState<any>({})
  const [isOptimized, setIsOptimized] = useState(false)

  // Initialize performance monitor
  useEffect(() => {
    if (enableMonitoring && !monitorRef.current) {
      monitorRef.current = new HeroPerformanceMonitor()
    }

    return () => {
      if (monitorRef.current) {
        monitorRef.current.cleanup()
        monitorRef.current = null
      }
    }
  }, [enableMonitoring])

  // Preload critical assets
  useEffect(() => {
    if (preloadAssets.length > 0) {
      preloadCriticalAssets(preloadAssets)
    }
  }, [preloadAssets])

  // Add resource hints
  useEffect(() => {
    if (resourceHints.length > 0) {
      addResourceHints(resourceHints)
    }
  }, [resourceHints])

  // Optimize image with performance monitoring
  const optimizeImage = useCallback((
    url: string, 
    options?: ImageOptimizationOptions
  ): string => {
    if (!monitorRef.current) {
      return optimizeImageUrl(url, options)
    }

    return monitorRef.current.measureComponentRender(`optimize-image-${variant}`, () => {
      return optimizeImageUrl(url, options)
    })
  }, [variant])

  // Optimize video with performance monitoring
  const optimizeVideo = useCallback((
    url: string, 
    options?: VideoOptimizationOptions
  ): string => {
    if (!monitorRef.current) {
      return optimizeVideoUrl(url, options)
    }

    return monitorRef.current.measureComponentRender(`optimize-video-${variant}`, () => {
      return optimizeVideoUrl(url, options)
    })
  }, [variant])

  // Measure component render performance
  const measureRender = useCallback(<T>(
    componentName: string, 
    renderFn: () => T
  ): T => {
    if (!monitorRef.current) {
      return renderFn()
    }

    return monitorRef.current.measureComponentRender(`${variant}-${componentName}`, renderFn)
  }, [variant])

  // Measure async operations
  const measureAsync = useCallback(<T>(
    operationName: string, 
    promise: Promise<T>
  ): Promise<T> => {
    if (!monitorRef.current) {
      return promise
    }

    return monitorRef.current.measureAsyncOperation(`${variant}-${operationName}`, promise)
  }, [variant])

  // Get current performance metrics
  const getMetrics = useCallback(() => {
    if (!monitorRef.current) {
      return {}
    }

    const currentMetrics = monitorRef.current.getMetrics()
    setMetrics(currentMetrics)
    return currentMetrics
  }, [])

  // Mark optimization as complete
  const markOptimized = useCallback(() => {
    setIsOptimized(true)
  }, [])

  return {
    optimizeImage,
    optimizeVideo,
    measureRender,
    measureAsync,
    getMetrics,
    markOptimized,
    metrics,
    isOptimized
  }
}

// Hook for bundle size analysis
export function useBundleAnalysis() {
  const [bundleSize, setBundleSize] = useState<number>(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeBundleSize = useCallback(async () => {
    setIsAnalyzing(true)
    
    try {
      const monitor = new HeroPerformanceMonitor()
      const size = await monitor.getBundleSize()
      setBundleSize(size)
    } catch (error) {
      console.error('Failed to analyze bundle size:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  useEffect(() => {
    // Analyze bundle size on mount
    analyzeBundleSize()
  }, [analyzeBundleSize])

  return {
    bundleSize,
    isAnalyzing,
    analyzeBundleSize
  }
}

// Hook for memory usage monitoring
export function useMemoryMonitoring() {
  const [memoryUsage, setMemoryUsage] = useState<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const monitor = new HeroPerformanceMonitor()
    
    const updateMemoryUsage = () => {
      const usage = monitor.getMemoryUsage()
      setMemoryUsage(usage)
    }

    // Update memory usage every 5 seconds
    intervalRef.current = setInterval(updateMemoryUsage, 5000)
    updateMemoryUsage() // Initial measurement

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      monitor.cleanup()
    }
  }, [])

  return memoryUsage
}

// Hook for lazy loading intersection observer
export function useLazyLoading(options: {
  rootMargin?: string
  threshold?: number
  onIntersect?: () => void
} = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<HTMLElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const {
    rootMargin = '50px',
    threshold = 0.1,
    onIntersect
  } = options

  useEffect(() => {
    if (!elementRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isCurrentlyIntersecting = entry.isIntersecting
          setIsIntersecting(isCurrentlyIntersecting)
          
          if (isCurrentlyIntersecting && !hasIntersected) {
            setHasIntersected(true)
            onIntersect?.()
          }
        })
      },
      {
        rootMargin,
        threshold
      }
    )

    observerRef.current.observe(elementRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [rootMargin, threshold, onIntersect, hasIntersected])

  return {
    elementRef,
    isIntersecting,
    hasIntersected
  }
}

// Hook for critical CSS extraction
export function useCriticalCSS(variant: HeroVariant) {
  const [criticalCSS, setCriticalCSS] = useState<string>('')

  useEffect(() => {
    import('../performance').then(({ extractCriticalCSS }) => {
      const css = extractCriticalCSS(variant)
      setCriticalCSS(css)
    })
  }, [variant])

  // Inject critical CSS into document head
  useEffect(() => {
    if (!criticalCSS) return

    const styleElement = document.createElement('style')
    styleElement.textContent = criticalCSS
    styleElement.setAttribute('data-hero-critical-css', variant)
    document.head.appendChild(styleElement)

    return () => {
      const existingStyle = document.querySelector(`[data-hero-critical-css="${variant}"]`)
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
    }
  }, [criticalCSS, variant])

  return criticalCSS
}

// Hook for performance-aware component loading
export function usePerformantComponentLoading<T>(
  loadComponent: () => Promise<T>
) {
  const [component, setComponent] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadComponentCallback = useCallback(loadComponent, [loadComponent])

  useEffect(() => {
    let isMounted = true
    const monitor = new HeroPerformanceMonitor()

    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await monitor.measureAsyncOperation('component-load', loadComponentCallback())
        
        if (isMounted) {
          setComponent(result)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Component loading failed'))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
        monitor.cleanup()
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [loadComponentCallback])

  return { component, loading, error }
}