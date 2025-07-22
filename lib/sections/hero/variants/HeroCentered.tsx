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

/**
 * Hero Centered Component
 * 
 * Traditional centered hero section with title, subtitle, description, and call-to-action buttons.
 * Features centered layout with optional background treatments and theme integration.
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
    // Prepare buttons array for button group
    const buttons = [primaryButton, secondaryButton].filter(Boolean)

    // Generate text alignment classes
    const textAlignClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }

    const contentAlignment = textAlignClasses[textAlign] || 'text-center'

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
                maxWidth="4xl"
                padding="lg"
                textAlign={textAlign}
                className="flex flex-col items-center justify-center min-h-[500px]"
            >
                <div className={`space-y-6 ${contentAlignment}`}>
                    {/* Title */}
                    {title && (
                        <HeroText
                            content={title}
                            className="hero-title text-foreground"
                        />
                    )}

                    {/* Subtitle */}
                    {subtitle && (
                        <HeroText
                            content={subtitle}
                            className="hero-subtitle text-muted-foreground"
                        />
                    )}

                    {/* Description */}
                    {description && (
                        <HeroText
                            content={description}
                            className="hero-description text-muted-foreground max-w-2xl mx-auto"
                        />
                    )}

                    {/* Buttons */}
                    {buttons.length > 0 && (
                        <div className="hero-buttons pt-4">
                            <HeroButtonGroup
                                buttons={buttons}
                                spacing="md"
                                direction="row"
                                className="flex-wrap"
                            />
                        </div>
                    )}
                </div>
            </HeroContentContainer>
        </BaseHeroSection>
    )
}

export default HeroCentered