// Hero Section Accessibility Integration Tests

'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { 
    HeroAccessibilityTester, 
    quickAccessibilityCheck, 
    testThemeColorContrast,
    AccessibilityTestResults,
    QuickAccessibilityResult,
    ThemeContrastResult
} from './test-theme-compatibility'
import { HeroVariant, ThemeConfig } from './types'
import { getDefaultThemeConfig, getDefaultAccessibilityConfig } from './utils'
import HeroCentered from './variants/HeroCentered'
import HeroSplitScreen from './variants/HeroSplitScreen'

/**
 * Accessibility Integration Test Component
 * 
 * This component provides a comprehensive testing interface for hero section accessibility
 */
export function AccessibilityIntegrationTest() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [testResults, setTestResults] = useState<Record<HeroVariant, AccessibilityTestResults>>({} as any)
    const [quickResults, setQuickResults] = useState<Record<HeroVariant, QuickAccessibilityResult>>({} as any)
    const [themeResults, setThemeResults] = useState<ThemeContrastResult | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedVariant, setSelectedVariant] = useState<HeroVariant>(HeroVariant.CENTERED)

    // Test configurations
    const testTheme: ThemeConfig = getDefaultThemeConfig()
    const accessibilityConfig = getDefaultAccessibilityConfig()

    // Sample content for testing
    const sampleContent = {
        title: { text: 'Accessibility Test Hero', tag: 'h1' as const },
        subtitle: { text: 'Testing accessibility features across all hero variants', tag: 'h2' as const },
        description: { text: 'This hero section is being tested for WCAG compliance and accessibility best practices.', tag: 'p' as const },
        primaryButton: {
            text: 'Primary Action',
            url: '#test',
            style: 'primary' as const,
            size: 'md' as const,
            iconPosition: 'left' as const,
            target: '_self' as const,
            ariaLabel: 'Primary action button for accessibility testing'
        },
        secondaryButton: {
            text: 'Secondary Action',
            url: '#test-secondary',
            style: 'secondary' as const,
            size: 'md' as const,
            iconPosition: 'right' as const,
            target: '_self' as const,
            ariaLabel: 'Secondary action button for accessibility testing'
        }
    }

    const sampleMedia = {
        id: 'test-image',
        url: '/assets/hero/test-image.jpg',
        type: 'image' as const,
        alt: 'Accessibility testing hero image showing diverse users interacting with technology',
        width: 800,
        height: 600,
        objectFit: 'cover' as const,
        loading: 'eager' as const
    }

    const sampleBackground = {
        type: 'gradient' as const,
        gradient: {
            type: 'linear' as const,
            direction: '45deg',
            colors: [
                { color: '#3b82f6', stop: 0 },
                { color: '#1d4ed8', stop: 100 }
            ]
        },
        overlay: {
            enabled: true,
            color: 'rgba(0, 0, 0, 0.3)',
            opacity: 0.3
        }
    }

    // Run comprehensive accessibility tests
    const runAccessibilityTests = useCallback(async () => {
        if (!containerRef.current) return

        setIsLoading(true)
        try {
            const results: Record<HeroVariant, AccessibilityTestResults> = {} as any
            const quickResults: Record<HeroVariant, QuickAccessibilityResult> = {} as any

            // Test each hero variant
            const heroSections = containerRef.current.querySelectorAll('[data-hero-variant]')
            
            for (const section of Array.from(heroSections)) {
                const variant = (section as HTMLElement).dataset.heroVariant as HeroVariant
                if (variant) {
                    // Run comprehensive tests
                    const tester = new HeroAccessibilityTester(variant, accessibilityConfig)
                    tester.setElement(section as HTMLElement)
                    results[variant] = await tester.runAllTests()

                    // Run quick check
                    quickResults[variant] = quickAccessibilityCheck(section as HTMLElement, variant)
                }
            }

            setTestResults(results)
            setQuickResults(quickResults)

            // Test theme color contrast
            const contrastResults = testThemeColorContrast(testTheme)
            setThemeResults(contrastResults)

        } catch (error) {
            console.error('Error running accessibility tests:', error)
        } finally {
            setIsLoading(false)
        }
    }, [accessibilityConfig, testTheme])

    // Run tests when component mounts and when variant changes
    useEffect(() => {
        const timer = setTimeout(() => {
            runAccessibilityTests()
        }, 1000) // Allow time for components to render

        return () => clearTimeout(timer)
    }, [selectedVariant, runAccessibilityTests])

    return (
        <div className="accessibility-test-container p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Hero Section Accessibility Testing
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Comprehensive accessibility testing for all hero section variants
                    </p>
                    
                    <div className="flex gap-4 items-center mb-6">
                        <select
                            value={selectedVariant}
                            onChange={(e) => setSelectedVariant(e.target.value as HeroVariant)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            aria-label="Select hero variant to test"
                        >
                            {Object.values(HeroVariant).map(variant => (
                                <option key={variant} value={variant}>
                                    {variant.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </option>
                            ))}
                        </select>
                        
                        <button
                            onClick={runAccessibilityTests}
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label="Run accessibility tests"
                        >
                            {isLoading ? 'Testing...' : 'Run Tests'}
                        </button>
                    </div>
                </header>

                {/* Test Results Summary */}
                {Object.keys(quickResults).length > 0 && (
                    <section className="mb-8" aria-labelledby="results-summary">
                        <h2 id="results-summary" className="text-2xl font-semibold text-gray-900 mb-4">
                            Test Results Summary
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(quickResults).map(([variant, result]) => (
                                <div
                                    key={variant}
                                    className={`p-4 rounded-lg border-2 ${
                                        result.hasIssues 
                                            ? 'border-red-200 bg-red-50' 
                                            : 'border-green-200 bg-green-50'
                                    }`}
                                >
                                    <h3 className="font-semibold text-lg mb-2">
                                        {variant.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </h3>
                                    <div className="mb-2">
                                        <span className="text-2xl font-bold">
                                            {result.score}%
                                        </span>
                                        <span className="text-sm text-gray-600 ml-2">
                                            Accessibility Score
                                        </span>
                                    </div>
                                    {result.issues.length > 0 && (
                                        <div className="mb-2">
                                            <h4 className="font-medium text-red-800 mb-1">Issues:</h4>
                                            <ul className="text-sm text-red-700 list-disc list-inside">
                                                {result.issues.map((issue, index) => (
                                                    <li key={index}>{issue}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {result.warnings.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-yellow-800 mb-1">Warnings:</h4>
                                            <ul className="text-sm text-yellow-700 list-disc list-inside">
                                                {result.warnings.map((warning, index) => (
                                                    <li key={index}>{warning}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Theme Color Contrast Results */}
                {themeResults && (
                    <section className="mb-8" aria-labelledby="contrast-results">
                        <h2 id="contrast-results" className="text-2xl font-semibold text-gray-900 mb-4">
                            Theme Color Contrast Analysis
                        </h2>
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <div className="mb-4">
                                <span className="text-2xl font-bold">
                                    {themeResults.overallScore.toFixed(1)}%
                                </span>
                                <span className="text-sm text-gray-600 ml-2">
                                    Overall Contrast Score
                                </span>
                                <div className="mt-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        themeResults.wcagAACompliance 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        WCAG AA: {themeResults.wcagAACompliance ? 'Pass' : 'Fail'}
                                    </span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${
                                        themeResults.wcagAAACompliance 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        WCAG AAA: {themeResults.wcagAAACompliance ? 'Pass' : 'Fail'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {themeResults.results.map((result, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-medium">{result.combination}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">
                                                {result.ratio.toFixed(2)}:1
                                            </span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                                result.wcagAA 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {result.wcagAA ? 'Pass' : 'Fail'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {themeResults.recommendations.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Recommendations:</h4>
                                    <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                                        {themeResults.recommendations.map((rec, index) => (
                                            <li key={index}>{rec}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Detailed Test Results */}
                {Object.keys(testResults).length > 0 && (
                    <section className="mb-8" aria-labelledby="detailed-results">
                        <h2 id="detailed-results" className="text-2xl font-semibold text-gray-900 mb-4">
                            Detailed Test Results
                        </h2>
                        {Object.entries(testResults).map(([variant, result]) => (
                            <details key={variant} className="mb-4">
                                <summary className="cursor-pointer p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <span className="font-semibold text-lg">
                                        {variant.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                    <span className="ml-4 text-sm text-gray-600">
                                        {result.passed} passed, {result.failed} failed, {result.warnings} warnings
                                    </span>
                                </summary>
                                <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                    <div className="space-y-3">
                                        {result.tests.map((test, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                                    test.status === 'passed' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : test.status === 'failed'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {test.status}
                                                </span>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{test.name}</h4>
                                                    <p className="text-sm text-gray-600 mb-1">{test.description}</p>
                                                    <p className="text-sm text-gray-700">{test.details}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        WCAG: {test.wcagCriteria.join(', ')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </details>
                        ))}
                    </section>
                )}

                {/* Test Hero Sections */}
                <section className="mb-8" aria-labelledby="test-sections">
                    <h2 id="test-sections" className="text-2xl font-semibold text-gray-900 mb-4">
                        Test Hero Sections
                    </h2>
                    <div ref={containerRef} className="space-y-8">
                        {/* Hero Centered */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="p-4 bg-gray-100 border-b border-gray-200">
                                <h3 className="font-semibold">Hero Centered</h3>
                            </div>
                            <HeroCentered
                                id="test-hero-centered"
                                variant={HeroVariant.CENTERED}
                                theme={testTheme}
                                responsive={{
                                    mobile: { layout: { direction: 'column', alignment: 'center', justification: 'center', gap: '1rem', padding: '1rem', margin: '0' }, typography: { fontSize: 'base', lineHeight: '1.5', fontWeight: 'normal', textAlign: 'center' }, spacing: { padding: { top: '2rem', right: '1rem', bottom: '2rem', left: '1rem' }, margin: { top: '0', right: '0', bottom: '0', left: '0' } } },
                                    tablet: { layout: { direction: 'column', alignment: 'center', justification: 'center', gap: '2rem', padding: '2rem', margin: '0' }, typography: { fontSize: 'lg', lineHeight: '1.6', fontWeight: 'normal', textAlign: 'center' }, spacing: { padding: { top: '3rem', right: '2rem', bottom: '3rem', left: '2rem' }, margin: { top: '0', right: '0', bottom: '0', left: '0' } } },
                                    desktop: { layout: { direction: 'column', alignment: 'center', justification: 'center', gap: '3rem', padding: '3rem', margin: '0' }, typography: { fontSize: 'xl', lineHeight: '1.7', fontWeight: 'normal', textAlign: 'center' }, spacing: { padding: { top: '4rem', right: '3rem', bottom: '4rem', left: '3rem' }, margin: { top: '0', right: '0', bottom: '0', left: '0' } } }
                                }}
                                accessibility={accessibilityConfig}
                                title={sampleContent.title}
                                subtitle={sampleContent.subtitle}
                                description={sampleContent.description}
                                primaryButton={sampleContent.primaryButton}
                                secondaryButton={sampleContent.secondaryButton}
                                background={sampleBackground}
                                textAlign="center"
                            />
                        </div>

                        {/* Hero Split Screen */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="p-4 bg-gray-100 border-b border-gray-200">
                                <h3 className="font-semibold">Hero Split Screen</h3>
                            </div>
                            <HeroSplitScreen
                                id="test-hero-split-screen"
                                variant={HeroVariant.SPLIT_SCREEN}
                                theme={testTheme}
                                responsive={{
                                    mobile: { layout: { direction: 'column', alignment: 'center', justification: 'center', gap: '1rem', padding: '1rem', margin: '0' }, typography: { fontSize: 'base', lineHeight: '1.5', fontWeight: 'normal', textAlign: 'center' }, spacing: { padding: { top: '2rem', right: '1rem', bottom: '2rem', left: '1rem' }, margin: { top: '0', right: '0', bottom: '0', left: '0' } } },
                                    tablet: { layout: { direction: 'row', alignment: 'center', justification: 'center', gap: '2rem', padding: '2rem', margin: '0' }, typography: { fontSize: 'lg', lineHeight: '1.6', fontWeight: 'normal', textAlign: 'left' }, spacing: { padding: { top: '3rem', right: '2rem', bottom: '3rem', left: '2rem' }, margin: { top: '0', right: '0', bottom: '0', left: '0' } } },
                                    desktop: { layout: { direction: 'row', alignment: 'center', justification: 'center', gap: '3rem', padding: '3rem', margin: '0' }, typography: { fontSize: 'xl', lineHeight: '1.7', fontWeight: 'normal', textAlign: 'left' }, spacing: { padding: { top: '4rem', right: '3rem', bottom: '4rem', left: '3rem' }, margin: { top: '0', right: '0', bottom: '0', left: '0' } } }
                                }}
                                accessibility={accessibilityConfig}
                                content={{
                                    title: sampleContent.title,
                                    subtitle: sampleContent.subtitle,
                                    description: sampleContent.description,
                                    buttons: [sampleContent.primaryButton, sampleContent.secondaryButton]
                                }}
                                media={sampleMedia}
                                layout="left"
                                contentAlignment="center"
                                mediaAlignment="center"
                                background={sampleBackground}
                            />
                        </div>
                    </div>
                </section>

                {/* Accessibility Guidelines */}
                <section className="mb-8" aria-labelledby="guidelines">
                    <h2 id="guidelines" className="text-2xl font-semibold text-gray-900 mb-4">
                        Accessibility Guidelines
                    </h2>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-3">WCAG 2.1 AA Requirements</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>• Color contrast ratio of at least 4.5:1 for normal text</li>
                                    <li>• All images must have descriptive alt text</li>
                                    <li>• Interactive elements must be keyboard accessible</li>
                                    <li>• Content must be properly structured with headings</li>
                                    <li>• Focus indicators must be visible</li>
                                    <li>• Motion animations must respect user preferences</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-3">Implementation Features</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>• Semantic HTML structure with proper roles</li>
                                    <li>• ARIA labels and descriptions for screen readers</li>
                                    <li>• Keyboard navigation support with focus management</li>
                                    <li>• Contextual alt text generation for images</li>
                                    <li>• Reduced motion support for animations</li>
                                    <li>• Screen reader announcements for dynamic content</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default AccessibilityIntegrationTest