'use client'

import React from 'react'
import {
    HeroPreviewProps,
    HeroGalleryProps,
    HeroVariant
} from '../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../utils'
import { BaseHeroPreview } from './BaseHeroPreview'
import { HeroGallery } from '../variants/HeroGallery'

/**
 * Hero Gallery Preview Component
 * 
 * Real-time preview for the gallery hero section variant with:
 * - Live updates during editing
 * - Responsive preview modes (mobile, tablet, desktop)
 * - Gallery layout visualization
 * - Lightbox and carousel functionality
 * - Performance optimization
 */
export function HeroGalleryPreview({
    isPreview = true,
    previewMode = 'desktop',
    ...props
}: HeroPreviewProps<HeroGalleryProps>) {
    // Generate sample gallery data if none provided
    const getSampleGallery = () => [
        {
            id: 'sample-1',
            image: {
                id: 'sample-image-1',
                url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                type: 'image' as const,
                alt: 'Beautiful mountain landscape',
                objectFit: 'cover' as const,
                loading: 'lazy' as const
            },
            caption: 'Stunning mountain vista at sunrise'
        },
        {
            id: 'sample-2',
            image: {
                id: 'sample-image-2',
                url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
                type: 'image' as const,
                alt: 'Forest path through tall trees',
                objectFit: 'cover' as const,
                loading: 'lazy' as const
            },
            caption: 'Peaceful forest trail'
        },
        {
            id: 'sample-3',
            image: {
                id: 'sample-image-3',
                url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                type: 'image' as const,
                alt: 'Ocean waves on sandy beach',
                objectFit: 'cover' as const,
                loading: 'lazy' as const
            },
            caption: 'Serene ocean coastline'
        },
        {
            id: 'sample-4',
            image: {
                id: 'sample-image-4',
                url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
                type: 'image' as const,
                alt: 'City skyline at night',
                objectFit: 'cover' as const,
                loading: 'lazy' as const
            },
            caption: 'Urban lights after dark'
        },
        {
            id: 'sample-5',
            image: {
                id: 'sample-image-5',
                url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                type: 'image' as const,
                alt: 'Desert landscape with cacti',
                objectFit: 'cover' as const,
                loading: 'lazy' as const
            },
            caption: 'Desert wilderness'
        },
        {
            id: 'sample-6',
            image: {
                id: 'sample-image-6',
                url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
                type: 'image' as const,
                alt: 'Snowy mountain peaks',
                objectFit: 'cover' as const,
                loading: 'lazy' as const
            },
            caption: 'Winter mountain peaks'
        }
    ]

    // Ensure we have default values for preview
    const previewProps: HeroGalleryProps = {
        id: props.id || 'hero-gallery-preview',
        variant: HeroVariant.GALLERY,
        theme: props.theme || getDefaultThemeConfig(),
        responsive: props.responsive || getDefaultResponsiveConfig(),
        accessibility: props.accessibility || getDefaultAccessibilityConfig(),
        title: props.title || {
            text: 'Our Photo Gallery',
            tag: 'h1'
        },
        subtitle: props.subtitle || {
            text: 'Explore our collection of stunning images showcasing the beauty of nature and urban landscapes.',
            tag: 'p'
        },
        gallery: (props.gallery && props.gallery.length > 0) ? props.gallery : getSampleGallery(),
        layout: props.layout || 'grid',
        columns: props.columns || 3,
        showCaptions: props.showCaptions !== undefined ? props.showCaptions : true,
        lightbox: props.lightbox !== undefined ? props.lightbox : true,
        autoplay: props.autoplay || false,
        autoplayInterval: props.autoplayInterval || 5000,
        background: props.background || {
            type: 'none'
        },
        primaryButton: props.primaryButton || {
            text: 'View All Photos',
            url: '#gallery',
            style: 'primary',
            size: 'lg',
            iconPosition: 'right',
            target: '_self'
        },
        className: props.className,
        style: props.style
    }

    return (
        <BaseHeroPreview
            {...previewProps}
            isPreview={isPreview}
            previewMode={previewMode}
            containerClassName="hero-gallery-preview"
            minHeight="600px"
        >
            <HeroGallery {...previewProps} />
        </BaseHeroPreview>
    )
}

/**
 * Standalone Preview Component (for use outside of editor)
 */
export function HeroGalleryStandalonePreview(props: HeroGalleryProps) {
    return (
        <HeroGalleryPreview
            {...props}
            isPreview={false}
        />
    )
}

export default HeroGalleryPreview