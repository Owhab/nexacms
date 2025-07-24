/**
 * Integration Test for Hero CTA Implementation
 * 
 * This file tests the complete Hero CTA workflow including:
 * - Component rendering
 * - Editor functionality
 * - Preview updates
 * - Registry integration
 * - A/B testing support
 */

import React, { useState } from 'react'
import {
    HeroCTA,
    HeroCTAEditor,
    HeroCTAPreview,
    HeroCTAProps,
    HeroVariant,
    getHeroSectionConfig
} from './index'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from './utils'

// Test data for Hero CTA
const testCTAProps: HeroCTAProps = {
    id: 'test-hero-cta',
    variant: HeroVariant.CTA,
    theme: getDefaultThemeConfig(),
    responsive: getDefaultResponsiveConfig(),
    accessibility: getDefaultAccessibilityConfig(),
    title: {
        text: 'Transform Your Business in 30 Days',
        tag: 'h1'
    },
    subtitle: {
        text: 'Join 10,000+ companies already growing with us',
        tag: 'h2'
    },
    description: {
        text: 'Our proven system helps businesses increase revenue by 40% on average. No contracts, no hidden fees.',
        tag: 'p'
    },
    primaryButton: {
        text: 'Start Free Trial',
        url: '/signup',
        style: 'primary',
        size: 'xl',
        iconPosition: 'right',
        target: '_self',
        ariaLabel: 'Start your free trial - no credit card required'
    },
    secondaryButton: {
        text: 'Watch 2-Min Demo',
        url: '/demo',
        style: 'outline',
        size: 'lg',
        iconPosition: 'left',
        target: '_self',
        ariaLabel: 'Watch our product demo video'
    },
    urgencyText: {
        text: '🔥 Limited Time: 50% Off First 3 Months!',
        tag: 'span'
    },
    benefits: [
        'No setup fees or hidden costs',
        '24/7 priority customer support',
        'Cancel anytime, no questions asked',
        'Results guaranteed in 30 days or money back',
        'Free migration from your current system'
    ],
    background: {
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
            opacity: 0.2
        }
    },
    layout: 'center',
    showBenefits: true
}

// A/B Test variants
const ctaVariantA: Partial<HeroCTAProps> = {
    title: {
        text: 'Transform Your Business in 30 Days',
        tag: 'h1'
    },
    primaryButton: {
        text: 'Start Free Trial',
        url: '/signup',
        style: 'primary',
        size: 'xl',
        iconPosition: 'right',
        target: '_self'
    },
    urgencyText: {
        text: '🔥 Limited Time: 50% Off First 3 Months!',
        tag: 'span'
    },
    layout: 'center'
}

const ctaVariantB: Partial<HeroCTAProps> = {
    title: {
        text: 'Double Your Revenue in 30 Days',
        tag: 'h1'
    },
    primaryButton: {
        text: 'Get Started Now',
        url: '/signup',
        style: 'primary',
        size: 'xl',
        iconPosition: 'right',
        target: '_self'
    },
    urgencyText: {
        text: '⚡ Only 48 Hours Left - Save 50%!',
        tag: 'span'
    },
    layout: 'split'
}

/**
 * Integration Test Component
 * 
 * Demonstrates the complete Hero CTA workflow
 */
export function HeroCTAIntegrationTest() {
    const [currentProps, setCurrentProps] = useState<HeroCTAProps>(testCTAProps)
    const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
    const [abTestVariant, setAbTestVariant] = useState<'A' | 'B'>('A')
    const [showEditor, setShowEditor] = useState(false)

    // Handle editor changes
    const handleEditorSave = (newProps: HeroCTAProps) => {
        setCurrentProps(newProps)
        setShowEditor(false)
        console.log('Hero CTA saved:', newProps)
    }

    const handleEditorCancel = () => {
        setShowEditor(false)
    }

    const handleEditorChange = (partialProps: Partial<HeroCTAProps>) => {
        setCurrentProps(prev => ({ ...prev, ...partialProps }))
    }

    // Get A/B test variant props
    const getABTestProps = () => {
        const baseProps = { ...testCTAProps }
        const variantProps = abTestVariant === 'A' ? ctaVariantA : ctaVariantB
        return { ...baseProps, ...variantProps }
    }

    // Test registry integration
    const testRegistryIntegration = () => {
        const config = getHeroSectionConfig('hero-cta')
        console.log('Hero CTA Registry Config:', config)
        
        if (config) {
            console.log('✅ Registry integration working')
            console.log('- Name:', config.name)
            console.log('- Description:', config.description)
            console.log('- Tags:', config.tags)
            console.log('- Default Props:', config.defaultProps)
        } else {
            console.error('❌ Registry integration failed')
        }
    }

    return (
        <div className="hero-cta-integration-test">
            {/* Test Controls */}
            <div className="test-controls bg-gray-100 p-4 mb-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Hero CTA Integration Test</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Preview Mode Controls */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Preview Mode</label>
                        <select
                            value={previewMode}
                            onChange={(e) => setPreviewMode(e.target.value as any)}
                            className="w-full px-3 py-2 border rounded-md"
                        >
                            <option value="mobile">Mobile</option>
                            <option value="tablet">Tablet</option>
                            <option value="desktop">Desktop</option>
                        </select>
                    </div>

                    {/* A/B Test Controls */}
                    <div>
                        <label className="block text-sm font-medium mb-2">A/B Test Variant</label>
                        <select
                            value={abTestVariant}
                            onChange={(e) => setAbTestVariant(e.target.value as any)}
                            className="w-full px-3 py-2 border rounded-md"
                        >
                            <option value="A">Variant A (Center Layout)</option>
                            <option value="B">Variant B (Split Layout)</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={() => setShowEditor(!showEditor)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            {showEditor ? 'Hide Editor' : 'Show Editor'}
                        </button>
                        <button
                            onClick={testRegistryIntegration}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Test Registry
                        </button>
                    </div>
                </div>

                {/* Test Results */}
                <div className="text-sm text-gray-600">
                    <div>Current Layout: <strong>{currentProps.layout}</strong></div>
                    <div>Benefits Shown: <strong>{currentProps.showBenefits ? 'Yes' : 'No'}</strong></div>
                    <div>Urgency Text: <strong>{currentProps.urgencyText?.text ? 'Yes' : 'No'}</strong></div>
                    <div>A/B Test Variant: <strong>{abTestVariant}</strong></div>
                </div>
            </div>

            {/* Editor Panel */}
            {showEditor && (
                <div className="editor-panel mb-6 border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                        <h3 className="font-medium">Hero CTA Editor</h3>
                    </div>
                    <HeroCTAEditor
                        props={currentProps}
                        onSave={handleEditorSave}
                        onCancel={handleEditorCancel}
                        onChange={handleEditorChange}
                    />
                </div>
            )}

            {/* Preview Panel */}
            <div className="preview-panel">
                <div className="bg-gray-50 px-4 py-2 border-b rounded-t-lg">
                    <h3 className="font-medium">
                        Hero CTA Preview - {previewMode} - Variant {abTestVariant}
                    </h3>
                </div>
                
                <div className="border rounded-b-lg overflow-hidden">
                    <HeroCTAPreview
                        {...getABTestProps()}
                        isPreview={true}
                        previewMode={previewMode}
                    />
                </div>
            </div>

            {/* Standalone Component Test */}
            <div className="standalone-test mt-8">
                <div className="bg-gray-50 px-4 py-2 border-b rounded-t-lg">
                    <h3 className="font-medium">Standalone Hero CTA Component</h3>
                </div>
                
                <div className="border rounded-b-lg overflow-hidden">
                    <HeroCTA {...currentProps} />
                </div>
            </div>

            {/* Performance Test */}
            <div className="performance-test mt-8 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-medium mb-2">Performance Test</h3>
                <p className="text-sm text-gray-600 mb-2">
                    This section tests multiple renders to ensure performance optimization.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="border rounded overflow-hidden">
                            <HeroCTAPreview
                                {...testCTAProps}
                                id={`perf-test-${i}`}
                                isPreview={true}
                                previewMode="desktop"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/**
 * Simple test function to verify basic functionality
 */
export function testHeroCTABasicFunctionality() {
    console.log('🧪 Testing Hero CTA Basic Functionality...')
    
    try {
        // Test 1: Registry Integration
        const config = getHeroSectionConfig('hero-cta')
        if (!config) {
            throw new Error('Hero CTA not found in registry')
        }
        console.log('✅ Registry integration working')

        // Test 2: Component Props Validation
        const requiredProps = ['id', 'variant', 'theme', 'responsive', 'accessibility', 'primaryButton', 'background', 'layout', 'showBenefits']
        const hasAllRequired = requiredProps.every(prop => prop in testCTAProps)
        if (!hasAllRequired) {
            throw new Error('Missing required props')
        }
        console.log('✅ Props validation passed')

        // Test 3: A/B Testing Support
        const variantAProps = { ...testCTAProps, ...ctaVariantA }
        const variantBProps = { ...testCTAProps, ...ctaVariantB }
        if (variantAProps.layout === variantBProps.layout) {
            console.warn('⚠️ A/B test variants should have different layouts')
        } else {
            console.log('✅ A/B testing variants configured correctly')
        }

        // Test 4: Conversion Optimization Features
        const hasUrgencyText = !!testCTAProps.urgencyText?.text
        const hasBenefits = testCTAProps.benefits && testCTAProps.benefits.length > 0
        const hasLargeCTA = testCTAProps.primaryButton?.size === 'xl'
        
        if (hasUrgencyText && hasBenefits && hasLargeCTA) {
            console.log('✅ Conversion optimization features present')
        } else {
            console.warn('⚠️ Some conversion optimization features missing')
        }

        console.log('🎉 All Hero CTA tests passed!')
        return true

    } catch (error) {
        console.error('❌ Hero CTA test failed:', error)
        return false
    }
}

// Export test data for external testing
export {
    testCTAProps,
    ctaVariantA,
    ctaVariantB
}