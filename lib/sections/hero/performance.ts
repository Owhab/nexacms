// Hero Section Performance Optimization Utilities

import { lazy, ComponentType } from 'react'
import { MediaConfig, HeroVariant } from './types'

// Code splitting for hero variant components
export const lazyLoadHeroVariant = (variant: HeroVariant): ComponentType<any> => {
  switch (variant) {
    case HeroVariant.CENTERED:
      return lazy(() => import('./variants/HeroCentered').then(m => ({ default: m.HeroCentered })))
    case HeroVariant.SPLIT_SCREEN:
      return lazy(() => import('./variants/HeroSplitScreen').then(m => ({ default: m.HeroSplitScreen })))
    case HeroVariant.VIDEO:
      return lazy(() => import('./variants/HeroVideo').then(m => ({ default: m.HeroVideo })))
    case HeroVariant.MINIMAL:
      return lazy(() => import('./variants/HeroMinimal').then(m => ({ default: m.HeroMinimal })))
    case HeroVariant.FEATURE:
      return lazy(() => import('./variants/HeroFeature').then(m => ({ default: m.HeroFeature })))
    case HeroVariant.TESTIMONIAL:
      return lazy(() => import('./variants/HeroTestimonial').then(m => ({ default: m.HeroTestimonial })))
    case HeroVariant.PRODUCT:
      return lazy(() => import('./variants/HeroProduct').then(m => ({ default: m.HeroProduct })))
    case HeroVariant.SERVICE:
      return lazy(() => import('./variants/HeroService').then(m => ({ default: m.HeroService })))
    case HeroVariant.CTA:
      return lazy(() => import('./variants/HeroCTA').then(m => ({ default: m.HeroCTA })))
    case HeroVariant.GALLERY:
      return lazy(() => import('./variants/HeroGallery').then(m => ({ default: m.HeroGallery })))
    default:
      return lazy(() => import('./variants/HeroCentered').then(m => ({ default: m.HeroCentered })))
  }
}

// Code splitting for hero editors
export const lazyLoadHeroEditor = (variant: HeroVariant): ComponentType<any> => {
  switch (variant) {
    case HeroVariant.CENTERED:
      return lazy(() => import('./editors/HeroCenteredEditor').then(m => ({ default: m.HeroCenteredEditor })))
    case HeroVariant.SPLIT_SCREEN:
      return lazy(() => import('./editors/HeroSplitScreenEditor').then(m => ({ default: m.HeroSplitScreenEditor })))
    case HeroVariant.VIDEO:
      return lazy(() => import('./editors/HeroVideoEditor').then(m => ({ default: m.HeroVideoEditor })))
    case HeroVariant.MINIMAL:
      return lazy(() => import('./editors/HeroMinimalEditor').then(m => ({ default: m.HeroMinimalEditor })))
    case HeroVariant.FEATURE:
      return lazy(() => import('./editors/HeroFeatureEditor').then(m => ({ default: m.HeroFeatureEditor })))
    case HeroVariant.TESTIMONIAL:
      return lazy(() => import('./editors/HeroTestimonialEditor').then(m => ({ default: m.HeroTestimonialEditor })))
    case HeroVariant.PRODUCT:
      return lazy(() => import('./editors/HeroProductEditor').then(m => ({ default: m.HeroProductEditor })))
    case HeroVariant.SERVICE:
      return lazy(() => import('./editors/HeroServiceEditor').then(m => ({ default: m.HeroServiceEditor })))
    case HeroVariant.CTA:
      return lazy(() => import('./editors/HeroCTAEditor').then(m => ({ default: m.HeroCTAEditor })))
    case HeroVariant.GALLERY:
      return lazy(() => import('./editors/HeroGalleryEditor').then(m => ({ default: m.HeroGalleryEditor })))
    default:
      return lazy(() => import('./editors/HeroCenteredEditor').then(m => ({ default: m.HeroCenteredEditor })))
  }
}

// Code splitting for hero previews
export const lazyLoadHeroPreview = (variant: HeroVariant): ComponentType<any> => {
  switch (variant) {
    case HeroVariant.CENTERED:
      return lazy(() => import('./previews/HeroCenteredPreview').then(m => ({ default: m.HeroCenteredPreview })))
    case HeroVariant.SPLIT_SCREEN:
      return lazy(() => import('./previews/HeroSplitScreenPreview').then(m => ({ default: m.HeroSplitScreenPreview })))
    case HeroVariant.VIDEO:
      return lazy(() => import('./previews/HeroVideoPreview').then(m => ({ default: m.HeroVideoPreview })))
    case HeroVariant.MINIMAL:
      return lazy(() => import('./previews/HeroMinimalPreview').then(m => ({ default: m.HeroMinimalPreview })))
    case HeroVariant.FEATURE:
      return lazy(() => import('./previews/HeroFeaturePreview').then(m => ({ default: m.HeroFeaturePreview })))
    case HeroVariant.TESTIMONIAL:
      return lazy(() => import('./previews/HeroTestimonialPreview').then(m => ({ default: m.HeroTestimonialPreview })))
    case HeroVariant.PRODUCT:
      return lazy(() => import('./previews/HeroProductPreview').then(m => ({ default: m.HeroProductPreview })))
    case HeroVariant.SERVICE:
      return lazy(() => import('./previews/HeroServicePreview').then(m => ({ default: m.HeroServicePreview })))
    case HeroVariant.CTA:
      return lazy(() => import('./previews/HeroCTAPreview').then(m => ({ default: m.HeroCTAPreview })))
    case HeroVariant.GALLERY:
      return lazy(() => import('./previews/HeroGalleryPreview').then(m => ({ default: m.HeroGalleryPreview })))
    default:
      return lazy(() => import('./previews/HeroCenteredPreview').then(m => ({ default: m.HeroCenteredPreview })))
  }
}

// Asset optimization utilities
export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  blur?: number
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
}

export function optimizeImageUrl(
  url: string, 
  options: ImageOptimizationOptions = {}
): string {
  // Skip optimization for external URLs or already optimized URLs
  if (!url || url.includes('://') || url.includes('?')) {
    return url
  }

  const params = new URLSearchParams()
  
  if (options.width) params.set('w', options.width.toString())
  if (options.height) params.set('h', options.height.toString())
  if (options.quality) params.set('q', options.quality.toString())
  if (options.format) params.set('f', options.format)
  if (options.blur) params.set('blur', options.blur.toString())
  if (options.fit) params.set('fit', options.fit)

  const queryString = params.toString()
  return queryString ? `${url}?${queryString}` : url
}

// Generate responsive image srcset
export function generateOptimizedImageSrcSet(
  url: string,
  breakpoints: number[] = [480, 768, 1024, 1280, 1536, 1920]
): string {
  return breakpoints
    .map(width => `${optimizeImageUrl(url, { width, format: 'webp' })} ${width}w`)
    .join(', ')
}

// Generate responsive image sizes
export function generateResponsiveImageSizes(
  breakpoints: { [key: string]: string } = {
    '(max-width: 480px)': '100vw',
    '(max-width: 768px)': '100vw',
    '(max-width: 1024px)': '50vw',
    '(max-width: 1280px)': '33vw',
    default: '25vw'
  }
): string {
  const entries = Object.entries(breakpoints)
  const mediaQueries = entries.slice(0, -1).map(([query, size]) => `${query} ${size}`)
  const defaultSize = entries[entries.length - 1][1]
  
  return [...mediaQueries, defaultSize].join(', ')
}

// WebP conversion utility
export function convertToWebP(url: string): string {
  if (!url || url.includes('://') || url.endsWith('.webp')) {
    return url
  }
  
  return optimizeImageUrl(url, { format: 'webp' })
}

// Lazy loading utilities
export interface LazyLoadOptions {
  rootMargin?: string
  threshold?: number
  fallbackSrc?: string
  onLoad?: () => void
  onError?: () => void
}

export function createLazyLoadObserver(options: LazyLoadOptions = {}) {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    onLoad,
    onError
  } = options

  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        const src = img.dataset.src
        
        if (src) {
          img.src = src
          img.onload = () => {
            img.classList.add('loaded')
            onLoad?.()
          }
          img.onerror = () => {
            if (options.fallbackSrc) {
              img.src = options.fallbackSrc
            }
            onError?.()
          }
          img.removeAttribute('data-src')
        }
      }
    })
  }, {
    rootMargin,
    threshold
  })
}

// Video optimization utilities
export interface VideoOptimizationOptions {
  preload?: 'none' | 'metadata' | 'auto'
  poster?: string
  quality?: 'low' | 'medium' | 'high'
  format?: 'mp4' | 'webm' | 'ogg'
}

export function optimizeVideoUrl(
  url: string,
  options: VideoOptimizationOptions = {}
): string {
  if (!url || url.includes('://')) {
    return url
  }

  const params = new URLSearchParams()
  
  if (options.quality) params.set('quality', options.quality)
  if (options.format) params.set('format', options.format)

  const queryString = params.toString()
  return queryString ? `${url}?${queryString}` : url
}

// Performance monitoring utilities
export interface HeroPerformanceMetrics {
  componentRenderTime: number
  imageLoadTime: number
  videoLoadTime: number
  bundleSize: number
  memoryUsage: number
}

export class HeroPerformanceMonitor {
  private metrics: Partial<HeroPerformanceMetrics> = {}
  private observers: PerformanceObserver[] = []

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initializeObservers()
    }
  }

  private initializeObservers() {
    // Monitor paint timing
    const paintObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.componentRenderTime = entry.startTime
        }
      })
    })
    paintObserver.observe({ entryTypes: ['paint'] })
    this.observers.push(paintObserver)

    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        const resourceEntry = entry as PerformanceResourceTiming
        if (entry.name.includes('hero') && resourceEntry.initiatorType === 'img') {
          this.metrics.imageLoadTime = entry.duration
        }
        if (entry.name.includes('hero') && resourceEntry.initiatorType === 'video') {
          this.metrics.videoLoadTime = entry.duration
        }
      })
    })
    resourceObserver.observe({ entryTypes: ['resource'] })
    this.observers.push(resourceObserver)
  }

  measureComponentRender<T>(component: string, fn: () => T): T {
    const startTime = performance.now()
    const result = fn()
    const endTime = performance.now()
    
    this.metrics.componentRenderTime = endTime - startTime
    
    // Log performance data
    if (process.env.NODE_ENV === 'development') {
      console.log(`Hero ${component} render time: ${endTime - startTime}ms`)
    }
    
    return result
  }

  measureAsyncOperation<T>(operation: string, promise: Promise<T>): Promise<T> {
    const startTime = performance.now()
    
    return promise.then((result) => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      if (operation.includes('image')) {
        this.metrics.imageLoadTime = duration
      } else if (operation.includes('video')) {
        this.metrics.videoLoadTime = duration
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Hero ${operation} time: ${duration}ms`)
      }
      
      return result
    })
  }

  getMetrics(): Partial<HeroPerformanceMetrics> {
    return { ...this.metrics }
  }

  getBundleSize(): Promise<number> {
    if (typeof window === 'undefined') {
      return Promise.resolve(0)
    }

    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        let totalSize = 0
        
        entries.forEach((entry) => {
          if (entry.name.includes('hero')) {
            totalSize += (entry as any).transferSize || 0
          }
        })
        
        this.metrics.bundleSize = totalSize
        resolve(totalSize)
        observer.disconnect()
      })
      
      observer.observe({ entryTypes: ['resource'] })
      
      // Fallback timeout
      setTimeout(() => {
        resolve(0)
        observer.disconnect()
      }, 5000)
    })
  }

  getMemoryUsage(): number {
    if (typeof window === 'undefined' || !(performance as any).memory) {
      return 0
    }

    const memory = (performance as any).memory
    this.metrics.memoryUsage = memory.usedJSHeapSize
    return memory.usedJSHeapSize
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Bundle size analysis utilities
export interface BundleSizeReport {
  totalSize: number
  gzippedSize: number
  components: Array<{
    name: string
    size: number
    percentage: number
  }>
}

export async function analyzeBundleSize(): Promise<BundleSizeReport> {
  if (typeof window === 'undefined') {
    return {
      totalSize: 0,
      gzippedSize: 0,
      components: []
    }
  }

  const entries = performance.getEntriesByType('resource')
  const heroEntries = entries.filter(entry => 
    entry.name.includes('hero') || 
    entry.name.includes('section')
  )

  let totalSize = 0
  const components: Array<{ name: string; size: number; percentage: number }> = []

  heroEntries.forEach((entry) => {
    const size = (entry as any).transferSize || 0
    totalSize += size
    
    components.push({
      name: entry.name.split('/').pop() || 'unknown',
      size,
      percentage: 0 // Will be calculated after total is known
    })
  })

  // Calculate percentages
  components.forEach(component => {
    component.percentage = totalSize > 0 ? (component.size / totalSize) * 100 : 0
  })

  return {
    totalSize,
    gzippedSize: totalSize * 0.7, // Estimate gzipped size
    components: components.sort((a, b) => b.size - a.size)
  }
}

// Asset preloading utilities
export function preloadCriticalAssets(assets: Array<{ url: string; type: 'image' | 'video' | 'font' }>) {
  if (typeof document === 'undefined') return

  assets.forEach(asset => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = asset.url
    
    switch (asset.type) {
      case 'image':
        link.as = 'image'
        break
      case 'video':
        link.as = 'video'
        break
      case 'font':
        link.as = 'font'
        link.crossOrigin = 'anonymous'
        break
    }
    
    document.head.appendChild(link)
  })
}

// Resource hints utilities
export function addResourceHints(urls: string[]) {
  if (typeof document === 'undefined') return

  urls.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = url
    document.head.appendChild(link)
  })
}

// Critical CSS extraction
export function extractCriticalCSS(heroVariant: HeroVariant): string {
  const criticalStyles: Record<HeroVariant, string> = {
    [HeroVariant.CENTERED]: `
      .hero-centered { display: flex; flex-direction: column; align-items: center; justify-content: center; }
      .hero-centered h1 { font-size: 2.5rem; font-weight: bold; }
      .hero-centered p { font-size: 1.125rem; }
    `,
    [HeroVariant.SPLIT_SCREEN]: `
      .hero-split-screen { display: grid; grid-template-columns: 1fr 1fr; }
      @media (max-width: 768px) { .hero-split-screen { grid-template-columns: 1fr; } }
    `,
    [HeroVariant.VIDEO]: `
      .hero-video { position: relative; overflow: hidden; }
      .hero-video video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
    `,
    [HeroVariant.MINIMAL]: `
      .hero-minimal { padding: 4rem 1rem; text-align: center; }
      .hero-minimal h1 { font-size: 3rem; font-weight: 300; }
    `,
    [HeroVariant.FEATURE]: `
      .hero-feature { display: flex; flex-direction: column; gap: 2rem; }
      .hero-feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
    `,
    [HeroVariant.TESTIMONIAL]: `
      .hero-testimonial { display: flex; align-items: center; gap: 2rem; }
      .hero-testimonial-quote { font-style: italic; font-size: 1.25rem; }
    `,
    [HeroVariant.PRODUCT]: `
      .hero-product { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
      .hero-product-gallery { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    `,
    [HeroVariant.SERVICE]: `
      .hero-service { text-align: center; padding: 3rem 1rem; }
      .hero-service-badges { display: flex; justify-content: center; gap: 1rem; margin-top: 2rem; }
    `,
    [HeroVariant.CTA]: `
      .hero-cta { text-align: center; padding: 4rem 1rem; }
      .hero-cta-buttons { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
    `,
    [HeroVariant.GALLERY]: `
      .hero-gallery { position: relative; }
      .hero-gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    `
  }

  return criticalStyles[heroVariant] || ''
}

// Performance optimization hooks
export function usePerformanceOptimization() {
  const monitor = new HeroPerformanceMonitor()

  const optimizeImage = (url: string, options?: ImageOptimizationOptions) => {
    return optimizeImageUrl(url, options)
  }

  const optimizeVideo = (url: string, options?: VideoOptimizationOptions) => {
    return optimizeVideoUrl(url, options)
  }

  const measureRender = <T>(component: string, fn: () => T): T => {
    return monitor.measureComponentRender(component, fn)
  }

  const measureAsync = <T>(operation: string, promise: Promise<T>): Promise<T> => {
    return monitor.measureAsyncOperation(operation, promise)
  }

  return {
    optimizeImage,
    optimizeVideo,
    measureRender,
    measureAsync,
    getMetrics: () => monitor.getMetrics(),
    cleanup: () => monitor.cleanup()
  }
}