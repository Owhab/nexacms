'use client'

import React from 'react'
import {
    HeroCenteredProps,
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
    HeroButton,
    HeroButtonGroup
} from '../previews/BaseHeroPreview'
import { useThemeIntegration, useResponsiveDesign } from '../hooks/useThemeIntegration'

/**
 * Hero Centered Component
 * 
 * Traditional centered hero section with title, subtitle, description, and call-to-action buttons.
 * Features enhanced theme integration with site configuration context and responsive design.
 */
export function HeroCentered({
    id = 'hero-centered',
    variant = HeroVariant.CENTERED,
    theme = getDefaultThemeConfig(),
    responsive = getDefaultResponsiveConfig(),
    accessibility = getDefaultAccessibilityConfig(),
    title,
    subtitle,
    description,
    primaryButton,
    secondaryButton,
    background,
    textAlign = 'center',
    className = '',
    style = {},
    ...props
}: HeroCenteredProps) {
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
    const buttons = [primaryButton, secondaryButton].filter(Boolean)

    // Generate text alignment classes with responsive support
    const textAlignClasses = {
        left: 'text-left md:text-left lg:text-left',
        center: 'text-center md:text-center lg:text-center',
        right: 'text-right md:text-right lg:text-right'
    }

    const contentAlignment = textAlignClasses[textAlign] || textAlignClasses.center

    // Enhanced container classes with theme integration
    const containerClasses = [
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'min-h-[500px]',
        'md:min-h-[600px]',
        'lg:min-h-[700px]',
        responsiveClasses.container,
        ...themeClasses.base
    ].filter(Boolean).join(' ')

    // Content wrapper classes with responsive spacing
    const contentClasses = [
        'space-y-6',
        'md:space-y-8',
        'lg:space-y-10',
        contentAlignment,
        responsiveClasses.spacing
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

            {/* Content Container with enhanced responsive design */}
            <HeroContentContainer
                maxWidth="4xl"
                padding="lg"
                textAlign={textAlign}
                className={containerClasses}
            >
                <div className={contentClasses}>
                    {/* Title with theme-aware styling and accessibility */}
                    {title && (
                        <HeroText
                            content={{
                                ...title,
                                tag: title.tag || 'h1'
                            }}
                            className={[
                                'hero-title',
                                'text-foreground',
                                responsiveClasses.typography,
                                ...themeClasses.base
                            ].join(' ')}
                        />
                    )}

                    {/* Subtitle with responsive typography */}
                    {subtitle && (
                        <HeroText
                            content={subtitle}
                            className={[
                                'hero-subtitle',
                                'text-muted-foreground',
                                'text-lg',
                                'md:text-xl',
                                'lg:text-2xl'
                            ].join(' ')}
                        />
                    )}

                    {/* Description with responsive constraints */}
                    {description && (
                        <HeroText
                            content={description}
                            className={[
                                'hero-description',
                                'text-muted-foreground',
                                'max-w-2xl',
                                'mx-auto',
                                'text-base',
                                'md:text-lg',
                                'lg:text-xl',
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
                                className="flex-wrap gap-4 md:gap-6"
                            />
                        </div>
                    )}
                </div>
            </HeroContentContainer>

            {/* Theme compatibility indicator (development only) */}
            {process.env.NODE_ENV === 'development' && !isThemeCompatible && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 text-xs rounded z-50">
                    Theme Compatibility Warning
                </div>
            )}
        </BaseHeroSection>
    )
}

export default HeroCentered