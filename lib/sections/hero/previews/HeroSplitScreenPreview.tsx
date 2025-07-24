'use client'

import React from 'react'
import {
    HeroPreviewProps,
    HeroSplitScreenProps,
    HeroVariant
} from '../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../utils'
import { BaseHeroPreview } from './BaseHeroPreview'
import { HeroSplitScreen } from '../variants/HeroSplitScreen'

/**
 * Hero Split Screen Preview Component
 * 
 * Real-time preview for the split screen hero section variant with:
 * - Live updates during editing
 * - Responsive preview modes (mobile, tablet, desktop)
 * - Layout direction and media type support
 * - Theme integration
 * - Performance optimization
 */
export function HeroSplitScreenPreview({
    isPreview = true,
    previewMode = 'desktop',
    ...props
}: HeroPreviewProps<HeroSplitScreenProps>) {
    // Ensure we have default values for preview
    const previewProps: HeroSplitScreenProps = {
        id: props.id || 'hero-split-screen-preview',
        variant: HeroVariant.SPLIT_SCREEN,
        theme: props.theme || getDefaultThemeConfig(),
        responsive: props.responsive || getDefaultResponsiveConfig(),
        accessibility: props.accessibility || getDefaultAccessibilityConfig(),
        content: props.content || {
            title: {
                text: 'Innovative Solutions',
                tag: 'h1'
            },
            subtitle: {
                text: 'Transform Your Business',
                tag: 'h2'
            },
            description: {
                text: 'Discover how our cutting-edge technology can revolutionize your workflow and drive unprecedented growth.',
                tag: 'p'
            },
            buttons: [
                {
                    text: 'Start Free Trial',
                    url: '#',
                    style: 'primary',
                    size: 'lg',
                    iconPosition: 'right',
                    target: '_self'
                }
            ]
        },
        media: props.media || {
            id: 'hero-media',
            url: '/assets/hero/hero-image.jpg',
            type: 'image',
            alt: 'Hero image showcasing our innovative solutions',
            objectFit: 'cover',
            loading: 'eager'
        },
        layout: props.layout || 'left',
        contentAlignment: props.contentAlignment || 'center',
        mediaAlignment: props.mediaAlignment || 'center',
        background: props.background || {
            type: 'color',
            color: '#ffffff'
        },
        className: props.className,
        style: props.style
    }

    return (
        <BaseHeroPreview
            {...previewProps}
            isPreview={isPreview}
            previewMode={previewMode}
            containerClassName="hero-split-screen-preview"
            minHeight="600px"
        >
            <HeroSplitScreen {...previewProps} />
        </BaseHeroPreview>
    )
}

/**
 * Standalone Preview Component (for use outside of editor)
 */
export function HeroSplitScreenStandalonePreview(props: HeroSplitScreenProps) {
    return (
        <HeroSplitScreenPreview
            {...props}
            isPreview={false}
        />
    )
}

export default HeroSplitScreenPreview