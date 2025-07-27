'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MediaConfig } from '../types'

/**
 * Lazy image component props
 */
interface LazyImageProps {
    media: MediaConfig
    className?: string
    style?: React.CSSProperties
    fallbackSrc?: string
    placeholderSrc?: string
    onLoad?: () => void
    onError?: (error: Error) => void
    enableRetry?: boolean
    maxRetries?: number
    retryDelay?: number
    quality?: number
    sizes?: string
    priority?: boolean
}

/**
 * Image loading states
 */
type ImageLoadingState = 'idle' | 'loading' | 'loaded' | 'error' | 'retrying'

/**
 * Lazy loading image component with fallbacks and error handling
 */
export function LazyImage({
    media,
    className = '',
    style,
    fallbackSrc = '/assets/placeholders/image-placeholder.svg',
    placeholderSrc = '/assets/placeholders/image-loading.svg',
    onLoad,
    onError,
    enableRetry = true,
    maxRetries = 3,
    retryDelay = 1000,
    quality = 80,
    sizes = '100vw',
    priority = false
}: LazyImageProps) {
    const [loadingState, setLoadingState] = useState<ImageLoadingState>('idle')
    const [retryCount, setRetryCount] = useState(0)
    const [currentSrc, setCurrentSrc] = useState<string>('')
    const [isInView, setIsInView] = useState(priority)
    
    const imgRef = useRef<HTMLImageElement>(null)
    const observerRef = useRef<IntersectionObserver | null>(null)
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Generate optimized image URL
    const getOptimizedUrl = (url: string, width?: number) => {
        if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
            return url
        }

        // If it's already optimized or external, return as-is
        if (url.includes('?') || !url.startsWith('/')) {
            return url
        }

        const params = new URLSearchParams()
        if (width) params.set('w', width.toString())
        if (quality) params.set('q', quality.toString())
        params.set('f', 'webp')

        return `${url}?${params.toString()}`
    }

    // Generate responsive srcSet
    const generateSrcSet = (url: string) => {
        if (!url || url.startsWith('data:') || url.startsWith('blob:') || !url.startsWith('/')) {
            return undefined
        }

        const breakpoints = [480, 768, 1024, 1280, 1536, 1920]
        return breakpoints
            .map(width => `${getOptimizedUrl(url, width)} ${width}w`)
            .join(', ')
    }

    // Set up intersection observer for lazy loading
    useEffect(() => {
        if (priority || !imgRef.current) return

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const [entry] = entries
                if (entry.isIntersecting) {
                    setIsInView(true)
                    observerRef.current?.disconnect()
                }
            },
            {
                rootMargin: '50px'
            }
        )

        observerRef.current.observe(imgRef.current)

        return () => {
            observerRef.current?.disconnect()
        }
    }, [priority])

    // Handle image loading
    useEffect(() => {
        if (!isInView || !media.url) return

        setLoadingState('loading')
        setCurrentSrc(getOptimizedUrl(media.url))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInView, media.url, quality])

    // Handle image load success
    const handleLoad = () => {
        setLoadingState('loaded')
        setRetryCount(0)
        onLoad?.()
    }

    // Handle image load error
    const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const error = new Error(`Failed to load image: ${currentSrc}`)
        console.warn('Image load error:', error)

        if (enableRetry && retryCount < maxRetries) {
            setLoadingState('retrying')
            setRetryCount(prev => prev + 1)

            // Retry after delay
            retryTimeoutRef.current = setTimeout(() => {
                setLoadingState('loading')
                // Try with a different optimization or fallback to original
                const retryUrl = retryCount === 0 
                    ? media.url // Try original URL
                    : getOptimizedUrl(media.url, undefined) // Try without width optimization
                setCurrentSrc(retryUrl)
            }, retryDelay * (retryCount + 1)) // Exponential backoff
        } else {
            setLoadingState('error')
            setCurrentSrc(fallbackSrc)
            onError?.(error)
        }
    }

    // Cleanup retry timeout
    useEffect(() => {
        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current)
            }
        }
    }, [])

    // Determine what to show based on loading state
    const getImageSrc = () => {
        switch (loadingState) {
            case 'idle':
            case 'loading':
                return placeholderSrc
            case 'loaded':
                return currentSrc
            case 'error':
                return fallbackSrc
            case 'retrying':
                return placeholderSrc
            default:
                return placeholderSrc
        }
    }

    const getImageAlt = () => {
        if (loadingState === 'error') {
            return 'Image failed to load'
        }
        if (loadingState === 'loading' || loadingState === 'retrying') {
            return 'Loading image...'
        }
        return media.alt || 'Hero image'
    }

    const shouldShowRetryIndicator = loadingState === 'retrying' && retryCount > 0

    return (
        <div className={`relative ${className}`} style={style}>
            <img
                ref={imgRef}
                src={getImageSrc()}
                srcSet={loadingState === 'loaded' ? generateSrcSet(media.url) : undefined}
                sizes={sizes}
                alt={getImageAlt()}
                className={`
                    w-full h-full object-${media.objectFit || 'cover'}
                    transition-opacity duration-300
                    ${loadingState === 'loading' || loadingState === 'retrying' ? 'opacity-50' : 'opacity-100'}
                    ${loadingState === 'error' ? 'filter grayscale' : ''}
                `}
                loading={media.loading || 'lazy'}
                onLoad={handleLoad}
                onError={handleError}
                draggable={false}
            />

            {/* Loading indicator */}
            {(loadingState === 'loading' || loadingState === 'retrying') && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                        {shouldShowRetryIndicator && (
                            <span className="text-xs text-gray-600">
                                Retrying... ({retryCount}/{maxRetries})
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Error indicator */}
            {loadingState === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
                    <div className="text-center p-4">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-sm text-gray-600">Image unavailable</p>
                        {enableRetry && retryCount >= maxRetries && (
                            <button
                                onClick={() => {
                                    setRetryCount(0)
                                    setLoadingState('loading')
                                    setCurrentSrc(getOptimizedUrl(media.url))
                                }}
                                className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                                Try again
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

/**
 * Lazy video component with similar fallback behavior
 */
interface LazyVideoProps {
    media: MediaConfig & {
        autoplay?: boolean
        loop?: boolean
        muted?: boolean
        controls?: boolean
        poster?: string
    }
    className?: string
    style?: React.CSSProperties
    fallbackSrc?: string
    onLoad?: () => void
    onError?: (error: Error) => void
    enableRetry?: boolean
    maxRetries?: number
}

export function LazyVideo({
    media,
    className = '',
    style,
    fallbackSrc = '/assets/placeholders/video-placeholder.mp4',
    onLoad,
    onError,
    enableRetry = true,
    maxRetries = 2
}: LazyVideoProps) {
    const [loadingState, setLoadingState] = useState<ImageLoadingState>('idle')
    const [retryCount, setRetryCount] = useState(0)
    const [isInView, setIsInView] = useState(false)
    
    const videoRef = useRef<HTMLVideoElement>(null)
    const observerRef = useRef<IntersectionObserver | null>(null)

    // Set up intersection observer
    useEffect(() => {
        if (!videoRef.current) return

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const [entry] = entries
                if (entry.isIntersecting) {
                    setIsInView(true)
                    setLoadingState('loading')
                    observerRef.current?.disconnect()
                }
            },
            {
                rootMargin: '100px'
            }
        )

        observerRef.current.observe(videoRef.current)

        return () => {
            observerRef.current?.disconnect()
        }
    }, [])

    const handleLoad = () => {
        setLoadingState('loaded')
        setRetryCount(0)
        onLoad?.()
    }

    const handleError = () => {
        const error = new Error(`Failed to load video: ${media.url}`)
        console.warn('Video load error:', error)

        if (enableRetry && retryCount < maxRetries) {
            setLoadingState('retrying')
            setRetryCount(prev => prev + 1)
            
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.load()
                    setLoadingState('loading')
                }
            }, 2000)
        } else {
            setLoadingState('error')
            onError?.(error)
        }
    }

    const videoSrc = loadingState === 'error' ? fallbackSrc : media.url

    return (
        <div className={`relative ${className}`} style={style}>
            <video
                ref={videoRef}
                src={isInView ? videoSrc : undefined}
                poster={media.poster}
                autoPlay={media.autoplay}
                loop={media.loop}
                muted={media.muted}
                controls={media.controls}
                className={`
                    w-full h-full object-${media.objectFit || 'cover'}
                    ${loadingState === 'loading' || loadingState === 'retrying' ? 'opacity-50' : 'opacity-100'}
                    ${loadingState === 'error' ? 'filter grayscale' : ''}
                `}
                onLoadedData={handleLoad}
                onError={handleError}
                playsInline
            >
                <source src={videoSrc} type="video/mp4" />
                <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
                Your browser does not support the video tag.
            </video>

            {/* Loading indicator */}
            {(loadingState === 'loading' || loadingState === 'retrying') && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex flex-col items-center space-y-2 text-white">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <span className="text-sm">Loading video...</span>
                        {loadingState === 'retrying' && (
                            <span className="text-xs opacity-75">
                                Retrying... ({retryCount}/{maxRetries})
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Error indicator */}
            {loadingState === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="text-center p-4 text-white">
                        <svg
                            className="mx-auto h-12 w-12 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-sm">Video unavailable</p>
                        {enableRetry && (
                            <button
                                onClick={() => {
                                    setRetryCount(0)
                                    setLoadingState('loading')
                                    if (videoRef.current) {
                                        videoRef.current.load()
                                    }
                                }}
                                className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
                            >
                                Try again
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default LazyImage