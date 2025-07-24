'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  optimizeVideoUrl, 
  createLazyLoadObserver,
  VideoOptimizationOptions 
} from '../performance'
import Image from 'next/image'

interface LazyVideoProps {
  src: string
  poster?: string
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  preload?: 'none' | 'metadata' | 'auto'
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
  onPlay?: () => void
  onPause?: () => void
  optimization?: VideoOptimizationOptions
}

export function LazyVideo({
  src,
  poster,
  width,
  height,
  className = '',
  style = {},
  autoplay = false,
  loop = false,
  muted = true,
  controls = false,
  preload = 'none',
  priority = false,
  onLoad,
  onError,
  onPlay,
  onPause,
  optimization = {}
}: LazyVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSrc, setCurrentSrc] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (priority || !videoRef.current) {
      if (priority) {
        const optimizedSrc = optimizeVideoUrl(src, optimization)
        setCurrentSrc(optimizedSrc)
      }
      return
    }

    // Create lazy load observer for non-priority videos
    observerRef.current = createLazyLoadObserver({
      rootMargin: '100px', // Load videos earlier than images
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

    if (observerRef.current && videoRef.current) {
      // Set data-src for lazy loading
      const optimizedSrc = optimizeVideoUrl(src, optimization)
      videoRef.current.dataset.src = optimizedSrc
      
      observerRef.current.observe(videoRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [src, priority, optimization, onLoad, onError])

  const handleLoadedData = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setIsError(true)
    onError?.()
  }

  const handlePlay = () => {
    setIsPlaying(true)
    onPlay?.()
  }

  const handlePause = () => {
    setIsPlaying(false)
    onPause?.()
  }

  const handleCanPlay = () => {
    if (autoplay && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, which is expected in many browsers
        console.log('Autoplay prevented by browser')
      })
    }
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={priority ? currentSrc : undefined}
        poster={poster}
        width={width}
        height={height}
        className={`
          w-full h-full object-cover transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${isError ? 'opacity-50' : ''}
        `}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        controls={controls}
        preload={priority ? 'metadata' : preload}
        playsInline
        onLoadedData={handleLoadedData}
        onError={handleError}
        onPlay={handlePlay}
        onPause={handlePause}
        onCanPlay={handleCanPlay}
        aria-label={`Video content${muted ? ' (muted)' : ''}`}
      />
      
      {/* Loading state */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          {poster ? (
            <Image 
              src={poster} 
              alt="Video poster" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2" />
              <div className="text-sm text-gray-500">Loading video...</div>
            </div>
          )}
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">🎥</div>
            <div className="text-sm">Video failed to load</div>
            {poster && (
              <Image 
                src={poster} 
                alt="Video poster fallback" 
                className="mt-2 max-w-full max-h-32 object-cover rounded"
              />
            )}
          </div>
        </div>
      )}
      
      {/* Play/Pause overlay for background videos */}
      {!controls && isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => {
              if (videoRef.current) {
                if (isPlaying) {
                  videoRef.current.pause()
                } else {
                  videoRef.current.play()
                }
              }
            }}
            className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

// Video format support detection
export function getSupportedVideoFormat(): Promise<'webm' | 'mp4' | 'ogg'> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    
    if (video.canPlayType('video/webm; codecs="vp9"')) {
      resolve('webm')
    } else if (video.canPlayType('video/mp4; codecs="avc1.42E01E"')) {
      resolve('mp4')
    } else {
      resolve('ogg')
    }
  })
}

// Optimized video component with format detection
export function OptimizedVideo({
  src,
  className = '',
  priority = false,
  ...props
}: LazyVideoProps) {
  const [supportedFormat, setSupportedFormat] = useState<'webm' | 'mp4' | 'ogg' | null>(null)

  useEffect(() => {
    getSupportedVideoFormat().then(setSupportedFormat)
  }, [])

  const optimizedSrc = supportedFormat 
    ? optimizeVideoUrl(src, { 
        format: supportedFormat,
        ...props.optimization 
      })
    : src

  return (
    <LazyVideo
      {...props}
      src={optimizedSrc}
      className={className}
      priority={priority}
    />
  )
}