'use client'

import React from 'react'
import {
    HeroPreviewProps,
    HeroServiceProps
} from '../types'
import { BaseHeroPreview } from './BaseHeroPreview'
import { HeroService } from '../variants/HeroService'

/**
 * Hero Service Preview Component
 * 
 * Preview component for the service hero section variant with:
 * - Real-time preview updates during editing
 * - Responsive preview modes (mobile, tablet, desktop)
 * - Service highlights and trust elements display
 * - Value proposition visualization
 * - Interactive elements in preview mode
 */
export function HeroServicePreview({
    isPreview = true,
    previewMode = 'desktop',
    ...props
}: HeroPreviewProps<HeroServiceProps>) {
    return (
        <BaseHeroPreview
            isPreview={isPreview}
            previewMode={previewMode}
            minHeight="600px"
            {...props}
        >
            <HeroService {...props} />
        </BaseHeroPreview>
    )
}

export default HeroServicePreview