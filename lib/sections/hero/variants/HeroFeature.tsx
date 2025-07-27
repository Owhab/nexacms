'use client'

import React from 'react'
import {
    HeroFeatureProps,
    HeroVariant,
    FeatureItem
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
import Image from 'next/image'

/**
 * Hero Feature Component
 * 
 * Feature-focused hero section with feature highlighting and icon integration.
 * Displays main content with a list of features in grid, list, or carousel layout.
 */
export function HeroFeature({
    id = 'hero-feature',
    variant = HeroVariant.FEATURE,
    theme = getDefaultThemeConfig(),
    responsive = getDefaultResponsiveConfig(),
    accessibility = getDefaultAccessibilityConfig(),
    title,
    subtitle,
    description,
    features = [],
    layout = 'grid',
    columns = 3,
    background,
    primaryButton,
    className = '',
    style = {},
    ...props
}: HeroFeatureProps) {
    // Prepare buttons array
    const buttons = [primaryButton].filter(Boolean)

    // Generate layout classes based on layout type and columns
    const getLayoutClasses = () => {
        switch (layout) {
            case 'grid':
                const gridCols = {
                    2: 'grid-cols-1 md:grid-cols-2',
                    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
                    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                }
                return `grid ${gridCols[columns]} gap-6`
            case 'list':
                return 'space-y-6'
            case 'carousel':
                return 'flex space-x-6 overflow-x-auto pb-4'
            default:
                return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        }
    }

    const layoutClasses = getLayoutClasses()

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
                maxWidth="6xl"
                padding="lg"
                textAlign="center"
                className="flex flex-col justify-center min-h-[600px]"
            >
                <div className="space-y-12">
                    {/* Header Content */}
                    <div className="space-y-6 text-center">
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
                                className="hero-description text-muted-foreground max-w-3xl mx-auto"
                            />
                        )}
                    </div>

                    {/* Features */}
                    {features.length > 0 && (
                        <div className="hero-features">
                            <div className={layoutClasses}>
                                {features.map((feature, index) => (
                                    <FeatureCard
                                        key={feature.id || index}
                                        feature={feature}
                                        layout={layout}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Primary Button */}
                    {buttons.length > 0 && (
                        <div className="hero-buttons pt-4">
                            <HeroButtonGroup
                                buttons={buttons}
                                spacing="md"
                                direction="row"
                                className="justify-center"
                            />
                        </div>
                    )}
                </div>
            </HeroContentContainer>
        </BaseHeroSection>
    )
}

/**
 * Feature Card Component
 * 
 * Individual feature item with icon, title, and description
 */
interface FeatureCardProps {
    feature: FeatureItem
    layout: 'grid' | 'list' | 'carousel'
}

function FeatureCard({ feature, layout }: FeatureCardProps) {
    const cardClasses = [
        'hero-feature-card',
        'bg-white/10',
        'backdrop-blur-sm',
        'rounded-lg',
        'p-6',
        'text-center',
        'transition-all',
        'duration-300',
        'hover:bg-white/20',
        'hover:transform',
        'hover:scale-105',
        layout === 'carousel' && 'flex-shrink-0 w-80'
    ].filter(Boolean).join(' ')

    const handleFeatureClick = () => {
        if (feature.link) {
            window.open(feature.link, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <div
            className={cardClasses}
            onClick={feature.link ? handleFeatureClick : undefined}
            role={feature.link ? 'button' : undefined}
            tabIndex={feature.link ? 0 : undefined}
            onKeyDown={(e) => {
                if (feature.link && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    handleFeatureClick()
                }
            }}
        >
            {/* Feature Icon */}
            {feature.icon && (
                <div className="feature-icon text-4xl mb-4 text-primary">
                    {feature.icon}
                </div>
            )}

            {/* Feature Image */}
            {feature.image && (
                <div className="feature-image mb-4">
                    <Image
                        src={feature.image.url}
                        alt={feature.image.alt || feature.title}
                        className="w-16 h-16 mx-auto rounded-lg object-cover"
                        width={feature.image.width || 64}
                        height={feature.image.height || 64}
                        loading="lazy"
                    />
                </div>
            )}

            {/* Feature Title */}
            {feature.title && (
                <h3 className="feature-title text-lg font-semibold mb-3 text-foreground">
                    {feature.title}
                </h3>
            )}

            {/* Feature Description */}
            {feature.description && (
                <p className="feature-description text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                </p>
            )}

            {/* Link Indicator */}
            {feature.link && (
                <div className="mt-4 text-primary text-sm font-medium">
                    Learn more →
                </div>
            )}
        </div>
    )
}

export default HeroFeature