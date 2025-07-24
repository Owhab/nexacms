'use client'

import React, { useRef, useEffect, useState } from 'react'
import {
    HeroVideoProps,
    HeroVariant
} from '../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../utils'
import {
    BaseHeroSection,
    HeroContentContainer
} from '../base/BaseHeroSection'
import {
    HeroText,
    HeroButtonGroup
} from '../previews/BaseHeroPreview'
import Image from 'next/image'

/**
 * Hero Video Component
 * 
 * Full-screen video background hero section with overlay content.
 * Features video background with autoplay, loop, and mute controls,
 * overlay positioning, and performance optimizations.
 */
export function HeroVideo({
    id = 'hero-video',
    variant = HeroVariant.VIDEO,
    theme = getDefaultThemeConfig(),
    responsive = getDefaultResponsiveConfig(),
    accessibility = getDefaultAccessibilityConfig(),
    video,
    overlay,
    content,
    className = '',
    style = {},
    ...props
}: HeroVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isVideoLoaded, setIsVideoLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)

    // Handle video load events
    useEffect(() => {
        const videoElement = videoRef.current
        if (!videoElement) return

        const handleLoadedData = () => {
            setIsVideoLoaded(true)
            setHasError(false)
        }

        const handleError = () => {
            setHasError(true)
            setIsVideoLoaded(false)
        }

        videoElement.addEventListener('loadeddata', handleLoadedData)
        videoElement.addEventListener('error', handleError)

        return () => {
            videoElement.removeEventListener('loadeddata', handleLoadedData)
            videoElement.removeEventListener('error', handleError)
        }
    }, [video?.url])

    // Performance optimization: Pause video when not in viewport
    useEffect(() => {
        const videoElement = videoRef.current
        if (!videoElement || !video?.autoplay) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoElement.play().catch(() => {
                            // Autoplay failed, which is expected in some browsers
                        })
                    } else {
                        videoElement.pause()
                    }
                })
            },
            { threshold: 0.1 }
        )

        observer.observe(videoElement)

        return () => {
            observer.disconnect()
        }
    }, [video?.autoplay])

    // Generate content position classes
    const getContentPositionClasses = (position: string) => {
        switch (position) {
            case 'top-left':
                return 'items-start justify-start text-left'
            case 'top-right':
                return 'items-start justify-end text-right'
            case 'bottom-left':
                return 'items-end justify-start text-left'
            case 'bottom-right':
                return 'items-end justify-end text-right'
            case 'center':
            default:
                return 'items-center justify-center text-center'
        }
    }

    const contentPositionClasses = getContentPositionClasses(content.position)

    return (
        <BaseHeroSection
            id={id}
            variant={variant}
            theme={theme}
            responsive={responsive}
            accessibility={accessibility}
            className={className}
            style={style}
            {...props}
        >
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                {video?.url && (
                    <>
                        {/* Video Element */}
                        <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay={video.autoplay}
                            loop={video.loop}
                            muted={video.muted}
                            controls={video.controls}
                            poster={video.poster}
                            playsInline
                            preload="metadata"
                            aria-hidden="true"
                            style={{
                                objectFit: video.objectFit || 'cover'
                            }}
                        >
                            <source src={video.url} type="video/mp4" />
                            <source src={video.url.replace('.mp4', '.webm')} type="video/webm" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Fallback Image (shown while video loads or on error) */}
                        {(!isVideoLoaded || hasError) && video.poster && (
                            <Image
                                src={video.poster}
                                alt="Video background"
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{
                                    objectFit: video.objectFit || 'cover'
                                }}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Overlay */}
            {overlay?.enabled && (
                <div
                    className="absolute inset-0 z-5"
                    style={{
                        backgroundColor: overlay.color,
                        opacity: overlay.opacity
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Content Container */}
            <HeroContentContainer
                maxWidth="4xl"
                padding="lg"
                className={`relative z-10 flex min-h-[600px] ${contentPositionClasses}`}
            >
                <div className="space-y-6 max-w-2xl">
                    {/* Title */}
                    {content.title && (
                        <HeroText
                            content={content.title}
                            className="hero-title text-white drop-shadow-lg"
                        />
                    )}

                    {/* Subtitle */}
                    {content.subtitle && (
                        <HeroText
                            content={content.subtitle}
                            className="hero-subtitle text-white/90 drop-shadow-md"
                        />
                    )}

                    {/* Description */}
                    {content.description && (
                        <HeroText
                            content={content.description}
                            className="hero-description text-white/80 drop-shadow-md"
                        />
                    )}

                    {/* Buttons */}
                    {content.buttons && content.buttons.length > 0 && (
                        <div className="hero-buttons pt-4">
                            <HeroButtonGroup
                                buttons={content.buttons}
                                spacing="md"
                                direction="row"
                                className="flex-wrap drop-shadow-lg"
                            />
                        </div>
                    )}
                </div>
            </HeroContentContainer>

            {/* Video Controls Overlay (if controls are enabled) */}
            {video?.controls && isVideoLoaded && (
                <div className="absolute bottom-4 right-4 z-20">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => {
                                const videoElement = videoRef.current
                                if (videoElement) {
                                    if (videoElement.paused) {
                                        videoElement.play()
                                    } else {
                                        videoElement.pause()
                                    }
                                }
                            }}
                            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            aria-label="Play/Pause video"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button
                            onClick={() => {
                                const videoElement = videoRef.current
                                if (videoElement) {
                                    videoElement.muted = !videoElement.muted
                                }
                            }}
                            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            aria-label="Mute/Unmute video"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.824L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.824a1 1 0 011.617.824zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Loading Indicator */}
            {!isVideoLoaded && !hasError && video?.url && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/50">
                    <div className="flex items-center space-x-2 text-white">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span className="text-sm">Loading video...</span>
                    </div>
                </div>
            )}

            {/* Error State */}
            {hasError && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/80">
                    <div className="text-center text-white space-y-2">
                        <svg className="w-12 h-12 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm">Unable to load video</p>
                        {video?.poster && (
                            <p className="text-xs text-gray-300">Showing fallback image</p>
                        )}
                    </div>
                </div>
            )}
        </BaseHeroSection>
    )
}

export default HeroVideo