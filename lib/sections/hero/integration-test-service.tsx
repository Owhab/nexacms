'use client'

import React from 'react'
import { HeroService } from './variants/HeroService'
import { HeroServiceEditor } from './editors/HeroServiceEditor'
import { HeroServicePreview } from './previews/HeroServicePreview'
import {
    HeroServiceProps,
    HeroVariant,
    ServiceItem,
    TrustBadge,
    TextContent,
    ButtonConfig,
    BackgroundConfig
} from './types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from './utils'

/**
 * Integration Test for Hero Service Variant
 * 
 * This component tests the complete integration of:
 * - HeroService component rendering
 * - HeroServiceEditor functionality
 * - HeroServicePreview display
 * - Service management features
 * - Trust badge functionality
 * - Contact integration
 */
export function HeroServiceIntegrationTest() {
    // Sample data for testing
    const mockServices: ServiceItem[] = [
        {
            id: 'service-1',
            title: 'Strategic Consulting',
            description: 'Expert business consulting to drive growth and innovation',
            icon: '💼',
            features: [
                'Market analysis and strategy',
                'Business process optimization',
                'Growth planning and execution',
                'Performance measurement'
            ],
            link: '/services/consulting'
        },
        {
            id: 'service-2',
            title: 'Custom Development',
            description: 'Tailored software solutions for your unique business needs',
            icon: '💻',
            image: {
                id: 'dev-service-img',
                url: '/assets/services/development.jpg',
                type: 'image',
                alt: 'Custom development service',
                objectFit: 'cover',
                loading: 'lazy'
            },
            features: [
                'Web application development',
                'Mobile app development',
                'API integration and development',
                'Database design and optimization'
            ],
            link: '/services/development'
        },
        {
            id: 'service-3',
            title: '24/7 Support',
            description: 'Round-the-clock technical support and maintenance',
            icon: '🛠️',
            features: [
                'Proactive monitoring',
                'Quick issue resolution',
                'Regular maintenance',
                'Performance optimization'
            ],
            link: '/services/support'
        }
    ]

    const mockTrustBadges: TrustBadge[] = [
        {
            id: 'badge-1',
            name: 'ISO 27001 Certified',
            image: {
                id: 'iso-badge',
                url: '/assets/badges/iso-27001.png',
                type: 'image',
                alt: 'ISO 27001 Certified badge',
                objectFit: 'contain',
                loading: 'lazy'
            },
            link: 'https://iso.org'
        },
        {
            id: 'badge-2',
            name: 'Google Cloud Partner',
            image: {
                id: 'gcp-badge',
                url: '/assets/badges/google-cloud-partner.png',
                type: 'image',
                alt: 'Google Cloud Partner badge',
                objectFit: 'contain',
                loading: 'lazy'
            },
            link: 'https://cloud.google.com'
        },
        {
            id: 'badge-3',
            name: 'AWS Advanced Partner',
            image: {
                id: 'aws-badge',
                url: '/assets/badges/aws-advanced-partner.png',
                type: 'image',
                alt: 'AWS Advanced Partner badge',
                objectFit: 'contain',
                loading: 'lazy'
            },
            link: 'https://aws.amazon.com'
        },
        {
            id: 'badge-4',
            name: 'Microsoft Gold Partner',
            image: {
                id: 'ms-badge',
                url: '/assets/badges/microsoft-gold-partner.png',
                type: 'image',
                alt: 'Microsoft Gold Partner badge',
                objectFit: 'contain',
                loading: 'lazy'
            },
            link: 'https://microsoft.com'
        }
    ]

    const mockTitle: TextContent = {
        text: 'Professional Services That Drive Results',
        tag: 'h1'
    }

    const mockSubtitle: TextContent = {
        text: 'Expert solutions tailored to your business needs',
        tag: 'h2'
    }

    const mockDescription: TextContent = {
        text: 'We provide comprehensive services designed to help your business grow and succeed in today\'s competitive market. Our team of experts brings years of experience and proven methodologies to deliver exceptional results.',
        tag: 'p'
    }

    const mockPrimaryButton: ButtonConfig = {
        text: 'Get Started Today',
        url: '/contact',
        style: 'primary',
        size: 'lg',
        iconPosition: 'right',
        target: '_self',
        ariaLabel: 'Get started with our services'
    }

    const mockContactButton: ButtonConfig = {
        text: 'Schedule Consultation',
        url: '/consultation',
        style: 'outline',
        size: 'lg',
        iconPosition: 'left',
        target: '_self',
        ariaLabel: 'Schedule a free consultation'
    }

    const mockBackground: BackgroundConfig = {
        type: 'gradient',
        gradient: {
            type: 'linear',
            direction: '135deg',
            colors: [
                { color: '#f8fafc', stop: 0 },
                { color: '#e2e8f0', stop: 100 }
            ]
        },
        overlay: {
            enabled: false,
            color: '#000000',
            opacity: 0.1
        }
    }

    // Test props for different scenarios
    const [currentProps, setCurrentProps] = React.useState<HeroServiceProps>({
        id: 'test-hero-service',
        variant: HeroVariant.SERVICE,
        theme: getDefaultThemeConfig(),
        responsive: getDefaultResponsiveConfig(),
        accessibility: getDefaultAccessibilityConfig(),
        title: mockTitle,
        subtitle: mockSubtitle,
        description: mockDescription,
        services: mockServices,
        trustBadges: mockTrustBadges,
        layout: 'grid',
        showTrustBadges: true,
        background: mockBackground,
        primaryButton: mockPrimaryButton,
        contactButton: mockContactButton
    })

    const [activeTest, setActiveTest] = React.useState<'component' | 'editor' | 'preview'>('component')

    // Test scenarios
    const testScenarios = [
        {
            name: 'Grid Layout with Trust Badges',
            props: { ...currentProps, layout: 'grid' as const, showTrustBadges: true }
        },
        {
            name: 'List Layout without Trust Badges',
            props: { ...currentProps, layout: 'list' as const, showTrustBadges: false }
        },
        {
            name: 'Minimal Services (No Features)',
            props: {
                ...currentProps,
                services: mockServices.map(service => ({
                    ...service,
                    features: undefined,
                    image: undefined
                }))
            }
        },
        {
            name: 'No Trust Badges',
            props: { ...currentProps, trustBadges: [], showTrustBadges: false }
        },
        {
            name: 'Single Button Only',
            props: { ...currentProps, contactButton: undefined }
        }
    ]

    const handlePropsChange = (updatedProps: Partial<HeroServiceProps>) => {
        setCurrentProps(prev => ({ ...prev, ...updatedProps }))
    }

    const handleSave = (props: HeroServiceProps) => {
        setCurrentProps(props)
        console.log('Service Hero Section Saved:', props)
    }

    const handleCancel = () => {
        console.log('Service Hero Section Edit Cancelled')
    }

    return (
        <div className="hero-service-integration-test p-8 space-y-8">
            <div className="test-header">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Hero Service Integration Test
                </h1>
                <p className="text-gray-600 mb-6">
                    Testing the complete Hero Service variant implementation including component rendering,
                    editor functionality, and preview capabilities.
                </p>

                {/* Test Mode Selector */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTest('component')}
                        className={`px-4 py-2 rounded-md font-medium ${
                            activeTest === 'component'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Component Test
                    </button>
                    <button
                        onClick={() => setActiveTest('editor')}
                        className={`px-4 py-2 rounded-md font-medium ${
                            activeTest === 'editor'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Editor Test
                    </button>
                    <button
                        onClick={() => setActiveTest('preview')}
                        className={`px-4 py-2 rounded-md font-medium ${
                            activeTest === 'preview'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Preview Test
                    </button>
                </div>

                {/* Test Scenarios */}
                <div className="test-scenarios mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Test Scenarios:</h3>
                    <div className="flex flex-wrap gap-2">
                        {testScenarios.map((scenario, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentProps(scenario.props)}
                                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                            >
                                {scenario.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Test Content */}
            <div className="test-content">
                {activeTest === 'component' && (
                    <div className="component-test">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Component Rendering Test
                        </h2>
                        <div className="border rounded-lg overflow-hidden">
                            <HeroService {...currentProps} />
                        </div>
                    </div>
                )}

                {activeTest === 'editor' && (
                    <div className="editor-test">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Editor Functionality Test
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="editor-panel">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Editor</h3>
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <HeroServiceEditor
                                        props={currentProps}
                                        onSave={handleSave}
                                        onCancel={handleCancel}
                                        onChange={handlePropsChange}
                                    />
                                </div>
                            </div>
                            <div className="preview-panel">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Live Preview</h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <HeroService {...currentProps} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTest === 'preview' && (
                    <div className="preview-test">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Preview Component Test
                        </h2>
                        <div className="space-y-6">
                            {/* Desktop Preview */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Desktop Preview</h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <HeroServicePreview
                                        {...currentProps}
                                        isPreview={true}
                                        previewMode="desktop"
                                    />
                                </div>
                            </div>

                            {/* Tablet Preview */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Tablet Preview</h3>
                                <div className="border rounded-lg overflow-hidden max-w-2xl mx-auto">
                                    <HeroServicePreview
                                        {...currentProps}
                                        isPreview={true}
                                        previewMode="tablet"
                                    />
                                </div>
                            </div>

                            {/* Mobile Preview */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Mobile Preview</h3>
                                <div className="border rounded-lg overflow-hidden max-w-sm mx-auto">
                                    <HeroServicePreview
                                        {...currentProps}
                                        isPreview={true}
                                        previewMode="mobile"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Debug Information */}
            <div className="debug-info mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Debug Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong>Services Count:</strong> {currentProps.services?.length || 0}
                    </div>
                    <div>
                        <strong>Trust Badges Count:</strong> {currentProps.trustBadges?.length || 0}
                    </div>
                    <div>
                        <strong>Layout:</strong> {currentProps.layout}
                    </div>
                    <div>
                        <strong>Show Trust Badges:</strong> {currentProps.showTrustBadges ? 'Yes' : 'No'}
                    </div>
                    <div>
                        <strong>Background Type:</strong> {currentProps.background?.type}
                    </div>
                    <div>
                        <strong>Has Primary Button:</strong> {currentProps.primaryButton ? 'Yes' : 'No'}
                    </div>
                    <div>
                        <strong>Has Contact Button:</strong> {currentProps.contactButton ? 'Yes' : 'No'}
                    </div>
                    <div>
                        <strong>Variant:</strong> {currentProps.variant}
                    </div>
                </div>
            </div>

            {/* Current Props JSON (for debugging) */}
            <details className="mt-4">
                <summary className="cursor-pointer text-gray-700 font-medium">
                    View Current Props (JSON)
                </summary>
                <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg overflow-auto text-xs">
                    {JSON.stringify(currentProps, null, 2)}
                </pre>
            </details>
        </div>
    )
}

export default HeroServiceIntegrationTest