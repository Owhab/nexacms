'use client'

import React, { useState, useEffect } from 'react'
import {
    HeroTestimonialProps,
    HeroVariant,
    TestimonialItem
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
    HeroButtonGroup
} from '../previews/BaseHeroPreview'
import Image from 'next/image'

/**
 * Hero Testimonial Component
 * 
 * Testimonial-integrated hero section with social proof and customer testimonials.
 * Displays main content with testimonials in single, carousel, or grid layout.
 */
export function HeroTestimonial({
    id = 'hero-testimonial',
    variant = HeroVariant.TESTIMONIAL,
    theme = getDefaultThemeConfig(),
    responsive = getDefaultResponsiveConfig(),
    accessibility = getDefaultAccessibilityConfig(),
    title,
    subtitle,
    testimonials = [],
    layout = 'single',
    autoRotate = false,
    rotationInterval = 5000,
    showRatings = true,
    background,
    primaryButton,
    className = '',
    style = {},
    ...props
}: HeroTestimonialProps) {
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)

    // Auto-rotation effect
    useEffect(() => {
        if (autoRotate && testimonials.length > 1) {
            const interval = setInterval(() => {
                setCurrentTestimonialIndex((prev) => 
                    (prev + 1) % testimonials.length
                )
            }, rotationInterval)

            return () => clearInterval(interval)
        }
    }, [autoRotate, rotationInterval, testimonials.length])

    // Prepare buttons array
    const buttons = [primaryButton].filter(Boolean)

    // Get layout classes based on layout type
    const getLayoutClasses = () => {
        switch (layout) {
            case 'single':
                return 'flex justify-center'
            case 'carousel':
                return 'relative'
            case 'grid':
                return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            default:
                return 'flex justify-center'
        }
    }

    const layoutClasses = getLayoutClasses()

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
                maxWidth="6xl"
                padding="lg"
                textAlign="center"
                className="flex flex-col justify-center min-h-[600px]"
            >
                <div className="space-y-12">
                    {/* Header Content */}
                    <div className="space-y-6 text-center">
                        {/* Title */}
                        {title && (
                            <HeroText
                                content={title}
                                className="hero-title text-foreground"
                            />
                        )}

                        {/* Subtitle */}
                        {subtitle && (
                            <HeroText
                                content={subtitle}
                                className="hero-subtitle text-muted-foreground"
                            />
                        )}
                    </div>

                    {/* Testimonials */}
                    {testimonials.length > 0 && (
                        <div className="hero-testimonials">
                            <div className={layoutClasses}>
                                {layout === 'single' && (
                                    <TestimonialCard
                                        testimonial={testimonials[currentTestimonialIndex]}
                                        showRating={showRatings}
                                        layout={layout}
                                    />
                                )}

                                {layout === 'carousel' && (
                                    <TestimonialCarousel
                                        testimonials={testimonials}
                                        currentIndex={currentTestimonialIndex}
                                        onIndexChange={setCurrentTestimonialIndex}
                                        showRatings={showRatings}
                                        autoRotate={autoRotate}
                                    />
                                )}

                                {layout === 'grid' && testimonials.map((testimonial, index) => (
                                    <TestimonialCard
                                        key={testimonial.id || index}
                                        testimonial={testimonial}
                                        showRating={showRatings}
                                        layout={layout}
                                    />
                                ))}
                            </div>

                            {/* Navigation dots for single/carousel layout */}
                            {(layout === 'single' || layout === 'carousel') && testimonials.length > 1 && (
                                <div className="flex justify-center space-x-2 mt-8">
                                    {testimonials.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentTestimonialIndex(index)}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                index === currentTestimonialIndex
                                                    ? 'bg-primary scale-110'
                                                    : 'bg-white/30 hover:bg-white/50'
                                            }`}
                                            aria-label={`Go to testimonial ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Primary Button */}
                    {buttons.length > 0 && (
                        <div className="hero-buttons pt-4">
                            <HeroButtonGroup
                                buttons={buttons}
                                spacing="md"
                                direction="row"
                                className="justify-center"
                            />
                        </div>
                    )}
                </div>
            </HeroContentContainer>
        </BaseHeroSection>
    )
}

/**
 * Testimonial Card Component
 * 
 * Individual testimonial item with quote, author, company, and rating
 */
interface TestimonialCardProps {
    testimonial: TestimonialItem
    showRating: boolean
    layout: 'single' | 'carousel' | 'grid'
}

function TestimonialCard({ testimonial, showRating, layout }: TestimonialCardProps) {
    const cardClasses = [
        'hero-testimonial-card',
        'bg-white/10',
        'backdrop-blur-sm',
        'rounded-lg',
        'p-8',
        'text-center',
        'transition-all',
        'duration-300',
        'hover:bg-white/20',
        layout === 'single' ? 'max-w-4xl' : 'max-w-md',
        layout === 'grid' && 'hover:transform hover:scale-105'
    ].filter(Boolean).join(' ')

    return (
        <div className={cardClasses}>
            {/* Quote */}
            <div className="testimonial-quote mb-6">
                <div className="text-primary text-4xl mb-4">&quot;</div>
                <blockquote className="text-lg text-foreground leading-relaxed italic">
                    {testimonial.quote}
                </blockquote>
            </div>

            {/* Rating */}
            {showRating && testimonial.rating && (
                <div className="testimonial-rating mb-6">
                    <div className="flex justify-center space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                            <span
                                key={i}
                                className={`text-xl ${
                                    i < testimonial.rating!
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                }`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Author Info */}
            <div className="testimonial-author">
                {/* Avatar */}
                {testimonial.avatar && (
                    <div className="author-avatar mb-4">
                        <Image
                            src={testimonial.avatar.url}
                            alt={testimonial.avatar.alt || `${testimonial.author} avatar`}
                            className="w-16 h-16 mx-auto rounded-full object-cover border-2 border-white/20"
                            width={testimonial.avatar.width || 64}
                            height={testimonial.avatar.height || 64}
                            loading="lazy"
                        />
                    </div>
                )}

                {/* Author Name */}
                <div className="author-name text-lg font-semibold text-foreground mb-1">
                    {testimonial.author}
                </div>

                {/* Role and Company */}
                {(testimonial.role || testimonial.company) && (
                    <div className="author-details text-sm text-muted-foreground">
                        {testimonial.role && testimonial.company ? (
                            <span>{testimonial.role} at {testimonial.company}</span>
                        ) : (
                            <span>{testimonial.role || testimonial.company}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

/**
 * Testimonial Carousel Component
 * 
 * Carousel layout for testimonials with navigation controls
 */
interface TestimonialCarouselProps {
    testimonials: TestimonialItem[]
    currentIndex: number
    onIndexChange: (index: number) => void
    showRatings: boolean
    autoRotate: boolean
}

function TestimonialCarousel({
    testimonials,
    currentIndex,
    onIndexChange,
    showRatings,
    autoRotate
}: TestimonialCarouselProps) {
    const goToPrevious = () => {
        onIndexChange(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)
    }

    const goToNext = () => {
        onIndexChange((currentIndex + 1) % testimonials.length)
    }

    return (
        <div className="testimonial-carousel relative max-w-4xl mx-auto">
            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-300 z-10"
                        aria-label="Previous testimonial"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-300 z-10"
                        aria-label="Next testimonial"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Current Testimonial */}
            <TestimonialCard
                testimonial={testimonials[currentIndex]}
                showRating={showRatings}
                layout="carousel"
            />

            {/* Auto-rotate indicator */}
            {autoRotate && testimonials.length > 1 && (
                <div className="absolute top-4 right-4 text-white/60 text-sm">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                        <span>Auto</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HeroTestimonial