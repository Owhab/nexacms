'use client'

import React from 'react'
import {
    HeroPreviewProps,
    HeroTestimonialProps
} from '../types'
import { BaseHeroPreview } from './BaseHeroPreview'
import { HeroTestimonial } from '../variants/HeroTestimonial'

/**
 * Hero Testimonial Preview Component
 * 
 * Preview component for the testimonial hero section variant with:
 * - Real-time preview updates during editing
 * - Responsive preview modes (mobile, tablet, desktop)
 * - Testimonial display and customer photos
 * - Interactive testimonial rotation in preview mode
 */
export function HeroTestimonialPreview({
    isPreview = true,
    previewMode = 'desktop',
    ...props
}: HeroPreviewProps<HeroTestimonialProps>) {
    return (
        <BaseHeroPreview
            isPreview={isPreview}
            previewMode={previewMode}
            minHeight="500px"
            {...props}
        >
            <HeroTestimonial {...props} />
        </BaseHeroPreview>
    )
}

export default HeroTestimonialPreview