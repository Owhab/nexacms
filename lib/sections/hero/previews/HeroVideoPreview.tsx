'use client'

import React from 'react'
import {
    HeroPreviewProps,
    HeroVideoProps
} from '../types'
import { BaseHeroPreview } from './BaseHeroPreview'
import { HeroVideo } from '../variants/HeroVideo'

/**
 * Hero Video Preview Component
 * 
 * Preview component for the video hero section variant with:
 * - Real-time video background preview
 * - Overlay positioning and styling
 * - Content positioning preview
 * - Video controls preview
 * - Responsive preview modes
 * - Performance optimizations for preview mode
 */
export function HeroVideoPreview({
    isPreview = true,
    previewMode = 'desktop',
    ...props
}: HeroPreviewProps<HeroVideoProps>) {
    // Create optimized props for preview mode
    const previewProps: HeroVideoProps = {
        ...props,
        // Optimize video settings for preview
        video: props.video ? {
            ...props.video,
            // Disable autoplay in preview to avoid performance issues
            autoplay: false,
            // Enable controls in preview for testing
            controls: true,
            // Ensure muted for preview
            muted: true,
            // Use poster as fallback more aggressively in preview
            loading: 'lazy'
        } : props.video,
        // Ensure content has default values for preview
        content: {
            title: props.content?.title || {
                text: 'Video Hero Title',
                tag: 'h1'
            },
            subtitle: props.content?.subtitle,
            description: props.content?.description,
            buttons: props.content?.buttons || [],
            position: props.content?.position || 'center'
        },
        // Ensure overlay has default values
        overlay: {
            enabled: props.overlay?.enabled ?? true,
            color: props.overlay?.color || '#000000',
            opacity: props.overlay?.opacity ?? 0.4
        }
    }

    return (
        <BaseHeroPreview
            {...previewProps}
            isPreview={isPreview}
            previewMode={previewMode}
            minHeight="400px"
            containerClassName="hero-video-preview"
        >
            <HeroVideo {...previewProps} />
        </BaseHeroPreview>
    )
}

export default HeroVideoPreview