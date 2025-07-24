'use client'

import React from 'react'
import {
    HeroServiceProps,
    HeroVariant,
    ServiceItem,
    TrustBadge
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
    HeroButtonGroup,
    HeroImage
} from '../previews/BaseHeroPreview'

/**
 * Hero Service Component
 * 
 * Service-oriented hero section with value proposition display and trust elements.
 * Displays service highlights, trust badges, and contact integration.
 */
export function HeroService({
    id = 'hero-service',
    variant = HeroVariant.SERVICE,
    theme = getDefaultThemeConfig(),
    responsive = getDefaultResponsiveConfig(),
    accessibility = getDefaultAccessibilityConfig(),
    title,
    subtitle,
    description,
    services = [],
    trustBadges = [],
    layout = 'grid',
    showTrustBadges = true,
    background,
    primaryButton,
    contactButton,
    className = '',
    style = {},
    ...props
}: HeroServiceProps) {
    // Prepare buttons array
    const buttons = [primaryButton, contactButton].filter(Boolean)

    // Get layout classes for services
    const getServicesLayoutClasses = () => {
        switch (layout) {
            case 'grid':
                return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            case 'list':
                return 'space-y-6'
            default:
                return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        }
    }

    const servicesLayoutClasses = getServicesLayoutClasses()

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
                maxWidth="7xl"
                padding="lg"
                textAlign="center"
                className="flex flex-col justify-center min-h-[600px]"
            >
                <div className="space-y-12">
                    {/* Header Content */}
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Title */}
                        {title && (
                            <HeroText
                                content={title}
                                className="hero-title text-4xl lg:text-5xl font-bold text-foreground leading-tight"
                            />
                        )}

                        {/* Subtitle */}
                        {subtitle && (
                            <HeroText
                                content={subtitle}
                                className="hero-subtitle text-xl lg:text-2xl text-muted-foreground leading-relaxed"
                            />
                        )}

                        {/* Description */}
                        {description && (
                            <HeroText
                                content={description}
                                className="hero-description text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto"
                            />
                        )}

                        {/* Action Buttons */}
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

                    {/* Services Section */}
                    {services && services.length > 0 && (
                        <div className="services-section">
                            <div className={servicesLayoutClasses}>
                                {services.map((service, index) => (
                                    <ServiceCard
                                        key={service.id || index}
                                        service={service}
                                        layout={layout}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Trust Badges Section */}
                    {showTrustBadges && trustBadges && trustBadges.length > 0 && (
                        <div className="trust-badges-section">
                            <div className="border-t pt-12">
                                <div className="text-center mb-8">
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        Trusted by Industry Leaders
                                    </p>
                                </div>
                                <TrustBadgesGrid badges={trustBadges} />
                            </div>
                        </div>
                    )}
                </div>
            </HeroContentContainer>
        </BaseHeroSection>
    )
}

/**
 * Service Card Component
 * 
 * Individual service display card
 */
interface ServiceCardProps {
    service: ServiceItem
    layout: 'grid' | 'list'
}

function ServiceCard({ service, layout }: ServiceCardProps) {
    const isListLayout = layout === 'list'

    return (
        <div className={`service-card bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow duration-200 ${
            isListLayout ? 'flex items-start space-x-6' : 'text-center'
        }`}>
            {/* Service Icon/Image */}
            {(service.icon || service.image) && (
                <div className={`service-media ${isListLayout ? 'flex-shrink-0' : 'mb-4'}`}>
                    {service.image ? (
                        <div className={`${isListLayout ? 'w-16 h-16' : 'w-20 h-20 mx-auto'} rounded-lg overflow-hidden bg-gray-100`}>
                            <HeroImage
                                media={service.image}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : service.icon ? (
                        <div className={`${isListLayout ? 'w-16 h-16' : 'w-20 h-20 mx-auto'} flex items-center justify-center bg-primary/10 rounded-lg`}>
                            <span className="text-2xl">{service.icon}</span>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Service Content */}
            <div className={`service-content ${isListLayout ? 'flex-1' : ''}`}>
                {/* Service Title */}
                <h3 className={`service-title text-xl font-semibold text-foreground mb-3 ${
                    isListLayout ? 'text-left' : 'text-center'
                }`}>
                    {service.title}
                </h3>

                {/* Service Description */}
                {service.description && (
                    <p className={`service-description text-muted-foreground leading-relaxed mb-4 ${
                        isListLayout ? 'text-left' : 'text-center'
                    }`}>
                        {service.description}
                    </p>
                )}

                {/* Service Features */}
                {service.features && service.features.length > 0 && (
                    <div className={`service-features mb-4 ${isListLayout ? 'text-left' : 'text-center'}`}>
                        <ul className={`space-y-2 ${isListLayout ? '' : 'inline-block text-left'}`}>
                            {service.features.map((feature, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                    <span className="text-primary mt-1 flex-shrink-0">✓</span>
                                    <span className="text-sm text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Service Link */}
                {service.link && (
                    <div className={`service-link ${isListLayout ? 'text-left' : 'text-center'}`}>
                        <a
                            href={service.link}
                            className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200"
                        >
                            Learn More
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}

/**
 * Trust Badges Grid Component
 * 
 * Display trust badges in a responsive grid
 */
interface TrustBadgesGridProps {
    badges: TrustBadge[]
}

function TrustBadgesGrid({ badges }: TrustBadgesGridProps) {
    if (!badges || badges.length === 0) return null

    return (
        <div className="trust-badges-grid">
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 hover:opacity-80 transition-opacity duration-200">
                {badges.map((badge, index) => (
                    <div key={badge.id || index} className="trust-badge">
                        {badge.link ? (
                            <a
                                href={badge.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block hover:scale-105 transition-transform duration-200"
                                aria-label={`Visit ${badge.name}`}
                            >
                                <TrustBadgeImage badge={badge} />
                            </a>
                        ) : (
                            <TrustBadgeImage badge={badge} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

/**
 * Trust Badge Image Component
 */
interface TrustBadgeImageProps {
    badge: TrustBadge
}

function TrustBadgeImage({ badge }: TrustBadgeImageProps) {
    return (
        <div className="trust-badge-image h-12 flex items-center justify-center">
            {badge.image ? (
                <HeroImage
                    media={badge.image}
                    className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-200"
                />
            ) : (
                <span className="text-muted-foreground font-medium text-sm">
                    {badge.name}
                </span>
            )}
        </div>
    )
}

export default HeroService