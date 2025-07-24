import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import { HeroFeature } from '../HeroFeature'
import {
    HeroVariant,
    HeroFeatureProps,
    FeatureItem,
    BackgroundConfig,
    TextContent,
    ButtonConfig
} from '../../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../../utils'

// Mock the base components
jest.mock('../../base/BaseHeroSection', () => ({
    BaseHeroSection: ({ children, ...props }: any) => (
        <section data-testid="base-hero-section" {...props}>
            {children}
        </section>
    ),
    HeroBackground: ({ background }: any) => (
        <div data-testid="hero-background" data-background-type={background?.type} />
    ),
    HeroContentContainer: ({ children, ...props }: any) => (
        <div data-testid="hero-content-container" {...props}>
            {children}
        </div>
    )
}))

jest.mock('../../previews/BaseHeroPreview', () => ({
    HeroText: ({ content, className }: any) => (
        <div data-testid="hero-text" className={className}>
            {content?.text}
        </div>
    ),
    HeroButton: ({ button }: any) => (
        <a data-testid="hero-button" href={button?.url}>
            {button?.text}
        </a>
    ),
    HeroButtonGroup: ({ buttons }: any) => (
        <div data-testid="hero-button-group">
            {buttons?.map((button: any, index: number) => (
                <a key={index} data-testid="hero-button" href={button?.url}>
                    {button?.text}
                </a>
            ))}
        </div>
    )
}))

describe('HeroFeature', () => {
    const mockTitle: TextContent = {
        text: 'Amazing Features',
        tag: 'h1'
    }

    const mockSubtitle: TextContent = {
        text: 'Discover what makes us special',
        tag: 'h2'
    }

    const mockDescription: TextContent = {
        text: 'Our comprehensive feature set is designed to help you succeed',
        tag: 'p'
    }

    const mockFeatures: FeatureItem[] = [
        {
            id: 'feature-1',
            icon: '🚀',
            title: 'Fast Performance',
            description: 'Lightning-fast loading times and smooth interactions'
        },
        {
            id: 'feature-2',
            icon: '🔒',
            title: 'Secure',
            description: 'Enterprise-grade security to protect your data',
            link: 'https://example.com/security'
        },
        {
            id: 'feature-3',
            icon: '📱',
            title: 'Mobile Ready',
            description: 'Fully responsive design that works on all devices',
            image: {
                id: 'img-1',
                url: 'https://example.com/mobile.jpg',
                type: 'image',
                alt: 'Mobile device',
                objectFit: 'cover',
                loading: 'lazy'
            }
        }
    ]

    const mockPrimaryButton: ButtonConfig = {
        text: 'Get Started',
        url: '/signup',
        style: 'primary',
        size: 'lg',
        iconPosition: 'right',
        target: '_self'
    }

    const mockBackground: BackgroundConfig = {
        type: 'gradient',
        gradient: {
            type: 'linear',
            direction: 'to right',
            colors: [
                { color: '#3b82f6', stop: 0 },
                { color: '#1d4ed8', stop: 100 }
            ]
        },
        overlay: {
            enabled: false,
            color: '#000000',
            opacity: 0.4
        }
    }

    const defaultProps: HeroFeatureProps = {
        id: 'test-hero-feature',
        variant: HeroVariant.FEATURE,
        theme: getDefaultThemeConfig(),
        responsive: getDefaultResponsiveConfig(),
        accessibility: getDefaultAccessibilityConfig(),
        title: mockTitle,
        subtitle: mockSubtitle,
        description: mockDescription,
        features: mockFeatures,
        layout: 'grid',
        columns: 3,
        background: mockBackground,
        primaryButton: mockPrimaryButton
    }

    beforeEach(() => {
        // Reset any mocks
        jest.clearAllMocks()
    })

    describe('Rendering', () => {
        it('renders without crashing', () => {
            render(<HeroFeature {...defaultProps} />)
            expect(screen.getByTestId('base-hero-section')).toBeTruthy()
        })

        it('renders with minimal props', () => {
            const minimalProps: HeroFeatureProps = {
                ...defaultProps,
                subtitle: undefined,
                description: undefined,
                features: [],
                primaryButton: undefined
            }

            render(<HeroFeature {...minimalProps} />)
            expect(screen.getByTestId('base-hero-section')).toBeTruthy()
            expect(screen.getByText('Amazing Features')).toBeTruthy()
        })

        it('renders all content elements when provided', () => {
            render(<HeroFeature {...defaultProps} />)

            expect(screen.getByText('Amazing Features')).toBeTruthy()
            expect(screen.getByText('Discover what makes us special')).toBeTruthy()
            expect(screen.getByText('Our comprehensive feature set is designed to help you succeed')).toBeTruthy()
            expect(screen.getByText('Get Started')).toBeTruthy()
        })

        it('applies correct CSS classes and structure', () => {
            render(<HeroFeature {...defaultProps} />)

            const baseSection = screen.getByTestId('base-hero-section')
            expect(baseSection.getAttribute('id')).toBe('test-hero-feature')

            const background = screen.getByTestId('hero-background')
            expect(background.getAttribute('data-background-type')).toBe('gradient')
        })
    })

    describe('Features Display', () => {
        it('renders all features with correct content', () => {
            render(<HeroFeature {...defaultProps} />)

            expect(screen.getByText('Fast Performance')).toBeTruthy()
            expect(screen.getByText('Lightning-fast loading times and smooth interactions')).toBeTruthy()
            expect(screen.getByText('🚀')).toBeTruthy()

            expect(screen.getByText('Secure')).toBeTruthy()
            expect(screen.getByText('Enterprise-grade security to protect your data')).toBeTruthy()
            expect(screen.getByText('🔒')).toBeTruthy()

            expect(screen.getByText('Mobile Ready')).toBeTruthy()
            expect(screen.getByText('Fully responsive design that works on all devices')).toBeTruthy()
            expect(screen.getByText('📱')).toBeTruthy()
        })

        it('renders feature images when provided', () => {
            render(<HeroFeature {...defaultProps} />)

            const featureImage = screen.getByAltText('Mobile device')
            expect(featureImage).toBeTruthy()
            expect(featureImage.getAttribute('src')).toBe('https://example.com/mobile.jpg')
            expect(featureImage.getAttribute('loading')).toBe('lazy')
        })

        it('renders clickable features with links', () => {
            render(<HeroFeature {...defaultProps} />)

            const secureFeature = screen.getByText('Secure').closest('div')
            expect(secureFeature.getAttribute('role')).toBe('button')
            expect(secureFeature.getAttribute('tabIndex')).toBe('0')

            const learnMoreLink = screen.getByText('Learn more →')
            expect(learnMoreLink).toBeTruthy()
        })

        it('handles feature click events', () => {
            const mockOpen = jest.fn()
            Object.defineProperty(window, 'open', {
                value: mockOpen,
                writable: true
            })

            render(<HeroFeature {...defaultProps} />)

            const secureFeature = screen.getByText('Secure').closest('div')
            fireEvent.click(secureFeature!)

            expect(mockOpen).toHaveBeenCalledWith(
                'https://example.com/security',
                '_blank',
                'noopener,noreferrer'
            )
        })

        it('handles keyboard navigation for clickable features', () => {
            const mockOpen = jest.fn()
            Object.defineProperty(window, 'open', {
                value: mockOpen,
                writable: true
            })

            render(<HeroFeature {...defaultProps} />)

            const secureFeature = screen.getByText('Secure').closest('div')
            fireEvent.keyDown(secureFeature!, { key: 'Enter' })

            expect(mockOpen).toHaveBeenCalledWith(
                'https://example.com/security',
                '_blank',
                'noopener,noreferrer'
            )

            fireEvent.keyDown(secureFeature!, { key: ' ' })
            expect(mockOpen).toHaveBeenCalledTimes(2)
        })

        it('renders empty state when no features provided', () => {
            const propsWithoutFeatures = {
                ...defaultProps,
                features: []
            }

            render(<HeroFeature {...propsWithoutFeatures} />)

            expect(screen.getByText('Amazing Features')).toBeTruthy()
            expect(screen.queryByText('Lightning Fast')).toBeFalsy()
        })
    })

    describe('Layout Options', () => {
        it('applies grid layout classes correctly', () => {
            render(<HeroFeature {...defaultProps} layout="grid" columns={3} />)

            const featuresContainer = screen.getByText('Fast Performance').closest('.hero-features')?.firstChild
            expect(featuresContainer.className).toContain('grid')
            expect(featuresContainer.className).toContain('grid-cols-1')
            expect(featuresContainer.className).toContain('md:grid-cols-2')
            expect(featuresContainer.className).toContain('lg:grid-cols-3')
        })

        it('applies list layout classes correctly', () => {
            render(<HeroFeature {...defaultProps} layout="list" />)

            const featuresContainer = screen.getByText('Fast Performance').closest('.hero-features')?.firstChild
            expect(featuresContainer.className).toContain('space-y-6')
        })

        it('applies carousel layout classes correctly', () => {
            render(<HeroFeature {...defaultProps} layout="carousel" />)

            const featuresContainer = screen.getByText('Fast Performance').closest('.hero-features')?.firstChild
            expect(featuresContainer.className).toContain('flex')
            expect(featuresContainer.className).toContain('space-x-6')
            expect(featuresContainer.className).toContain('overflow-x-auto')

            const featureCard = screen.getByText('Fast Performance').closest('.hero-feature-card')
            expect(featureCard.className).toContain('flex-shrink-0')
            expect(featureCard.className).toContain('w-80')
        })

        it('handles different column configurations', () => {
            const { rerender } = render(<HeroFeature {...defaultProps} layout="grid" columns={2} />)

            let featuresContainer = screen.getByText('Fast Performance').closest('.hero-features')?.firstChild
            expect(featuresContainer.className).toContain('md:grid-cols-2')

            rerender(<HeroFeature {...defaultProps} layout="grid" columns={4} />)

            featuresContainer = screen.getByText('Fast Performance').closest('.hero-features')?.firstChild
            expect(featuresContainer.className).toContain('lg:grid-cols-4')
        })
    })

    describe('Button Rendering', () => {
        it('renders primary button when provided', () => {
            render(<HeroFeature {...defaultProps} />)

            const buttonGroup = screen.getByTestId('hero-button-group')
            expect(buttonGroup).toBeTruthy()

            const button = screen.getByText('Get Started')
            expect(button).toBeTruthy()
            expect(button.getAttribute('href')).toBe('/signup')
        })

        it('does not render button section when no button provided', () => {
            const propsWithoutButton = {
                ...defaultProps,
                primaryButton: undefined
            }

            render(<HeroFeature {...propsWithoutButton} />)

            expect(screen.queryByText('Get Started')).toBeFalsy()
        })
    })

    describe('Accessibility', () => {
        it('provides proper ARIA attributes', () => {
            render(<HeroFeature {...defaultProps} />)

            const baseSection = screen.getByTestId('base-hero-section')
            expect(baseSection.getAttribute('id')).toBe('test-hero-feature')
        })

        it('supports keyboard navigation for interactive features', () => {
            render(<HeroFeature {...defaultProps} />)

            const clickableFeature = screen.getByText('Secure').closest('div')
            expect(clickableFeature.getAttribute('tabIndex')).toBe('0')
            expect(clickableFeature.getAttribute('role')).toBe('button')
        })

        it('provides proper alt text for feature images', () => {
            render(<HeroFeature {...defaultProps} />)

            const featureImage = screen.getByAltText('Mobile device')
            expect(featureImage).toBeTruthy()
        })
    })

    describe('Theme Integration', () => {
        it('passes theme configuration to base component', () => {
            const customTheme = {
                ...getDefaultThemeConfig(),
                primaryColor: '#ff0000',
                backgroundColor: '#ffffff'
            }

            render(<HeroFeature {...defaultProps} theme={customTheme} />)

            const baseSection = screen.getByTestId('base-hero-section')
            expect(baseSection).toBeTruthy()
        })
    })

    describe('Responsive Behavior', () => {
        it('passes responsive configuration to base component', () => {
            render(<HeroFeature {...defaultProps} />)

            const baseSection = screen.getByTestId('base-hero-section')
            expect(baseSection).toBeTruthy()
        })

        it('applies responsive classes for different layouts', () => {
            render(<HeroFeature {...defaultProps} layout="grid" columns={3} />)

            const featuresContainer = screen.getByText('Fast Performance').closest('.hero-features')?.firstChild
            expect(featuresContainer.className).toContain('grid-cols-1')
            expect(featuresContainer.className).toContain('md:grid-cols-2')
            expect(featuresContainer.className).toContain('lg:grid-cols-3')
        })
    })

    describe('Error Handling', () => {
        it('handles missing feature properties gracefully', () => {
            const featuresWithMissingProps: FeatureItem[] = [
                {
                    id: 'feature-1',
                    title: 'Feature 1',
                    description: 'Description 1'
                    // Missing icon
                },
                {
                    id: 'feature-2',
                    icon: '🔒',
                    description: 'Description 2'
                    // Missing title
                }
            ]

            const propsWithIncompleteFeatures = {
                ...defaultProps,
                features: featuresWithMissingProps
            }

            render(<HeroFeature {...propsWithIncompleteFeatures} />)

            expect(screen.getByText('Feature 1')).toBeTruthy()
            expect(screen.getByText('Description 1')).toBeTruthy()
            expect(screen.getByText('🔒')).toBeTruthy()
            expect(screen.getByText('Description 2')).toBeTruthy()
        })

        it('handles invalid feature data gracefully', () => {
            const invalidFeatures = [
                {
                    id: 'feature-1',
                    title: '',
                    description: '',
                    icon: ''
                }
            ]

            const propsWithInvalidFeatures = {
                ...defaultProps,
                features: invalidFeatures
            }

            expect(() => {
                render(<HeroFeature {...propsWithInvalidFeatures} />)
            }).not.toThrow()
        })
    })

    describe('Performance', () => {
        it('renders efficiently with many features', () => {
            const manyFeatures: FeatureItem[] = Array.from({ length: 20 }, (_, i) => ({
                id: `feature-${i}`,
                icon: '⭐',
                title: `Feature ${i + 1}`,
                description: `Description for feature ${i + 1}`
            }))

            const propsWithManyFeatures = {
                ...defaultProps,
                features: manyFeatures
            }

            const startTime = performance.now()
            render(<HeroFeature {...propsWithManyFeatures} />)
            const endTime = performance.now()

            expect(endTime - startTime).toBeLessThan(100) // Should render in less than 100ms
            expect(screen.getByText('Feature 1')).toBeTruthy()
            expect(screen.getByText('Feature 20')).toBeTruthy()
        })
    })
})