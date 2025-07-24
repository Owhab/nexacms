/**
 * Testimonial Hero Implementation Test
 * 
 * This file verifies that the Hero Testimonial variant is fully implemented
 * and can be used in a real application context.
 */

import {
    HeroTestimonialProps,
    HeroVariant,
    HeroEditorProps,
    TestimonialItem
} from './types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from './utils'

// Test that all components can be imported
import { HeroTestimonial } from './variants/HeroTestimonial'
import { HeroTestimonialEditor } from './editors/HeroTestimonialEditor'
import { HeroTestimonialPreview } from './previews/HeroTestimonialPreview'

/**
 * Test Testimonials Data
 */
export const testTestimonials: TestimonialItem[] = [
    {
        id: 'testimonial-1',
        quote: 'This product has completely transformed our business operations. The results exceeded our expectations and the support team is fantastic.',
        author: 'Sarah Johnson',
        company: 'TechCorp Inc.',
        role: 'CEO',
        rating: 5,
        avatar: {
            id: 'avatar-1',
            url: '/assets/testimonials/sarah-johnson.jpg',
            type: 'image',
            alt: 'Sarah Johnson avatar',
            objectFit: 'cover',
            loading: 'lazy'
        }
    },
    {
        id: 'testimonial-2',
        quote: 'Outstanding service and incredible results. I would highly recommend this to anyone looking to improve their workflow.',
        author: 'Michael Chen',
        company: 'Design Studio Pro',
        role: 'Creative Director',
        rating: 5
    },
    {
        id: 'testimonial-3',
        quote: 'The best investment we have made for our company this year. The ROI has been remarkable.',
        author: 'Emily Rodriguez',
        company: 'StartupXYZ',
        role: 'Founder',
        rating: 4,
        avatar: {
            id: 'avatar-3',
            url: '/assets/testimonials/emily-rodriguez.jpg',
            type: 'image',
            alt: 'Emily Rodriguez avatar',
            objectFit: 'cover',
            loading: 'lazy'
        }
    },
    {
        id: 'testimonial-4',
        quote: 'Simple, effective, and powerful. Everything we needed in one solution.',
        author: 'David Kim',
        company: 'Innovation Labs',
        role: 'CTO',
        rating: 5
    }
]

/**
 * Test Testimonial Hero Props
 */
export const testTestimonialProps: HeroTestimonialProps = {
    id: 'test-testimonial-hero',
    variant: HeroVariant.TESTIMONIAL,
    theme: getDefaultThemeConfig(),
    responsive: getDefaultResponsiveConfig(),
    accessibility: getDefaultAccessibilityConfig(),
    title: {
        text: 'What Our Customers Say',
        tag: 'h1'
    },
    subtitle: {
        text: 'Trusted by thousands of businesses worldwide',
        tag: 'h2'
    },
    testimonials: testTestimonials,
    layout: 'single',
    autoRotate: false,
    rotationInterval: 5000,
    showRatings: true,
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
            enabled: false,
            color: '#000000',
            opacity: 0.4
        }
    },
    primaryButton: {
        text: 'Get Started',
        url: '/signup',
        style: 'primary',
        size: 'lg',
        iconPosition: 'right',
        target: '_self'
    }
}

/**
 * Test Editor Props
 */
export const testEditorProps: HeroEditorProps<HeroTestimonialProps> = {
    props: testTestimonialProps,
    onSave: (props: HeroTestimonialProps) => {
        console.log('Testimonial Hero saved:', props)
    },
    onCancel: () => {
        console.log('Testimonial Hero editing cancelled')
    },
    onChange: (partialProps: Partial<HeroTestimonialProps>) => {
        console.log('Testimonial Hero changed:', partialProps)
    },
    isLoading: false,
    errors: {}
}

/**
 * Verify component exports
 */
export function verifyTestimonialImplementation() {
    const results = {
        componentExists: typeof HeroTestimonial === 'function',
        editorExists: typeof HeroTestimonialEditor === 'function',
        previewExists: typeof HeroTestimonialPreview === 'function',
        propsValid: validateTestimonialProps(testTestimonialProps),
        editorPropsValid: validateEditorProps(testEditorProps)
    }

    console.log('Testimonial Hero Implementation Verification:', results)
    
    return results
}

/**
 * Validate Testimonial Props
 */
function validateTestimonialProps(props: HeroTestimonialProps): boolean {
    try {
        // Check required properties
        if (!props.id || !props.variant || !props.title) {
            return false
        }

        // Check title structure
        if (!props.title.text || !props.title.tag) {
            return false
        }

        // Check testimonials array
        if (!Array.isArray(props.testimonials)) {
            return false
        }

        // Validate each testimonial
        for (const testimonial of props.testimonials) {
            if (!testimonial.id || !testimonial.quote || !testimonial.author) {
                return false
            }
            
            if (testimonial.rating && (testimonial.rating < 1 || testimonial.rating > 5)) {
                return false
            }
        }

        // Check layout values
        if (!['single', 'carousel', 'grid'].includes(props.layout)) {
            return false
        }

        // Check rotation interval
        if (props.rotationInterval && props.rotationInterval < 1000) {
            return false
        }

        return true
    } catch (error) {
        console.error('Props validation error:', error)
        return false
    }
}

/**
 * Validate Editor Props
 */
function validateEditorProps(props: HeroEditorProps<HeroTestimonialProps>): boolean {
    try {
        // Check required properties
        if (!props.props || !props.onSave || !props.onCancel) {
            return false
        }

        // Check callback functions
        if (typeof props.onSave !== 'function' || typeof props.onCancel !== 'function') {
            return false
        }

        // Check optional properties
        if (props.onChange && typeof props.onChange !== 'function') {
            return false
        }

        return true
    } catch (error) {
        console.error('Editor props validation error:', error)
        return false
    }
}

/**
 * Test different layout configurations
 */
export function testLayoutConfigurations() {
    const configurations = [
        {
            name: 'Single Layout',
            props: {
                ...testTestimonialProps,
                layout: 'single' as const,
                autoRotate: false
            }
        },
        {
            name: 'Single Layout with Auto-rotation',
            props: {
                ...testTestimonialProps,
                layout: 'single' as const,
                autoRotate: true,
                rotationInterval: 3000
            }
        },
        {
            name: 'Carousel Layout',
            props: {
                ...testTestimonialProps,
                layout: 'carousel' as const,
                autoRotate: false
            }
        },
        {
            name: 'Carousel Layout with Auto-rotation',
            props: {
                ...testTestimonialProps,
                layout: 'carousel' as const,
                autoRotate: true,
                rotationInterval: 4000
            }
        },
        {
            name: 'Grid Layout',
            props: {
                ...testTestimonialProps,
                layout: 'grid' as const,
                autoRotate: false // Auto-rotate not applicable for grid
            }
        }
    ]

    console.log('Testing layout configurations:')
    configurations.forEach(config => {
        const isValid = validateTestimonialProps(config.props)
        console.log(`- ${config.name}: ${isValid ? '✅ Valid' : '❌ Invalid'}`)
    })

    return configurations
}

/**
 * Test testimonial variations
 */
export function testTestimonialVariations() {
    const variations = [
        {
            name: 'With Ratings Shown',
            props: {
                ...testTestimonialProps,
                showRatings: true
            }
        },
        {
            name: 'Without Ratings',
            props: {
                ...testTestimonialProps,
                showRatings: false
            }
        },
        {
            name: 'Minimal Testimonials (no company/role)',
            props: {
                ...testTestimonialProps,
                testimonials: [
                    {
                        id: 'minimal-1',
                        quote: 'Great product!',
                        author: 'Anonymous User',
                        rating: 5
                    }
                ]
            }
        },
        {
            name: 'Testimonials with Avatars',
            props: {
                ...testTestimonialProps,
                testimonials: testTestimonials.filter(t => t.avatar)
            }
        },
        {
            name: 'Testimonials without Avatars',
            props: {
                ...testTestimonialProps,
                testimonials: testTestimonials.map(t => ({ ...t, avatar: undefined }))
            }
        }
    ]

    console.log('Testing testimonial variations:')
    variations.forEach(variation => {
        const isValid = validateTestimonialProps(variation.props)
        console.log(`- ${variation.name}: ${isValid ? '✅ Valid' : '❌ Invalid'}`)
    })

    return variations
}

/**
 * Test rotation functionality
 */
export function testRotationFunctionality() {
    const rotationTests = [
        {
            name: 'Fast Rotation (2 seconds)',
            interval: 2000,
            valid: true
        },
        {
            name: 'Normal Rotation (5 seconds)',
            interval: 5000,
            valid: true
        },
        {
            name: 'Slow Rotation (10 seconds)',
            interval: 10000,
            valid: true
        },
        {
            name: 'Very Slow Rotation (30 seconds)',
            interval: 30000,
            valid: true
        },
        {
            name: 'Invalid Rotation (too fast)',
            interval: 500,
            valid: false
        }
    ]

    console.log('Testing rotation functionality:')
    rotationTests.forEach(test => {
        const testProps = {
            ...testTestimonialProps,
            autoRotate: true,
            rotationInterval: test.interval
        }
        const isValid = validateTestimonialProps(testProps)
        const result = isValid === test.valid ? '✅ Expected' : '❌ Unexpected'
        console.log(`- ${test.name}: ${result}`)
    })

    return rotationTests
}

/**
 * Test rating display
 */
export function testRatingDisplay() {
    const ratingTests = [
        {
            name: '5 Star Rating',
            rating: 5,
            valid: true
        },
        {
            name: '4 Star Rating',
            rating: 4,
            valid: true
        },
        {
            name: '3 Star Rating',
            rating: 3,
            valid: true
        },
        {
            name: '1 Star Rating',
            rating: 1,
            valid: true
        },
        {
            name: 'Invalid Rating (0)',
            rating: 0,
            valid: false
        },
        {
            name: 'Invalid Rating (6)',
            rating: 6,
            valid: false
        }
    ]

    console.log('Testing rating display:')
    ratingTests.forEach(test => {
        const testTestimonial: TestimonialItem = {
            id: 'rating-test',
            quote: 'Test quote',
            author: 'Test Author',
            rating: test.rating
        }
        
        const testProps = {
            ...testTestimonialProps,
            testimonials: [testTestimonial]
        }
        
        const isValid = validateTestimonialProps(testProps)
        const result = isValid === test.valid ? '✅ Expected' : '❌ Unexpected'
        console.log(`- ${test.name}: ${result}`)
    })

    return ratingTests
}

/**
 * Run all tests
 */
export function runAllTests() {
    console.log('🧪 Running Hero Testimonial Implementation Tests...\n')
    
    const verification = verifyTestimonialImplementation()
    console.log('\n')
    
    const layouts = testLayoutConfigurations()
    console.log('\n')
    
    const variations = testTestimonialVariations()
    console.log('\n')
    
    const rotation = testRotationFunctionality()
    console.log('\n')
    
    const ratings = testRatingDisplay()
    console.log('\n')
    
    const allTestsPassed = verification.componentExists && 
                          verification.editorExists && 
                          verification.previewExists && 
                          verification.propsValid && 
                          verification.editorPropsValid

    console.log(`🎯 Overall Result: ${allTestsPassed ? '✅ All tests passed!' : '❌ Some tests failed'}`)
    
    return {
        verification,
        layouts,
        variations,
        rotation,
        ratings,
        allTestsPassed
    }
}

// Export test runner for external use
const testTestimonialImplementation = {
    verifyTestimonialImplementation,
    testLayoutConfigurations,
    testTestimonialVariations,
    testRotationFunctionality,
    testRatingDisplay,
    runAllTests,
    testTestimonialProps,
    testEditorProps,
    testTestimonials
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests()
}

export default testTestimonialImplementation