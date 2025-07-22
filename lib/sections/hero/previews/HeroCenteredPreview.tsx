'use client'

import React from 'react'
import {
    HeroPreviewProps,
    HeroCenteredProps,
    HeroVariant
} from '../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../utils'
import { BaseHeroPreview } from './BaseHeroPreview'
import { HeroCentered } from '../variants/HeroCentered'

/**
 * Hero Centered Preview Component
 * 
 * Real-time preview for the centered hero section variant with:
 * - Live updates during editing
 * - Responsive preview modes (mobile, tablet, desktop)
 * - Theme integration
 * - Performance optimization
 */
export function HeroCenteredPreview({
    isPreview = true,
    previewMode = 'desktop',
    ...props
}: HeroPreviewProps<HeroCenteredProps>) {
    // Ensure we have default values for preview
    const previewProps: HeroCenteredProps = {
        id: props.id || 'hero-centered-preview',
        variant: HeroVariant.CENTERED,
        theme: props.theme || getDefaultThemeConfig(),
        responsive: props.responsive || getDefaultResponsiveConfig(),
        accessibility: props.accessibility || getDefaultAccessibilityConfig(),
        title: props.title || {
            text: 'Welcome to Your Website',
            tag: 'h1'
        },
        subtitle: props.subtitle || {
            text: 'Build amazing experiences with our platform',
            tag: 'p'
        },
        description: props.description || {
            text: 'Discover the power of our innovative solutions designed to help you succeed.',
            tag: 'p'
        },
        primaryButton: props.primaryButton || {
            text: 'Get Started',
            url: '#',
            style: 'primary',
            size: 'lg',
            iconPosition: 'right',
            target: '_self'
        },
        secondaryButton: props.secondaryButton || {
            text: 'Learn More',
            url: '#',
            style: 'outline',
            size: 'lg',
            iconPosition: 'left',
            target: '_self'
        },
        background: props.background || {
            type: 'gradient',
            gradient: {
                type: 'linear',
                direction: '45deg',
                colors: [
                    { color: '#3b82f6', stop: 0 },
                    { color: '#8b5cf6', stop: 100 }
                ]
            },
            overlay: {
                enabled: false,
                color: '#000000',
                opacity: 0.4
            }
        },
        textAlign: props.textAlign || 'center',
        className: props.className,
        style: props.style
    }

    return (
        <BaseHeroPreview
            {...previewProps}
            isPreview={isPreview}
            previewMode={previewMode}
            containerClassName="hero-centered-preview"
            minHeight="500px"
        >
            <HeroCentered {...previewProps} />
        </BaseHeroPreview>
    )
}

/**
 * Standalone Preview Component (for use outside of editor)
 */
export function HeroCenteredStandalonePreview(props: HeroCenteredProps) {
    return (
        <HeroCenteredPreview
            {...props}
            isPreview={false}
        />
    )
}

export default HeroCenteredPreview