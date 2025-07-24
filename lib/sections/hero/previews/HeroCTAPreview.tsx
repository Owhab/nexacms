'use client'

import React from 'react'
import {
    HeroPreviewProps,
    HeroCTAProps,
    HeroVariant
} from '../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../utils'
import { BaseHeroPreview } from './BaseHeroPreview'
import { HeroCTA } from '../variants/HeroCTA'

/**
 * Hero CTA Preview Component
 * 
 * Real-time preview for the CTA hero section variant with:
 * - Live updates during editing
 * - Responsive preview modes (mobile, tablet, desktop)
 * - Conversion-focused design optimization
 * - A/B testing variant support
 * - Performance optimization for high-converting elements
 */
export function HeroCTAPreview({
    isPreview = true,
    previewMode = 'desktop',
    ...props
}: HeroPreviewProps<HeroCTAProps>) {
    // Ensure we have default values for preview
    const previewProps: HeroCTAProps = {
        id: props.id || 'hero-cta-preview',
        variant: HeroVariant.CTA,
        theme: props.theme || getDefaultThemeConfig(),
        responsive: props.responsive || getDefaultResponsiveConfig(),
        accessibility: props.accessibility || getDefaultAccessibilityConfig(),
        title: props.title || {
            text: 'Transform Your Business Today',
            tag: 'h1'
        },
        subtitle: props.subtitle || {
            text: 'Join thousands of successful companies',
            tag: 'h2'
        },
        description: props.description || {
            text: 'Get the tools and insights you need to grow your business faster than ever before.',
            tag: 'p'
        },
        primaryButton: props.primaryButton || {
            text: 'Start Free Trial',
            url: '#signup',
            style: 'primary',
            size: 'xl',
            iconPosition: 'right',
            target: '_self',
            ariaLabel: 'Start your free trial now'
        },
        secondaryButton: props.secondaryButton || {
            text: 'Watch Demo',
            url: '#demo',
            style: 'outline',
            size: 'lg',
            iconPosition: 'left',
            target: '_self',
            ariaLabel: 'Watch product demo'
        },
        urgencyText: props.urgencyText || {
            text: 'Limited Time: 50% Off First Month!',
            tag: 'span'
        },
        benefits: props.benefits || [
            'No setup fees or hidden costs',
            '24/7 customer support included',
            'Cancel anytime, no questions asked',
            'Results guaranteed in 30 days'
        ],
        background: props.background || {
            type: 'gradient',
            gradient: {
                type: 'linear',
                direction: '135deg',
                colors: [
                    { color: '#667eea', stop: 0 },
                    { color: '#764ba2', stop: 100 }
                ]
            },
            overlay: {
                enabled: true,
                color: '#000000',
                opacity: 0.3
            }
        },
        layout: props.layout || 'center',
        showBenefits: props.showBenefits !== undefined ? props.showBenefits : true,
        className: props.className,
        style: props.style
    }

    return (
        <BaseHeroPreview
            {...previewProps}
            isPreview={isPreview}
            previewMode={previewMode}
            containerClassName="hero-cta-preview"
            minHeight="600px"
        >
            <HeroCTA {...previewProps} />
            
            {/* Preview-specific enhancements */}
            {isPreview && (
                <>
                    {/* Conversion Rate Indicator */}
                    <div className="absolute top-4 left-4 z-20">
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            High Converting Design
                        </div>
                    </div>

                    {/* A/B Testing Indicator */}
                    {(props as any).abTesting?.enabled && (
                        <div className="absolute top-4 right-16 z-20">
                            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                A/B Test: Variant {(props as any).abTesting?.variant || 'A'}
                            </div>
                        </div>
                    )}

                    {/* CTA Performance Hints */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                        <div className="bg-black/80 text-white p-3 rounded-lg text-xs">
                            <div className="font-medium mb-1">💡 Conversion Tips:</div>
                            <div className="space-y-1 text-gray-300">
                                {previewProps.urgencyText && (
                                    <div>✅ Urgency text creates FOMO</div>
                                )}
                                {previewProps.benefits && previewProps.benefits.length > 0 && (
                                    <div>✅ Benefits list builds trust</div>
                                )}
                                {previewProps.primaryButton?.size === 'xl' && (
                                    <div>✅ Large CTA button improves clicks</div>
                                )}
                                {previewProps.layout === 'split' && (
                                    <div>✅ Split layout showcases benefits</div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </BaseHeroPreview>
    )
}

/**
 * Standalone Preview Component (for use outside of editor)
 */
export function HeroCTAStandalonePreview(props: HeroCTAProps) {
    return (
        <HeroCTAPreview
            {...props}
            isPreview={false}
        />
    )
}

/**
 * A/B Testing Preview Component
 * 
 * Shows different variants for A/B testing
 */
export function HeroCTAABTestPreview({
    variantA,
    variantB,
    activeVariant = 'A',
    ...commonProps
}: {
    variantA: Partial<HeroCTAProps>
    variantB: Partial<HeroCTAProps>
    activeVariant?: 'A' | 'B'
} & Partial<HeroCTAProps>) {
    const currentVariant = activeVariant === 'A' ? variantA : variantB

    const mergedProps: HeroCTAProps = {
        ...commonProps,
        ...currentVariant,
        id: `hero-cta-variant-${activeVariant.toLowerCase()}`,
        // Ensure required props have defaults
        variant: HeroVariant.CTA,
        theme: commonProps.theme || getDefaultThemeConfig(),
        responsive: commonProps.responsive || getDefaultResponsiveConfig(),
        accessibility: commonProps.accessibility || getDefaultAccessibilityConfig(),
        primaryButton: currentVariant.primaryButton || {
            text: 'Get Started',
            url: '#',
            style: 'primary',
            size: 'xl',
            iconPosition: 'right',
            target: '_self'
        },
        background: currentVariant.background || {
            type: 'gradient',
            gradient: {
                type: 'linear',
                direction: '135deg',
                colors: [
                    { color: '#667eea', stop: 0 },
                    { color: '#764ba2', stop: 100 }
                ]
            }
        },
        layout: currentVariant.layout || 'center',
        showBenefits: currentVariant.showBenefits !== undefined ? currentVariant.showBenefits : true
    } as HeroCTAProps

    return (
        <div className="ab-test-preview">
            {/* Variant Selector */}
            <div className="mb-4 flex justify-center space-x-2">
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                        activeVariant === 'A'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Variant A
                </button>
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                        activeVariant === 'B'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Variant B
                </button>
            </div>

            {/* Preview */}
            <HeroCTAPreview
                {...mergedProps}
                isPreview={true}
            />
        </div>
    )
}

export default HeroCTAPreview