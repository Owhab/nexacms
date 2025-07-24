'use client'

import React from 'react'
import { HeroTestimonial } from './variants/HeroTestimonial'
import { HeroTestimonialEditor } from './editors/HeroTestimonialEditor'
import { HeroTestimonialPreview } from './previews/HeroTestimonialPreview'
import { HeroVariant, HeroTestimonialProps } from './types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from './utils'
import Image from 'next/image'

/**
 * Integration Test Component for Hero Testimonial
 * 
 * This component demonstrates the Hero Testimonial variant working with its editor and preview.
 * It can be used for testing and development purposes.
 */
export function HeroTestimonialIntegrationTest() {
    const [heroProps, setHeroProps] = React.useState<HeroTestimonialProps>({
        id: 'test-hero-testimonial',
        variant: HeroVariant.TESTIMONIAL,
        theme: getDefaultThemeConfig(),
        responsive: getDefaultResponsiveConfig(),
        accessibility: getDefaultAccessibilityConfig(),
        title: {
            text: 'What Our Customers Say',
            tag: 'h1'
        },
        subtitle: {
            text: 'Trusted by thousands of businesses worldwide',
            tag: 'h2'
        },
        testimonials: [
            {
                id: 'testimonial-1',
                quote: 'This product has completely transformed our business operations. The results exceeded our expectations.',
                author: 'Sarah Johnson',
                company: 'TechCorp Inc.',
                role: 'CEO',
                rating: 5,
                avatar: {
                    id: 'avatar-1',
                    url: '/assets/testimonials/sarah-johnson.jpg',
                    type: 'image',
                    alt: 'Sarah Johnson avatar',
                    objectFit: 'cover',
                    loading: 'lazy'
                }
            },
            {
                id: 'testimonial-2',
                quote: 'Outstanding service and incredible results. I would highly recommend this to anyone.',
                author: 'Michael Chen',
                company: 'Design Studio',
                role: 'Creative Director',
                rating: 5
            },
            {
                id: 'testimonial-3',
                quote: 'The best investment we have made for our company this year. Fantastic support team.',
                author: 'Emily Rodriguez',
                company: 'StartupXYZ',
                role: 'Founder',
                rating: 4,
                avatar: {
                    id: 'avatar-3',
                    url: '/assets/testimonials/emily-rodriguez.jpg',
                    type: 'image',
                    alt: 'Emily Rodriguez avatar',
                    objectFit: 'cover',
                    loading: 'lazy'
                }
            }
        ],
        layout: 'single',
        autoRotate: false,
        rotationInterval: 5000,
        showRatings: true,
        background: {
            type: 'gradient',
            gradient: {
                type: 'linear',
                direction: '135deg',
                colors: [
                    { color: '#667eea', stop: 0 },
                    { color: '#764ba2', stop: 100 }
                ]
            },
            overlay: {
                enabled: false,
                color: '#000000',
                opacity: 0.4
            }
        },
        primaryButton: {
            text: 'Get Started',
            url: '#signup',
            style: 'primary',
            size: 'lg',
            iconPosition: 'right',
            target: '_self'
        }
    })

    const [showEditor, setShowEditor] = React.useState(false)
    const [showPreview, setShowPreview] = React.useState(false)

    const handleSave = (newProps: HeroTestimonialProps) => {
        setHeroProps(newProps)
        setShowEditor(false)
        console.log('Hero Testimonial props saved:', newProps)
    }

    const handleCancel = () => {
        setShowEditor(false)
    }

    const handleLayoutChange = (layout: 'single' | 'carousel' | 'grid') => {
        setHeroProps(prev => ({ ...prev, layout }))
    }

    const handleAutoRotateToggle = () => {
        setHeroProps(prev => ({ ...prev, autoRotate: !prev.autoRotate }))
    }

    const handleRatingsToggle = () => {
        setHeroProps(prev => ({ ...prev, showRatings: !prev.showRatings }))
    }

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">Hero Testimonial Integration Test</h1>
                <p className="text-gray-600">
                    Test the Hero Testimonial component, editor, and preview functionality
                </p>
                
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setShowEditor(!showEditor)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {showEditor ? 'Hide Editor' : 'Show Editor'}
                    </button>
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                </div>

                {/* Quick Controls */}
                <div className="flex justify-center space-x-4 text-sm">
                    <div className="space-x-2">
                        <span>Layout:</span>
                        <button
                            onClick={() => handleLayoutChange('single')}
                            className={`px-2 py-1 rounded ${heroProps.layout === 'single' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                            Single
                        </button>
                        <button
                            onClick={() => handleLayoutChange('carousel')}
                            className={`px-2 py-1 rounded ${heroProps.layout === 'carousel' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                            Carousel
                        </button>
                        <button
                            onClick={() => handleLayoutChange('grid')}
                            className={`px-2 py-1 rounded ${heroProps.layout === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                            Grid
                        </button>
                    </div>
                    
                    <button
                        onClick={handleAutoRotateToggle}
                        className={`px-2 py-1 rounded ${heroProps.autoRotate ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                    >
                        Auto-rotate: {heroProps.autoRotate ? 'ON' : 'OFF'}
                    </button>
                    
                    <button
                        onClick={handleRatingsToggle}
                        className={`px-2 py-1 rounded ${heroProps.showRatings ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
                    >
                        Ratings: {heroProps.showRatings ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            {/* Hero Testimonial Component */}
            <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b">
                    <h2 className="font-semibold">Hero Testimonial Component</h2>
                    <p className="text-sm text-gray-600">
                        Layout: {heroProps.layout} | Auto-rotate: {heroProps.autoRotate ? 'Yes' : 'No'} | 
                        Ratings: {heroProps.showRatings ? 'Shown' : 'Hidden'} | 
                        Testimonials: {heroProps.testimonials.length}
                    </p>
                </div>
                <HeroTestimonial {...heroProps} />
            </div>

            {/* Editor */}
            {showEditor && (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 border-b">
                        <h2 className="font-semibold">Hero Testimonial Editor</h2>
                    </div>
                    <div className="p-4">
                        <HeroTestimonialEditor
                            props={heroProps}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            onChange={(partialProps) => {
                                setHeroProps(prev => ({ ...prev, ...partialProps }))
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Preview */}
            {showPreview && (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 border-b">
                        <h2 className="font-semibold">Hero Testimonial Preview</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <h3 className="font-medium mb-2">Desktop Preview</h3>
                            <div className="border rounded">
                                <HeroTestimonialPreview
                                    {...heroProps}
                                    isPreview={true}
                                    previewMode="desktop"
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Tablet Preview</h3>
                            <div className="border rounded max-w-2xl">
                                <HeroTestimonialPreview
                                    {...heroProps}
                                    isPreview={true}
                                    previewMode="tablet"
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Mobile Preview</h3>
                            <div className="border rounded max-w-sm">
                                <HeroTestimonialPreview
                                    {...heroProps}
                                    isPreview={true}
                                    previewMode="mobile"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Testimonials Management */}
            <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b">
                    <h2 className="font-semibold">Testimonials ({heroProps.testimonials.length})</h2>
                </div>
                <div className="p-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {heroProps.testimonials.map((testimonial, index) => (
                            <div key={testimonial.id} className="border rounded p-4 space-y-2">
                                <div className="flex items-center space-x-2">
                                    {testimonial.avatar && (
                                        <Image
                                            src={testimonial.avatar.url}
                                            alt={testimonial.avatar.alt || 'Testimonial avatar'}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    )}
                                    <div>
                                        <div className="font-medium text-sm">{testimonial.author}</div>
                                        {testimonial.company && (
                                            <div className="text-xs text-gray-500">
                                                {testimonial.role && `${testimonial.role} at `}{testimonial.company}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {testimonial.rating && (
                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <span
                                                key={i}
                                                className={`text-sm ${
                                                    i < testimonial.rating!
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                        <span className="text-xs text-gray-500">
                                            {testimonial.rating}/5
                                        </span>
                                    </div>
                                )}
                                
                                <blockquote className="text-sm italic text-gray-700">
                                    &quot;{testimonial.quote}&quot;
                                </blockquote>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Props Display */}
            <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b">
                    <h2 className="font-semibold">Current Props</h2>
                </div>
                <div className="p-4">
                    <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto max-h-96">
                        {JSON.stringify(heroProps, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    )
}

export default HeroTestimonialIntegrationTest