'use client'

import React from 'react'
import {
    HeroPreviewProps,
    HeroMinimalProps,
    HeroVariant
} from '../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../utils'
import { BaseHeroPreview } from './BaseHeroPreview'
import { HeroMinimal } from '../variants/HeroMinimal'

/**
 * Hero Minimal Preview Component
 * 
 * Real-time preview for the minimal hero section variant with:
 * - Live updates during editing
 * - Responsive preview modes (mobile, tablet, desktop)
 * - Theme integration
 * - Typography-focused minimal design
 * - Whitespace emphasis
 */
export function HeroMinimalPreview({
    isPreview = true,
    previewMode = 'desktop',
    ...props
}: HeroPreviewProps<HeroMinimalProps>) {
    // Ensure we have default values for preview
    const previewProps: HeroMinimalProps = {
        id: props.id || 'hero-minimal-preview',
        variant: HeroVariant.MINIMAL,
        theme: props.theme || getDefaultThemeConfig(),
        responsive: props.responsive || getDefaultResponsiveConfig(),
        accessibility: props.accessibility || getDefaultAccessibilityConfig(),
        title: props.title || {
            text: 'Simple. Clean. Effective.',
            tag: 'h1'
        },
        subtitle: props.subtitle || {
            text: 'Sometimes less is more',
            tag: 'p'
        },
        button: props.button || {
            text: 'Get Started',
            url: '#',
            style: 'primary',
            size: 'md',
            iconPosition: 'right',
            target: '_self'
        },
        background: props.background || {
            type: 'none',
            overlay: {
                enabled: false,
                color: '#ffffff',
                opacity: 0.8
            }
        },
        spacing: props.spacing || 'normal',
        className: props.className,
        style: props.style
    }

    return (
        <BaseHeroPreview
            {...previewProps}
            isPreview={isPreview}
            previewMode={previewMode}
            containerClassName="hero-minimal-preview"
            minHeight="400px"
        >
            <HeroMinimal {...previewProps} />
        </BaseHeroPreview>
    )
}

/**
 * Standalone Preview Component (for use outside of editor)
 */
export function HeroMinimalStandalonePreview(props: HeroMinimalProps) {
    return (
        <HeroMinimalPreview
            {...props}
            isPreview={false}
        />
    )
}

export default HeroMinimalPreview