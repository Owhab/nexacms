'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  optimizeImageUrl, 
  generateResponsiveImageSrcSet, 
  generateResponsiveImageSizes,
  createLazyLoadObserver,
  ImageOptimizationOptions 
} from '../performance'



interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  placeholder?: string
  blurDataURL?: string
  priority?: boolean
  quality?: number
  sizes?: string
  onLoad?: () => void
  onError?: () => void
  optimization?: ImageOptimizationOptions
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  style = {},
  placeholder,
  blurDataURL,
  priority = false,
  quality = 75,
  sizes,
  onLoad,
  onError,
  optimization = {}
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(priority ? src : placeholder || blurDataURL || '')
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (priority || !imgRef.current) {
      return
    }

    // Create lazy load observer
    observerRef.current = createLazyLoadObserver({
      rootMargin: '50px',
      threshold: 0.1,
      onLoad: () => {
        setIsLoaded(true)
        onLoad?.()
      },
      onError: () => {
        setIsError(true)
        onError?.()
      }
    })

    if (observerRef.current && imgRef.current) {
      // Set data-src for lazy loading
      imgRef.current.dataset.src = optimizeImageUrl(src, {
        width,
        height,
        quality,
        format: 'webp',
        ...optimization
      })
      
      observerRef.current.observe(imgRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [src, width, height, quality, priority, optimization, onLoad, onError])

  // Handle priority images (load immediately)
  useEffect(() => {
    if (priority && src) {
      const optimizedSrc = optimizeImageUrl(src, {
        width,
        height,
        quality,
        format: 'webp',
        ...optimization
      })
      setCurrentSrc(optimizedSrc)
    }
  }, [src, width, height, quality, priority, optimization])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setIsError(true)
    if (placeholder) {
      setCurrentSrc(placeholder)
    }
    onError?.()
  }

  // Generate responsive attributes
  const srcSet = generateResponsiveImageSrcSet(src)
  const imageSizes = sizes || generateResponsiveImageSizes()

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <Image
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      <img
        ref={imgRef}
        src={currentSrc || ''}
        srcSet={priority ? srcSet : undefined}
        sizes={priority ? imageSizes : undefined}
        alt={alt}
        width={width}
        height={height}
        className={`
          w-full h-full object-cover transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${isError ? 'opacity-50' : ''}
        `}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
      
      {/* Loading state */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Image failed to load</div>
          </div>
        </div>
      )}
    </div>
  )
}

// WebP support detection
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new window.Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

// Responsive image component with automatic WebP detection
export function ResponsiveImage({
  src,
  alt,
  className = '',
  priority = false,
  ...props
}: LazyImageProps) {
  const [supportsWebPFormat, setSupportsWebPFormat] = useState<boolean | null>(null)

  useEffect(() => {
    supportsWebP().then(setSupportsWebPFormat)
  }, [])

  const optimizedSrc = supportsWebPFormat !== null 
    ? optimizeImageUrl(src, { 
        format: supportsWebPFormat ? 'webp' : 'jpeg',
        ...props.optimization 
      })
    : src

  return (
    <LazyImage
      {...props}
      src={optimizedSrc}
      alt={alt}
      className={className}
      priority={priority}
    />
  )
}