'use client'

import React from 'react'
import {
    HeroCTAProps,
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
 * Hero CTA Component
 * 
 * Conversion-focused hero section with prominent call-to-action elements.
 * Features emphasized action elements, urgency indicators, and benefit highlights.
 */
export function HeroCTA({
    id = 'hero-cta',
    variant = HeroVariant.CTA,
    theme = getDefaultThemeConfig(),
    responsive = getDefaultResponsiveConfig(),
    accessibility = getDefaultAccessibilityConfig(),
    title,
    subtitle,
    description,
    primaryButton,
    secondaryButton,
    urgencyText,
    benefits = [],
    background,
    layout = 'center',
    showBenefits = true,
    className = '',
    style = {},
    ...props
}: HeroCTAProps) {
    // Prepare buttons array for button group
    const buttons = [primaryButton, secondaryButton].filter(Boolean)

    // Layout classes based on layout type
    const layoutClasses = {
        center: 'text-center',
        split: 'text-left lg:text-center'
    }

    const contentAlignment = layoutClasses[layout] || 'text-center'

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
                maxWidth={layout === 'split' ? '6xl' : '4xl'}
                padding="xl"
                textAlign={layout === 'center' ? 'center' : 'left'}
                className="flex flex-col items-center justify-center min-h-[600px]"
            >
                <div className={`space-y-8 ${contentAlignment} ${layout === 'split' ? 'lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center lg:space-y-0' : ''}`}>
                    {/* Main Content */}
                    <div className={`space-y-6 ${layout === 'split' ? 'lg:order-1' : ''}`}>
                        {/* Urgency Text */}
                        {urgencyText && (
                            <div className="urgency-indicator">
                                <HeroText
                                    content={urgencyText}
                                    className="hero-urgency text-sm font-medium text-orange-600 bg-orange-50 px-4 py-2 rounded-full inline-block border border-orange-200"
                                />
                            </div>
                        )}

                        {/* Title */}
                        {title && (
                            <HeroText
                                content={title}
                                className="hero-title text-foreground font-bold"
                            />
                        )}

                        {/* Subtitle */}
                        {subtitle && (
                            <HeroText
                                content={subtitle}
                                className="hero-subtitle text-muted-foreground text-xl"
                            />
                        )}

                        {/* Description */}
                        {description && (
                            <HeroText
                                content={description}
                                className="hero-description text-muted-foreground max-w-2xl mx-auto"
                            />
                        )}

                        {/* Benefits List (for center layout or split layout left side) */}
                        {showBenefits && benefits && benefits.length > 0 && layout === 'center' && (
                            <div className="benefits-list">
                                <ul className="space-y-3 text-left max-w-md mx-auto">
                                    {benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                                                ✓
                                            </span>
                                            <span className="text-gray-700">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Buttons */}
                        {buttons.length > 0 && (
                            <div className="hero-buttons pt-4">
                                <HeroButtonGroup
                                    buttons={buttons}
                                    spacing="lg"
                                    direction="row"
                                    className="flex-wrap"
                                />
                            </div>
                        )}
                    </div>

                    {/* Benefits List (for split layout right side) */}
                    {showBenefits && benefits && benefits.length > 0 && layout === 'split' && (
                        <div className={`benefits-section ${layout === 'split' ? 'lg:order-2' : ''}`}>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                <h3 className="text-lg font-semibold text-foreground mb-6">
                                    Why Choose Us?
                                </h3>
                                <ul className="space-y-4">
                                    {benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                ✓
                                            </span>
                                            <span className="text-foreground font-medium">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Trust Indicators */}
                <div className="trust-indicators mt-12 pt-8 border-t border-white/20">
                    <p className="text-sm text-muted-foreground mb-4">
                        Trusted by thousands of customers worldwide
                    </p>
                    <div className="flex items-center justify-center space-x-8 opacity-60">
                        <div className="text-xs font-medium">⭐⭐⭐⭐⭐ 4.9/5</div>
                        <div className="text-xs font-medium">🔒 Secure</div>
                        <div className="text-xs font-medium">📞 24/7 Support</div>
                        <div className="text-xs font-medium">💰 Money Back</div>
                    </div>
                </div>
            </HeroContentContainer>
        </BaseHeroSection>
    )
}

export default HeroCTA