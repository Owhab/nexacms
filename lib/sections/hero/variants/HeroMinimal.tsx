'use client'

import React from 'react'
import {
    HeroMinimalProps,
    HeroVariant
} from '../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../utils'
import {
    BaseHeroSection,
    HeroBackground,
    HeroContentContainer
} from '../base/BaseHeroSection'
import {
    HeroText,
    HeroButton
} from '../previews/BaseHeroPreview'

/**
 * Hero Minimal Component
 * 
 * Clean, typography-focused hero section with minimal elements and emphasis on whitespace.
 * Features simple centered text with subtle accents and minimal visual elements.
 */
export function HeroMinimal({
    id = 'hero-minimal',
    variant = HeroVariant.MINIMAL,
    theme = getDefaultThemeConfig(),
    responsive = getDefaultResponsiveConfig(),
    accessibility = getDefaultAccessibilityConfig(),
    title,
    subtitle,
    button,
    background,
    spacing = 'normal',
    className = '',
    style = {},
    ...props
}: HeroMinimalProps) {
    // Generate spacing classes based on spacing prop
    const spacingClasses = {
        compact: 'space-y-4',
        normal: 'space-y-6',
        spacious: 'space-y-8'
    }

    const contentSpacing = spacingClasses[spacing] || 'space-y-6'

    // Generate padding based on spacing
    const paddingClasses = {
        compact: 'py-12',
        normal: 'py-16',
        spacious: 'py-24'
    }

    const containerPadding = paddingClasses[spacing] || 'py-16'

    return (
        <BaseHeroSection
            id={id}
            variant={variant}
            theme={theme}
            responsive={responsive}
            accessibility={accessibility}
            className={className}
            style={style}
            {...props}
        >
            {/* Background */}
            <HeroBackground background={background} />

            {/* Content Container */}
            <HeroContentContainer
                maxWidth="2xl"
                textAlign="center"
                className={`flex flex-col items-center justify-center min-h-[400px] ${containerPadding}`}
            >
                <div className={`${contentSpacing} text-center max-w-xl mx-auto`}>
                    {/* Title */}
                    {title && (
                        <HeroText
                            content={title}
                            className="hero-title text-foreground font-light tracking-tight text-4xl md:text-5xl lg:text-6xl leading-tight"
                        />
                    )}

                    {/* Subtitle */}
                    {subtitle && (
                        <HeroText
                            content={subtitle}
                            className="hero-subtitle text-muted-foreground text-lg md:text-xl font-normal leading-relaxed"
                        />
                    )}

                    {/* Single CTA Button */}
                    {button && (
                        <div className="hero-button pt-2">
                            <HeroButton
                                button={button}
                                className="inline-flex items-center justify-center"
                            />
                        </div>
                    )}
                </div>
            </HeroContentContainer>
        </BaseHeroSection>
    )
}

export default HeroMinimal