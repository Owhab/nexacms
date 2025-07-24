'use client'

import React from 'react'
import {
    HeroPreviewProps,
    HeroProductProps
} from '../types'
import { BaseHeroPreview } from './BaseHeroPreview'
import { HeroProduct } from '../variants/HeroProduct'

/**
 * Hero Product Preview Component
 * 
 * Preview component for the product hero section variant with:
 * - Real-time preview updates during editing
 * - Responsive preview modes (mobile, tablet, desktop)
 * - Product gallery and feature highlighting
 * - E-commerce specific features display
 * - Interactive elements in preview mode
 */
export function HeroProductPreview({
    isPreview = true,
    previewMode = 'desktop',
    ...props
}: HeroPreviewProps<HeroProductProps>) {
    return (
        <BaseHeroPreview
            isPreview={isPreview}
            previewMode={previewMode}
            minHeight="600px"
            {...props}
        >
            <HeroProduct {...props} />
        </BaseHeroPreview>
    )
}

export default HeroProductPreview