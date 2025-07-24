'use client'

import React from 'react'
import { HeroProduct } from './variants/HeroProduct'
import { HeroProductEditor } from './editors/HeroProductEditor'
import { HeroProductPreview } from './previews/HeroProductPreview'
import { HeroVariant, HeroProductProps, ProductItem, MediaConfig, ButtonConfig, BackgroundConfig } from './types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from './utils'

/**
 * Integration Test Component for Hero Product
 * 
 * This component demonstrates the complete integration of:
 * - HeroProduct component
 * - HeroProductEditor component  
 * - HeroProductPreview component
 * - Product data management
 * - Real-time preview updates
 */
export function HeroProductIntegrationTest() {
    // Sample product data
    const sampleProduct: ProductItem = {
        id: 'sample-product',
        name: 'Premium Wireless Headphones',
        description: 'Experience crystal-clear audio with our premium wireless headphones featuring advanced noise cancellation and 30-hour battery life.',
        price: '199.99',
        originalPrice: '299.99',
        currency: '$',
        badge: 'Best Seller',
        images: [
            {
                id: 'headphones-main',
                url: '/assets/hero/headphones-main.jpg',
                type: 'image',
                alt: 'Premium Wireless Headphones - Main View',
                objectFit: 'cover',
                loading: 'eager'
            },
            {
                id: 'headphones-side',
                url: '/assets/hero/headphones-side.jpg',
                type: 'image',
                alt: 'Premium Wireless Headphones - Side View',
                objectFit: 'cover',
                loading: 'lazy'
            },
            {
                id: 'headphones-detail',
                url: '/assets/hero/headphones-detail.jpg',
                type: 'image',
                alt: 'Premium Wireless Headphones - Detail View',
                objectFit: 'cover',
                loading: 'lazy'
            }
        ] as MediaConfig[],
        features: [
            'Active Noise Cancellation',
            '30-hour battery life',
            'Premium leather comfort',
            'Hi-Res Audio certified',
            'Quick charge: 5 min = 2 hours'
        ],
        link: '/products/premium-wireless-headphones'
    }

    const sampleBackground: BackgroundConfig = {
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
            enabled: false,
            color: '#000000',
            opacity: 0.4
        }
    }

    const samplePrimaryButton: ButtonConfig = {
        text: 'Buy Now',
        url: '/checkout?product=premium-wireless-headphones',
        style: 'primary',
        size: 'lg',
        iconPosition: 'right',
        target: '_self'
    }

    const sampleSecondaryButton: ButtonConfig = {
        text: 'View Details',
        url: '/products/premium-wireless-headphones',
        style: 'outline',
        size: 'lg',
        iconPosition: 'left',
        target: '_self'
    }

    // Component state
    const [heroProps, setHeroProps] = React.useState<HeroProductProps>({
        id: 'hero-product-test',
        variant: HeroVariant.PRODUCT,
        theme: getDefaultThemeConfig(),
        responsive: getDefaultResponsiveConfig(),
        accessibility: getDefaultAccessibilityConfig(),
        product: sampleProduct,
        layout: 'left',
        showGallery: true,
        showFeatures: true,
        showPricing: true,
        background: sampleBackground,
        primaryButton: samplePrimaryButton,
        secondaryButton: sampleSecondaryButton
    })

    const [isEditing, setIsEditing] = React.useState(false)
    const [previewMode, setPreviewMode] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop')

    // Handler functions
    const handleSave = (updatedProps: HeroProductProps) => {
        setHeroProps(updatedProps)
        setIsEditing(false)
        console.log('Hero Product saved:', updatedProps)
    }

    const handleCancel = () => {
        setIsEditing(false)
        console.log('Hero Product editing cancelled')
    }

    const handleChange = (updatedProps: Partial<HeroProductProps>) => {
        setHeroProps(prev => ({ ...prev, ...updatedProps }))
        console.log('Hero Product changed:', updatedProps)
    }

    return (
        <div className="hero-product-integration-test">
            <div className="test-header bg-gray-100 p-4 border-b">
                <h1 className="text-2xl font-bold mb-4">Hero Product Integration Test</h1>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-4 py-2 rounded font-medium ${isEditing
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        {isEditing ? 'Stop Editing' : 'Start Editing'}
                    </button>

                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">Preview Mode:</label>
                        <select
                            value={previewMode}
                            onChange={(e) => setPreviewMode(e.target.value as 'mobile' | 'tablet' | 'desktop')}
                            className="px-3 py-1 border rounded"
                        >
                            <option value="mobile">Mobile</option>
                            <option value="tablet">Tablet</option>
                            <option value="desktop">Desktop</option>
                        </select>
                    </div>

                    <div className="text-sm text-gray-600">
                        Layout: {heroProps.layout} |
                        Gallery: {heroProps.showGallery ? 'On' : 'Off'} |
                        Features: {heroProps.showFeatures ? 'On' : 'Off'} |
                        Pricing: {heroProps.showPricing ? 'On' : 'Off'}
                    </div>
                </div>
            </div>

            <div className="test-content">
                {isEditing ? (
                    <div className="editor-container">
                        <HeroProductEditor
                            props={heroProps}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            onChange={handleChange}
                            isLoading={false}
                            errors={{}}
                        />
                    </div>
                ) : (
                    <div className="preview-container">
                        <div className="preview-header bg-gray-50 p-2 border-b">
                            <h2 className="text-lg font-semibold">Preview ({previewMode})</h2>
                        </div>

                        <HeroProductPreview
                            {...heroProps}
                            isPreview={true}
                            previewMode={previewMode}
                        />
                    </div>
                )}
            </div>

            {/* Debug Information */}
            <div className="debug-info bg-gray-50 p-4 border-t">
                <details>
                    <summary className="cursor-pointer font-medium text-gray-700">
                        Debug Information (Click to expand)
                    </summary>
                    <div className="mt-4 space-y-4">
                        <div>
                            <h3 className="font-medium text-gray-700">Product Data:</h3>
                            <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                                {JSON.stringify(heroProps.product, null, 2)}
                            </pre>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-700">Hero Props:</h3>
                            <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                                {JSON.stringify({
                                    layout: heroProps.layout,
                                    showGallery: heroProps.showGallery,
                                    showFeatures: heroProps.showFeatures,
                                    showPricing: heroProps.showPricing,
                                    backgroundType: heroProps.background?.type,
                                    primaryButtonText: heroProps.primaryButton?.text,
                                    secondaryButtonText: heroProps.secondaryButton?.text
                                }, null, 2)}
                            </pre>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    )
}

/**
 * Standalone Component Test
 * 
 * Test the HeroProduct component in isolation
 */
export function HeroProductStandaloneTest() {
    const testProps: HeroProductProps = {
        id: 'hero-product-standalone',
        variant: HeroVariant.PRODUCT,
        theme: getDefaultThemeConfig(),
        responsive: getDefaultResponsiveConfig(),
        accessibility: getDefaultAccessibilityConfig(),
        product: {
            id: 'test-product',
            name: 'Test Product',
            description: 'This is a test product for standalone testing.',
            price: '49.99',
            currency: '$',
            images: [
                {
                    id: 'test-image',
                    url: '/assets/hero/test-product.jpg',
                    type: 'image',
                    alt: 'Test Product',
                    objectFit: 'cover',
                    loading: 'eager'
                }
            ] as MediaConfig[],
            features: ['Feature 1', 'Feature 2', 'Feature 3']
        },
        layout: 'center',
        showGallery: true,
        showFeatures: true,
        showPricing: true,
        background: {
            type: 'color',
            color: '#f8fafc'
        },
        primaryButton: {
            text: 'Test Button',
            url: '#test',
            style: 'primary',
            size: 'lg',
            iconPosition: 'right',
            target: '_self'
        }
    }

    return (
        <div className="hero-product-standalone-test">
            <div className="test-header bg-blue-50 p-4 border-b">
                <h2 className="text-xl font-bold">Standalone Component Test</h2>
                <p className="text-gray-600">Testing HeroProduct component in isolation</p>
            </div>

            <HeroProduct {...testProps} />
        </div>
    )
}

/**
 * Error Boundary for testing error handling
 */
class HeroProductErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Hero Product Error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary bg-red-50 border border-red-200 rounded p-4">
                    <h2 className="text-red-800 font-bold">Something went wrong with Hero Product</h2>
                    <details className="mt-2">
                        <summary className="cursor-pointer text-red-600">Error Details</summary>
                        <pre className="text-xs mt-2 text-red-700">
                            {this.state.error?.toString()}
                        </pre>
                    </details>
                    <button
                        onClick={() => this.setState({ hasError: false, error: undefined })}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

/**
 * Complete Integration Test Suite
 */
export function HeroProductTestSuite() {
    const [activeTest, setActiveTest] = React.useState<'integration' | 'standalone'>('integration')

    return (
        <HeroProductErrorBoundary>
            <div className="hero-product-test-suite min-h-screen bg-gray-100">
                <div className="test-navigation bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Hero Product Test Suite
                            </h1>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setActiveTest('integration')}
                                    className={`px-4 py-2 rounded font-medium ${activeTest === 'integration'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Integration Test
                                </button>
                                <button
                                    onClick={() => setActiveTest('standalone')}
                                    className={`px-4 py-2 rounded font-medium ${activeTest === 'standalone'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Standalone Test
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="test-content">
                    {activeTest === 'integration' ? (
                        <HeroProductIntegrationTest />
                    ) : (
                        <HeroProductStandaloneTest />
                    )}
                </div>
            </div>
        </HeroProductErrorBoundary>
    )
}

export default HeroProductTestSuite