'use client'

import React, { useState, useCallback } from 'react'
import {
    HeroGalleryProps,
    HeroVariant
} from '../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../utils'
import {
    BaseHeroSection,
    HeroBackground,
    HeroContentContainer
} from '../base/BaseHeroSection'
import {
    HeroText,
    HeroButton,
    HeroButtonGroup,
    HeroImage
} from '../previews/BaseHeroPreview'

/**
 * Hero Gallery Component
 * 
 * Visual storytelling hero section with image gallery, lightbox functionality,
 * and carousel navigation. Features multiple layout options and caption support.
 */
export function HeroGallery({
    id = 'hero-gallery',
    variant = HeroVariant.GALLERY,
    theme = getDefaultThemeConfig(),
    responsive = getDefaultResponsiveConfig(),
    accessibility = getDefaultAccessibilityConfig(),
    title,
    subtitle,
    gallery = [],
    layout = 'grid',
    columns = 3,
    showCaptions = true,
    lightbox = true,
    autoplay = false,
    autoplayInterval = 5000,
    background,
    primaryButton,
    className = '',
    style = {},
    ...props
}: HeroGalleryProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)
    const [lightboxImageIndex, setLightboxImageIndex] = useState(0)

    // Handle image click
    const handleImageClick = useCallback((index: number) => {
        if (lightbox) {
            setLightboxImageIndex(index)
            setIsLightboxOpen(true)
        }
    }, [lightbox])

    // Handle lightbox navigation
    const handleLightboxPrev = useCallback(() => {
        setLightboxImageIndex(prev =>
            prev > 0 ? prev - 1 : gallery.length - 1
        )
    }, [gallery.length])

    const handleLightboxNext = useCallback(() => {
        setLightboxImageIndex(prev =>
            prev < gallery.length - 1 ? prev + 1 : 0
        )
    }, [gallery.length])

    const handleLightboxClose = useCallback(() => {
        setIsLightboxOpen(false)
    }, [])

    // Handle carousel navigation
    const handleCarouselPrev = useCallback(() => {
        setCurrentImageIndex(prev =>
            prev > 0 ? prev - 1 : gallery.length - 1
        )
    }, [gallery.length])

    const handleCarouselNext = useCallback(() => {
        setCurrentImageIndex(prev =>
            prev < gallery.length - 1 ? prev + 1 : 0
        )
    }, [gallery.length])

    // Auto-advance carousel
    React.useEffect(() => {
        if (autoplay && layout === 'carousel' && gallery.length > 1) {
            const interval = setInterval(() => {
                handleCarouselNext()
            }, autoplayInterval)

            return () => clearInterval(interval)
        }
    }, [autoplay, layout, gallery.length, autoplayInterval, handleCarouselNext])

    // Generate layout classes
    const getLayoutClasses = () => {
        switch (layout) {
            case 'grid':
                return `grid grid-cols-1 md:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns} gap-4`
            case 'masonry':
                return 'columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4'
            case 'carousel':
                return 'relative'
            default:
                return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
        }
    }

    const renderGalleryGrid = () => (
        <div className={getLayoutClasses()}>
            {gallery.map((item, index) => (
                <div
                    key={item.id || index}
                    className={`gallery-item group cursor-pointer ${layout === 'masonry' ? 'break-inside-avoid mb-4' : ''}`}
                    onClick={() => handleImageClick(index)}
                >
                    <div className="relative overflow-hidden rounded-lg bg-gray-100">
                        <HeroImage
                            media={item.image}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Hover Overlay */}
                        {lightbox && (
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Caption */}
                    {showCaptions && item.caption && (
                        <div className="mt-2 text-sm text-gray-600">
                            {item.caption}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )

    const renderCarousel = () => {
        if (gallery.length === 0) return null

        const currentItem = gallery[currentImageIndex]

        return (
            <div className="relative">
                {/* Main Image */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <HeroImage
                        media={currentItem.image}
                        className="w-full h-full object-cover"
                        sizes="100vw"
                        priority
                    />

                    {/* Navigation Arrows */}
                    {gallery.length > 1 && (
                        <>
                            <button
                                onClick={handleCarouselPrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
                                aria-label="Previous image"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={handleCarouselNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
                                aria-label="Next image"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>

                {/* Caption */}
                {showCaptions && currentItem.caption && (
                    <div className="mt-4 text-center text-gray-600">
                        {currentItem.caption}
                    </div>
                )}

                {/* Thumbnails */}
                {gallery.length > 1 && (
                    <div className="mt-4 flex justify-center space-x-2 overflow-x-auto pb-2">
                        {gallery.map((item, index) => (
                            <button
                                key={item.id || index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === currentImageIndex
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <HeroImage
                                    media={item.image}
                                    className="w-full h-full object-cover"
                                    sizes="64px"
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* Progress Indicators */}
                {gallery.length > 1 && (
                    <div className="mt-4 flex justify-center space-x-2">
                        {gallery.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImageIndex
                                    ? 'bg-blue-500'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        )
    }

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
            {/* Background */}
            <HeroBackground background={background} />

            {/* Content Container */}
            <HeroContentContainer
                maxWidth="7xl"
                padding="lg"
                className="min-h-[600px]"
            >
                <div className="space-y-8">
                    {/* Header Content */}
                    {(title || subtitle) && (
                        <div className="text-center space-y-4">
                            {title && (
                                <HeroText
                                    content={title}
                                    className="hero-title text-foreground"
                                />
                            )}
                            {subtitle && (
                                <HeroText
                                    content={subtitle}
                                    className="hero-subtitle text-muted-foreground max-w-3xl mx-auto"
                                />
                            )}
                        </div>
                    )}

                    {/* Gallery */}
                    {gallery.length > 0 && (
                        <div className="gallery-container">
                            {layout === 'carousel' ? renderCarousel() : renderGalleryGrid()}
                        </div>
                    )}

                    {/* Call to Action */}
                    {primaryButton && (
                        <div className="text-center pt-8">
                            <HeroButton
                                button={primaryButton}
                                className="inline-flex"
                            />
                        </div>
                    )}
                </div>
            </HeroContentContainer>

            {/* Lightbox Modal */}
            {isLightboxOpen && lightbox && gallery.length > 0 && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-full">
                        {/* Close Button */}
                        <button
                            onClick={handleLightboxClose}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                            aria-label="Close lightbox"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Main Image */}
                        <div className="relative">
                            <HeroImage
                                media={gallery[lightboxImageIndex].image}
                                className="max-w-full max-h-[80vh] object-contain"
                                sizes="100vw"
                                priority
                            />

                            {/* Navigation */}
                            {gallery.length > 1 && (
                                <>
                                    <button
                                        onClick={handleLightboxPrev}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200"
                                        aria-label="Previous image"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleLightboxNext}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200"
                                        aria-label="Next image"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Caption */}
                        {showCaptions && gallery[lightboxImageIndex].caption && (
                            <div className="mt-4 text-center text-white">
                                {gallery[lightboxImageIndex].caption}
                            </div>
                        )}

                        {/* Counter */}
                        {gallery.length > 1 && (
                            <div className="mt-4 text-center text-white text-sm">
                                {lightboxImageIndex + 1} of {gallery.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </BaseHeroSection>
    )
}

export default HeroGallery