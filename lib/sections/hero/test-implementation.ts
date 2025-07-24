// Hero Section Accessibility Implementation Test

import { HeroVariant, AccessibilityConfig, ThemeConfig } from './types'
import { 
    generateAccessibilityProps,
    generateAriaLabel,
    generateSemanticProps,
    generateInteractiveAriaProps,
    generateKeyboardNavigationProps,
    generateImageAltText,
    generateVideoAccessibilityProps,
    checkColorContrast,
    respectsReducedMotion,
    validateAccessibility
} from './utils'

/**
 * Test suite for accessibility implementation
 */
export class AccessibilityImplementationTest {
    private testResults: TestResult[] = []

    /**
     * Run all accessibility implementation tests
     */
    runAllTests(): TestSummary {
        this.testResults = []

        // Test utility functions
        this.testAccessibilityProps()
        this.testAriaLabelGeneration()
        this.testSemanticProps()
        this.testInteractiveAriaProps()
        this.testKeyboardNavigationProps()
        this.testImageAltTextGeneration()
        this.testVideoAccessibilityProps()
        this.testColorContrastChecking()
        this.testMotionPreferences()

        // Calculate summary
        const passed = this.testResults.filter(r => r.status === 'pass').length
        const failed = this.testResults.filter(r => r.status === 'fail').length
        const total = this.testResults.length

        return {
            total,
            passed,
            failed,
            passRate: (passed / total) * 100,
            results: this.testResults
        }
    }

    private testAccessibilityProps() {
        const config: AccessibilityConfig = {
            ariaLabels: { label: 'Test hero section' },
            altTexts: {},
            keyboardNavigation: true,
            screenReaderSupport: true,
            highContrast: false,
            reducedMotion: false
        }

        const props = generateAccessibilityProps(config)

        this.addTest(
            'generateAccessibilityProps',
            'Should generate proper accessibility props',
            props['aria-label'] === 'Test hero section' && 
            props.tabIndex === 0 && 
            props.role === 'region' &&
            props['aria-live'] === 'polite'
        )
    }

    private testAriaLabelGeneration() {
        const label1 = generateAriaLabel(HeroVariant.CENTERED)
        const label2 = generateAriaLabel(HeroVariant.SPLIT_SCREEN, 'Welcome to our site')

        this.addTest(
            'generateAriaLabel',
            'Should generate descriptive ARIA labels',
            label1 === 'centered hero section' &&
            label2 === 'split screen hero section: Welcome to our site'
        )
    }

    private testSemanticProps() {
        const props = generateSemanticProps(HeroVariant.CENTERED, true)

        this.addTest(
            'generateSemanticProps',
            'Should generate semantic HTML props',
            props.role === 'banner' &&
            props['aria-label'] === 'centered hero section' &&
            props['data-main-hero'] === 'true'
        )
    }

    private testInteractiveAriaProps() {
        const buttonProps = generateInteractiveAriaProps('button', {
            label: 'Click me',
            description: 'button-desc',
            expanded: false,
            controls: 'menu-1'
        })

        this.addTest(
            'generateInteractiveAriaProps',
            'Should generate interactive element ARIA props',
            buttonProps['aria-label'] === 'Click me' &&
            buttonProps['aria-describedby'] === 'button-desc' &&
            buttonProps['aria-expanded'] === false &&
            buttonProps['aria-controls'] === 'menu-1'
        )
    }

    private testKeyboardNavigationProps() {
        const props = generateKeyboardNavigationProps('button', {
            tabIndex: 0,
            role: 'button'
        })

        this.addTest(
            'generateKeyboardNavigationProps',
            'Should generate keyboard navigation props',
            props.tabIndex === 0 &&
            props.role === 'button' &&
            typeof props.onKeyDown === 'function'
        )
    }

    private testImageAltTextGeneration() {
        const media = {
            id: 'test',
            url: '/test.jpg',
            type: 'image' as const,
            alt: 'Custom alt text',
            objectFit: 'cover' as const,
            loading: 'lazy' as const
        }

        const altText1 = generateImageAltText(media, {
            variant: HeroVariant.CENTERED,
            purpose: 'hero'
        })

        const altText2 = generateImageAltText(
            { ...media, alt: '' }, 
            {
                variant: HeroVariant.PRODUCT,
                purpose: 'product'
            }
        )

        this.addTest(
            'generateImageAltText',
            'Should generate contextual alt text',
            altText1 === 'Custom alt text' &&
            altText2 === 'Product showcase image for product section'
        )
    }

    private testVideoAccessibilityProps() {
        const media = {
            id: 'test',
            url: '/test.mp4',
            type: 'video' as const,
            alt: 'Test video',
            autoplay: true,
            muted: false,
            objectFit: 'cover' as const,
            loading: 'lazy' as const
        }

        const props = generateVideoAccessibilityProps(media, {
            hasAudio: true,
            isBackground: false
        })

        this.addTest(
            'generateVideoAccessibilityProps',
            'Should generate video accessibility props',
            props.role === 'video' &&
            props['aria-label'] === 'Test video' &&
            props['aria-describedby'] === 'video-autoplay-warning'
        )
    }

    private testColorContrastChecking() {
        const result1 = checkColorContrast('#000000', '#ffffff') // Black on white
        const result2 = checkColorContrast('#777777', '#ffffff') // Gray on white

        this.addTest(
            'checkColorContrast',
            'Should calculate color contrast ratios correctly',
            result1.ratio > 20 && result1.wcagAA && result1.wcagAAA &&
            result2.ratio > 4 && result2.wcagAA && !result2.wcagAAA
        )
    }

    private testMotionPreferences() {
        // This test would need to be run in a browser environment
        // For now, we'll just test that the function exists and returns a boolean
        const prefersReduced = respectsReducedMotion()

        this.addTest(
            'respectsReducedMotion',
            'Should detect motion preferences',
            typeof prefersReduced === 'boolean'
        )
    }

    private addTest(name: string, description: string, passed: boolean) {
        this.testResults.push({
            name,
            description,
            status: passed ? 'pass' : 'fail',
            error: passed ? undefined : 'Test assertion failed'
        })
    }
}

/**
 * Test DOM accessibility validation
 */
export function testDOMAccessibility(): void {
    if (typeof document === 'undefined') {
        console.log('DOM tests can only run in browser environment')
        return
    }

    // Create a test hero section
    const testSection = document.createElement('section')
    testSection.className = 'hero-section'
    testSection.setAttribute('aria-label', 'Test hero section')
    testSection.setAttribute('data-hero-variant', 'centered')

    // Add a heading
    const heading = document.createElement('h1')
    heading.textContent = 'Test Hero Title'
    testSection.appendChild(heading)

    // Add an image
    const image = document.createElement('img')
    image.src = '/test.jpg'
    image.alt = 'Test hero image'
    testSection.appendChild(image)

    // Add a button
    const button = document.createElement('button')
    button.textContent = 'Test Button'
    button.setAttribute('aria-label', 'Test action button')
    testSection.appendChild(button)

    // Add to document temporarily
    document.body.appendChild(testSection)

    // Run validation
    const validation = validateAccessibility(testSection)

    // Clean up
    document.body.removeChild(testSection)

    // Log results
    console.log('DOM Accessibility Validation Results:')
    console.log('Errors:', validation.errors)
    console.log('Warnings:', validation.warnings)
    console.log('Suggestions:', validation.suggestions)
}

/**
 * Integration test for all accessibility features
 */
export function runAccessibilityIntegrationTest(): IntegrationTestResult {
    const implementationTest = new AccessibilityImplementationTest()
    const implementationResults = implementationTest.runAllTests()

    // Test theme color contrast
    const testTheme: ThemeConfig = {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderColor: '#e5e7eb'
    }

    const contrastResults = [
        checkColorContrast(testTheme.textColor, testTheme.backgroundColor),
        checkColorContrast(testTheme.primaryColor, testTheme.backgroundColor),
        checkColorContrast(testTheme.secondaryColor, testTheme.backgroundColor)
    ]

    const contrastPassed = contrastResults.filter(r => r.wcagAA).length
    const contrastTotal = contrastResults.length

    return {
        implementation: implementationResults,
        colorContrast: {
            total: contrastTotal,
            passed: contrastPassed,
            passRate: (contrastPassed / contrastTotal) * 100,
            results: contrastResults
        },
        overall: {
            implementationScore: implementationResults.passRate,
            contrastScore: (contrastPassed / contrastTotal) * 100,
            overallScore: (implementationResults.passRate + (contrastPassed / contrastTotal) * 100) / 2
        }
    }
}

// Type definitions
interface TestResult {
    name: string
    description: string
    status: 'pass' | 'fail'
    error?: string
}

interface TestSummary {
    total: number
    passed: number
    failed: number
    passRate: number
    results: TestResult[]
}

interface ContrastResult {
    ratio: number
    wcagAA: boolean
    wcagAAA: boolean
}

interface IntegrationTestResult {
    implementation: TestSummary
    colorContrast: {
        total: number
        passed: number
        passRate: number
        results: ContrastResult[]
    }
    overall: {
        implementationScore: number
        contrastScore: number
        overallScore: number
    }
}

// Export test runner for use in development
export const accessibilityTestRunner = {
    AccessibilityImplementationTest,
    testDOMAccessibility,
    runAccessibilityIntegrationTest
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined' && (window as any).__runAccessibilityTests) {
    console.log('Running Accessibility Implementation Tests...')
    const results = runAccessibilityIntegrationTest()
    console.log('Test Results:', results)
    
    if (results.overall.overallScore >= 90) {
        console.log('✅ Accessibility implementation is excellent!')
    } else if (results.overall.overallScore >= 75) {
        console.log('✅ Accessibility implementation is good!')
    } else {
        console.log('⚠️ Accessibility implementation needs improvement.')
    }
}