'use client'

import React from 'react'
import {
    HeroSplitScreenProps,
    HeroVariant
} from '../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../utils'
import {
    BaseHeroSection,
    HeroBackground
} from '../base/BaseHeroSection'
import {
    HeroText,
    HeroButtonGroup,
    HeroImage,
    HeroVideo
} from '../previews/BaseHeroPreview'
import { useThemeIntegration, useResponsiveDesign } from '../hooks/useThemeIntegration'

/**
 * Hero Split Screen Component
 * 
 * Two-column layout hero section with content on one side and media on the other.
 * Features enhanced theme integration with site configuration context and responsive design.
 */
export function HeroSplitScreen({
    id = 'hero-split-screen',
    variant = HeroVariant.SPLIT_SCREEN,
    theme = getDefaultThemeConfig(),
    responsive = getDefaultResponsiveConfig(),
    accessibility = getDefaultAccessibilityConfig(),
    content,
    media,
    layout = 'left',
    contentAlignment = 'center',
    mediaAlignment = 'center',
    background,
    className = '',
    style = {},
    ...props
}: HeroSplitScreenProps) {
    // Enhanced theme integration with site configuration
    const {
        theme: integratedTheme,
        cssVariables,
        themeClasses,
        isThemeCompatible
    } = useThemeIntegration(theme, responsive)

    // Enhanced responsive design utilities
    const {
        responsiveClasses,
        currentBreakpoint
    } = useResponsiveDesign(responsive)

    // Prepare buttons array for button group
    const buttons = content?.buttons?.filter(Boolean) || []

    // Generate layout classes based on content position with responsive support
    const layoutClasses = {
        left: 'lg:flex-row',      // Content left, media right
        right: 'lg:flex-row-reverse' // Content right, media left
    }

    // Generate alignment classes with enhanced responsive support
    const contentAlignmentClasses = {
        start: 'justify-start items-start text-left md:justify-start md:items-start md:text-left lg:justify-start lg:items-start lg:text-left',
        center: 'justify-center items-center text-center md:justify-center md:items-center md:text-center lg:justify-center lg:items-center lg:text-center',
        end: 'justify-end items-end text-right md:justify-end md:items-end md:text-right lg:justify-end lg:items-end lg:text-right'
    }

    const mediaAlignmentClasses = {
        start: 'justify-start items-start md:justify-start md:items-start lg:justify-start lg:items-start',
        center: 'justify-center items-center md:justify-center md:items-center lg:justify-center lg:items-center',
        end: 'justify-end items-end md:justify-end md:items-end lg:justify-end lg:items-end'
    }

    // Enhanced container classes with theme integration
    const containerClasses = [
        'flex',
        'flex-col',
        layoutClasses[layout],
        'min-h-[600px]',
        'md:min-h-[650px]',
        'lg:min-h-[500px]',
        responsiveClasses.container,
        ...themeClasses.base
    ].filter(Boolean).join(' ')

    // Enhanced content classes with responsive spacing
    const contentClasses = [
        'flex',
        'flex-col',
        'flex-1',
        'px-6',
        'py-12',
        'md:px-8',
        'md:py-16',
        'lg:px-12',
        'lg:py-20',
        contentAlignmentClasses[contentAlignment],
        responsiveClasses.spacing
    ].filter(Boolean).join(' ')

    // Enhanced media classes with responsive sizing
    const mediaClasses = [
        'flex',
        'flex-1',
        'relative',
        'min-h-[300px]',
        'md:min-h-[400px]',
        'lg:min-h-[500px]',
        mediaAlignmentClasses[mediaAlignment]
    ].filter(Boolean).join(' ')

    // Content wrapper classes with responsive constraints
    const contentWrapperClasses = [
        'space-y-4',
        'md:space-y-6',
        'lg:space-y-8',
        'max-w-sm',
        'md:max-w-md',
        'lg:max-w-lg'
    ].filter(Boolean).join(' ')

    return (
        <BaseHeroSection
            id={id}
            variant={variant}
            theme={integratedTheme}
            responsive={responsive}
            accessibility={accessibility}
            className={className}
            style={{ ...cssVariables, ...style }}
            {...props}
        >
            {/* Background with theme integration */}
            <HeroBackground background={background} />

            {/* Split Screen Container with enhanced responsive design */}
            <div className={containerClasses}>
                {/* Content Side with theme-aware styling */}
                <div className={contentClasses}>
                    <div className={contentWrapperClasses}>
                        {/* Title with responsive typography and accessibility */}
                        {content?.title && (
                            <HeroText
                                content={{
                                    ...content.title,
                                    tag: content.title.tag || 'h1'
                                }}
                                className={[
                                    'hero-title',
                                    'text-foreground',
                                    'text-2xl',
                                    'md:text-3xl',
                                    'lg:text-4xl',
                                    'font-bold',
                                    'leading-tight',
                                    ...themeClasses.base
                                ].join(' ')}
                            />
                        )}

                        {/* Subtitle with enhanced styling */}
                        {content?.subtitle && (
                            <HeroText
                                content={content.subtitle}
                                className={[
                                    'hero-subtitle',
                                    'text-muted-foreground',
                                    'text-lg',
                                    'md:text-xl',
                                    'lg:text-2xl',
                                    'font-medium'
                                ].join(' ')}
                            />
                        )}

                        {/* Description with responsive sizing */}
                        {content?.description && (
                            <HeroText
                                content={content.description}
                                className={[
                                    'hero-description',
                                    'text-muted-foreground',
                                    'text-base',
                                    'md:text-lg',
                                    'leading-relaxed'
                                ].join(' ')}
                            />
                        )}

                        {/* Buttons with enhanced spacing */}
                        {buttons.length > 0 && (
                            <div className="hero-buttons pt-4 md:pt-6 lg:pt-8">
                                <HeroButtonGroup
                                    buttons={buttons}
                                    spacing="md"
                                    direction="row"
                                    className="flex-wrap gap-3 md:gap-4"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Media Side with enhanced responsive handling */}
                <div className={mediaClasses}>
                    {media && (
                        <div className="w-full h-full relative overflow-hidden rounded-lg md:rounded-xl lg:rounded-none shadow-lg md:shadow-xl lg:shadow-none">
                            {media.type === 'image' ? (
                                <HeroImage
                                    media={media}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    priority={true}
                                />
                            ) : media.type === 'video' ? (
                                <HeroVideo
                                    media={media}
                                    className="w-full h-full object-cover"
                                    isBackground={false}
                                    hasSubtitles={!!(media as any).captionsUrl}
                                />
                            ) : null}
                        </div>
                    )}
                </div>
            </div>

            {/* Theme compatibility indicator (development only) */}
            {process.env.NODE_ENV === 'development' && !isThemeCompatible && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 text-xs rounded z-50">
                    Theme Compatibility Warning
                </div>
            )}
        </BaseHeroSection>
    )
}

export default HeroSplitScreen