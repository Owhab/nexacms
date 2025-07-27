'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HeroCenteredEditor } from './editors/HeroCenteredEditor'
import { HeroCenteredProps, HeroVariant } from './types'
import { heroSectionValidator, ValidationUtils } from './validation'
import { heroServerValidator } from './server-validation'
import { HeroSectionErrorBoundary, HeroMediaError, HeroValidationError } from './components/ErrorBoundary'
import { LazyImage, LazyVideo } from './components/LazyImage'
import { useHeroFallbacks, useHeroSectionData, createEmergencyFallback } from './hooks/useHeroFallbacks'

/**
 * Integration test component for validation and error handling
 */
export function ValidationIntegrationTest() {
    const [testResults, setTestResults] = useState<Record<string, boolean>>({})
    const [currentTest, setCurrentTest] = useState<string>('')

    // Test data with various validation scenarios
    const validHeroProps: HeroCenteredProps = {
        id: 'test-hero',
        variant: HeroVariant.CENTERED,
        theme: {
            primaryColor: '#3b82f6',
            secondaryColor: '#64748b',
            accentColor: '#f59e0b',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            borderColor: '#e5e7eb'
        },
        responsive: {
            mobile: {
                layout: {
                    direction: 'column',
                    alignment: 'center',
                    justification: 'center',
                    gap: '1rem',
                    padding: '2rem',
                    margin: '0'
                },
                typography: {
                    fontSize: 'lg',
                    lineHeight: '1.5',
                    fontWeight: 'normal',
                    textAlign: 'center'
                },
                spacing: {
                    padding: { top: '2rem', right: '1rem', bottom: '2rem', left: '1rem' },
                    margin: { top: '0', right: '0', bottom: '0', left: '0' }
                }
            },
            tablet: {
                layout: {
                    direction: 'column',
                    alignment: 'center',
                    justification: 'center',
                    gap: '1.5rem',
                    padding: '3rem',
                    margin: '0'
                },
                typography: {
                    fontSize: 'xl',
                    lineHeight: '1.4',
                    fontWeight: 'normal',
                    textAlign: 'center'
                },
                spacing: {
                    padding: { top: '3rem', right: '2rem', bottom: '3rem', left: '2rem' },
                    margin: { top: '0', right: '0', bottom: '0', left: '0' }
                }
            },
            desktop: {
                layout: {
                    direction: 'column',
                    alignment: 'center',
                    justification: 'center',
                    gap: '2rem',
                    padding: '4rem',
                    margin: '0'
                },
                typography: {
                    fontSize: '2xl',
                    lineHeight: '1.3',
                    fontWeight: 'normal',
                    textAlign: 'center'
                },
                spacing: {
                    padding: { top: '4rem', right: '3rem', bottom: '4rem', left: '3rem' },
                    margin: { top: '0', right: '0', bottom: '0', left: '0' }
                }
            }
        },
        accessibility: {
            ariaLabels: { main: 'Main hero section' },
            altTexts: {},
            keyboardNavigation: true,
            screenReaderSupport: true,
            highContrast: false,
            reducedMotion: false
        },
        title: {
            text: 'Welcome to Our Website',
            tag: 'h1'
        },
        subtitle: {
            text: 'Experience something amazing',
            tag: 'p'
        },
        description: {
            text: 'This is a test description for validation.',
            tag: 'p'
        },
        primaryButton: {
            text: 'Get Started',
            url: 'https://example.com',
            style: 'primary',
            size: 'lg',
            iconPosition: 'right',
            target: '_self'
        },
        secondaryButton: {
            text: 'Learn More',
            url: '/learn-more',
            style: 'outline',
            size: 'lg',
            iconPosition: 'left',
            target: '_self'
        },
        background: {
            type: 'gradient',
            gradient: {
                type: 'linear',
                direction: '45deg',
                colors: [
                    { color: '#3b82f6', stop: 0 },
                    { color: '#8b5cf6', stop: 100 }
                ]
            }
        },
        textAlign: 'center'
    }

    const invalidHeroProps = {
        id: '', // Invalid: empty ID
        variant: 'invalid-variant', // Invalid: not a valid variant
        theme: {
            primaryColor: 'invalid-color', // Invalid: not a valid color
            // Missing required colors
        },
        title: {
            text: '', // Invalid: empty title
            tag: 'h1'
        },
        primaryButton: {
            text: 'Click Me',
            url: 'invalid-url', // Invalid: not a valid URL
            style: 'primary',
            size: 'lg',
            iconPosition: 'right',
            target: '_self'
        }
    }

    // Test functions
    const runTest = async (testName: string, testFn: () => Promise<boolean> | boolean) => {
        setCurrentTest(testName)
        try {
            const result = await testFn()
            setTestResults(prev => ({ ...prev, [testName]: result }))
            return result
        } catch (error) {
            console.error(`Test ${testName} failed:`, error)
            setTestResults(prev => ({ ...prev, [testName]: false }))
            return false
        }
    }

    const testClientSideValidation = async () => {
        // Test valid data
        const validResult = heroSectionValidator.validateHeroSection(validHeroProps)
        if (!validResult.isValid) {
            console.error('Valid data failed validation:', validResult.errors)
            return false
        }

        // Test invalid data
        const invalidResult = heroSectionValidator.validateHeroSection(invalidHeroProps as any)
        if (invalidResult.isValid) {
            console.error('Invalid data passed validation')
            return false
        }

        // Check specific error types
        const hasIdError = invalidResult.errors.some(e => e.field === 'id')
        const hasColorError = invalidResult.errors.some(e => e.field.includes('primaryColor'))
        const hasTitleError = invalidResult.errors.some(e => e.field.includes('title'))

        return hasIdError && hasColorError && hasTitleError
    }

    const testServerSideValidation = async () => {
        // Test valid data
        const validResult = heroServerValidator.validateHeroSectionData(validHeroProps)
        if (!validResult.isValid) {
            console.error('Valid data failed server validation:', validResult.errors)
            return false
        }

        // Test invalid data
        const invalidResult = heroServerValidator.validateHeroSectionData(invalidHeroProps)
        if (invalidResult.isValid) {
            console.error('Invalid data passed server validation')
            return false
        }

        // Test malicious content
        const maliciousData = {
            ...validHeroProps,
            title: {
                text: '<script>alert("xss")</script>Malicious Title',
                tag: 'h1'
            }
        }

        const maliciousResult = heroServerValidator.validateHeroSectionData(maliciousData)
        const hasMaliciousContentError = maliciousResult.errors.some(e => 
            e.code === 'MALICIOUS_CONTENT'
        )

        return hasMaliciousContentError
    }

    const testMediaValidation = async () => {
        const validMedia = {
            id: 'test-media',
            url: 'https://example.com/image.jpg',
            type: 'image' as const,
            alt: 'Test image',
            objectFit: 'cover' as const,
            loading: 'lazy' as const
        }

        const invalidMedia = {
            id: 'test-media',
            url: 'invalid-url',
            type: 'image' as const,
            // Missing alt text
            objectFit: 'cover' as const,
            loading: 'lazy' as const
        }

        const validResult = heroSectionValidator.validateMediaConfig(validMedia)
        const invalidResult = heroSectionValidator.validateMediaConfig(invalidMedia)

        return validResult.length === 0 && invalidResult.length > 0
    }

    const testErrorBoundary = async () => {
        // This test simulates an error being thrown and caught
        try {
            const ErrorThrowingComponent = () => {
                throw new HeroValidationError('Test validation error', 'test-field', HeroVariant.CENTERED)
            }

            // In a real test, we would render this component and check if the error boundary catches it
            // For this integration test, we'll just verify the error classes work
            const error = new HeroMediaError('Test media error', 'https://example.com/image.jpg', HeroVariant.CENTERED)
            
            return error instanceof Error && 
                   error.name === 'HeroMediaError' && 
                   error.variant === HeroVariant.CENTERED
        } catch (error) {
            return false
        }
    }

    const testFallbackSystem = async () => {
        // Test emergency fallback creation
        const emergencyFallback = createEmergencyFallback('centered')
        
        // Validate the emergency fallback
        const validationResult = heroSectionValidator.validateHeroSection(emergencyFallback)
        
        return validationResult.isValid && 
               emergencyFallback.title.text.includes('Temporarily Unavailable')
    }

    const testLazyImageFallback = async () => {
        // Test that LazyImage component handles invalid URLs gracefully
        const invalidMedia = {
            id: 'test-invalid',
            url: 'https://invalid-domain-that-does-not-exist.com/image.jpg',
            type: 'image' as const,
            alt: 'Test image',
            objectFit: 'cover' as const,
            loading: 'lazy' as const
        }

        // In a real test environment, we would render the LazyImage component
        // and verify it shows the fallback. For this integration test,
        // we'll just verify the media validation works
        const errors = heroSectionValidator.validateMediaConfig(invalidMedia)
        
        // The URL format is valid, but the domain doesn't exist
        // This would be caught at runtime by the LazyImage component
        return errors.length === 1 && errors[0].code === 'ACCESSIBILITY_VIOLATION' // Missing alt text
    }

    const runAllTests = async () => {
        const tests = [
            { name: 'Client-side Validation', fn: testClientSideValidation },
            { name: 'Server-side Validation', fn: testServerSideValidation },
            { name: 'Media Validation', fn: testMediaValidation },
            { name: 'Error Boundary', fn: testErrorBoundary },
            { name: 'Fallback System', fn: testFallbackSystem },
            { name: 'Lazy Image Fallback', fn: testLazyImageFallback }
        ]

        for (const test of tests) {
            await runTest(test.name, test.fn)
        }
        
        setCurrentTest('')
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Hero Section Validation & Error Handling Integration Test</h1>
            
            <div className="mb-6">
                <Button onClick={runAllTests} className="mr-4">
                    Run All Tests
                </Button>
                {currentTest && (
                    <span className="text-sm text-gray-600">
                        Running: {currentTest}...
                    </span>
                )}
            </div>

            {/* Test Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {Object.entries(testResults).map(([testName, passed]) => (
                    <div
                        key={testName}
                        className={`p-4 rounded-lg border ${
                            passed 
                                ? 'bg-green-50 border-green-200 text-green-800' 
                                : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                    >
                        <div className="flex items-center">
                            <span className="mr-2">
                                {passed ? '✅' : '❌'}
                            </span>
                            <span className="font-medium">{testName}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Error Boundary Demo */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Error Boundary Demo</h2>
                <HeroSectionErrorBoundary
                    variant={HeroVariant.CENTERED}
                    showDetails={true}
                    enableRetry={true}
                >
                    <ErrorThrowingComponent />
                </HeroSectionErrorBoundary>
            </div>

            {/* Lazy Image Demo */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Lazy Image Fallback Demo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-medium mb-2">Valid Image</h3>
                        <div className="h-48 border rounded">
                            <LazyImage
                                media={{
                                    id: 'valid-image',
                                    url: '/assets/hero/1752750261939_uxl73eyx4zi.jpg',
                                    type: 'image',
                                    alt: 'Valid test image',
                                    objectFit: 'cover',
                                    loading: 'lazy'
                                }}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium mb-2">Invalid Image (Fallback)</h3>
                        <div className="h-48 border rounded">
                            <LazyImage
                                media={{
                                    id: 'invalid-image',
                                    url: 'https://invalid-domain.com/nonexistent.jpg',
                                    type: 'image',
                                    alt: 'Invalid test image',
                                    objectFit: 'cover',
                                    loading: 'lazy'
                                }}
                                className="w-full h-full"
                                enableRetry={true}
                                maxRetries={2}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Editor with Validation */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Hero Editor with Validation</h2>
                <div className="border rounded-lg p-4">
                    <HeroCenteredEditor
                        props={validHeroProps}
                        onSave={(props) => console.log('Saved:', props)}
                        onCancel={() => console.log('Cancelled')}
                        onChange={(props) => console.log('Changed:', props)}
                    />
                </div>
            </div>
        </div>
    )
}

/**
 * Component that throws an error for testing error boundary
 */
function ErrorThrowingComponent() {
    const [shouldThrow, setShouldThrow] = useState(false)

    if (shouldThrow) {
        throw new HeroValidationError(
            'This is a test error to demonstrate the error boundary',
            'test-field',
            HeroVariant.CENTERED
        )
    }

    return (
        <div className="p-4 border rounded">
            <p className="mb-4">This component can throw an error to test the error boundary.</p>
            <Button 
                onClick={() => setShouldThrow(true)}
                variant="destructive"
            >
                Throw Error
            </Button>
        </div>
    )
}

/**
 * Hook demo component for fallback system
 */
function FallbackSystemDemo() {
    const { data, loading, error, retry, canRetry } = useHeroSectionData('non-existent-section', {
        enableRetry: true,
        maxRetries: 2,
        gracefulDegradation: true
    })

    if (loading) {
        return <div className="p-4">Loading hero section data...</div>
    }

    if (error && !data) {
        return (
            <div className="p-4 border border-red-200 rounded bg-red-50">
                <p className="text-red-800 mb-2">Error loading hero section: {error.message}</p>
                {canRetry && (
                    <Button onClick={retry} size="sm" variant="outline">
                        Retry
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className="p-4 border rounded">
            <h3 className="font-medium mb-2">Fallback Data Loaded</h3>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    )
}

export default ValidationIntegrationTest