'use client'

import React from 'react'
import {
    HeroPreviewProps,
    HeroFeatureProps
} from '../types'
import { BaseHeroPreview } from './BaseHeroPreview'
import { HeroFeature } from '../variants/HeroFeature'

/**
 * Hero Feature Preview Component
 * 
 * Preview component for the feature hero section variant with:
 * - Real-time preview updates during editing
 * - Responsive preview modes (mobile, tablet, desktop)
 * - Dynamic feature display and layout options
 * - Interactive feature elements in preview mode
 */
export function HeroFeaturePreview({
    isPreview = true,
    previewMode = 'desktop',
    ...props
}: HeroPreviewProps<HeroFeatureProps>) {
    return (
        <BaseHeroPreview
            isPreview={isPreview}
            previewMode={previewMode}
            minHeight="500px"
            {...props}
        >
            <HeroFeature {...props} />
        </BaseHeroPreview>
    )
}

export default HeroFeaturePreview