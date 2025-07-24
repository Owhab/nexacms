import React from 'react'
import { render, screen } from '@testing-library/react'
import { HeroCTA } from '../HeroCTA'
import { HeroVariant } from '../../types'
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
    HeroButton: ({ button, className }: any) => (
        <a data-testid="hero-button" href={button?.url} className={className}>
            {button?.text}
        </a>
    ),
    HeroButtonGroup: ({ buttons, className }: any) => (
        <div data-testid="hero-button-group" className={className}>
            {buttons?.map((button: any, index: number) => (
                <a key={index} data-testid="hero-button" href={button?.url}>
                    {button?.text}
                </a>
            ))}
        </div>
    )
}))

describe('HeroCTA', () => {
    const defaultProps = {
        id: 'test-hero-cta',
        variant: HeroVariant.CTA,
        theme: getDefaultThemeConfig(),
        responsive: getDefaultResponsiveConfig(),
        accessibility: getDefaultAccessibilityConfig(),
        title: {
            text: 'Transform Your Business Today',
            tag: 'h1' as const
        },
        subtitle: {
            text: 'Join thousands of successful companies',
            tag: 'h2' as const
        },
        description: {
            text: 'Get the tools and insights you need to grow your business faster than ever before.',
            tag: 'p' as const
        },
        primaryButton: {
            text: 'Start Free Trial',
            url: '#signup',
            style: 'primary' as const,
            size: 'xl' as const,
            iconPosition: 'right' as const,
            target: '_self' as const
        },
        background: {
            type: 'gradient' as const,
            gradient: {
                type: 'linear' as const,
                direction: '135deg',
                colors: [
                    { color: '#667eea', stop: 0 },
                    { color: '#764ba2', stop: 100 }
                ]
            }
        },
        layout: 'center' as const,
        showBenefits: true
    }

    it('renders without crashing', () => {
        render(<HeroCTA {...defaultProps} />)
        expect(screen.getByTestId('base-hero-section')).toBeTruthy()
    })

    it('displays the title correctly', () => {
        render(<HeroCTA {...defaultProps} />)
        expect(screen.getByText('Transform Your Business Today')).toBeTruthy()
    })

    it('displays the subtitle correctly', () => {
        render(<HeroCTA {...defaultProps} />)
        expect(screen.getByText('Join thousands of successful companies')).toBeTruthy()
    })

    it('displays the description correctly', () => {
        render(<HeroCTA {...defaultProps} />)
        expect(screen.getByText('Get the tools and insights you need to grow your business faster than ever before.')).toBeTruthy()
    })

    it('displays the primary button correctly', () => {
        render(<HeroCTA {...defaultProps} />)
        const button = screen.getByText('Start Free Trial')
        expect(button).toBeTruthy()
        expect(button.closest('a')?.getAttribute('href')).toBe('#signup')
    })

    it('displays urgency text when provided', () => {
        const propsWithUrgency = {
            ...defaultProps,
            urgencyText: {
                text: 'Limited Time: 50% Off!',
                tag: 'span' as const
            }
        }
        render(<HeroCTA {...propsWithUrgency} />)
        expect(screen.getByText('Limited Time: 50% Off!')).toBeTruthy()
    })

    it('displays benefits list when showBenefits is true', () => {
        const propsWithBenefits = {
            ...defaultProps,
            benefits: [
                'No setup fees',
                '24/7 support',
                'Money back guarantee'
            ],
            showBenefits: true
        }
        render(<HeroCTA {...propsWithBenefits} />)
        expect(screen.getByText('No setup fees')).toBeTruthy()
        expect(screen.getByText('24/7 support')).toBeTruthy()
        expect(screen.getByText('Money back guarantee')).toBeTruthy()
    })

    it('hides benefits list when showBenefits is false', () => {
        const propsWithoutBenefits = {
            ...defaultProps,
            benefits: ['No setup fees', '24/7 support'],
            showBenefits: false
        }
        render(<HeroCTA {...propsWithoutBenefits} />)
        expect(screen.queryByText('No setup fees')).toBeFalsy()
        expect(screen.queryByText('24/7 support')).toBeFalsy()
    })

    it('displays secondary button when provided', () => {
        const propsWithSecondaryButton = {
            ...defaultProps,
            secondaryButton: {
                text: 'Watch Demo',
                url: '#demo',
                style: 'outline' as const,
                size: 'lg' as const,
                iconPosition: 'left' as const,
                target: '_self' as const
            }
        }
        render(<HeroCTA {...propsWithSecondaryButton} />)
        const button = screen.getByText('Watch Demo')
        expect(button).toBeTruthy()
        expect(button.closest('a')?.getAttribute('href')).toBe('#demo')
    })

    it('applies center layout correctly', () => {
        render(<HeroCTA {...defaultProps} layout="center" />)
        const contentContainer = screen.getByTestId('hero-content-container')
        expect(contentContainer.getAttribute('textAlign')).toBe('center')
    })

    it('applies split layout correctly', () => {
        render(<HeroCTA {...defaultProps} layout="split" />)
        const contentContainer = screen.getByTestId('hero-content-container')
        expect(contentContainer.getAttribute('textAlign')).toBe('left')
    })

    it('renders background component', () => {
        render(<HeroCTA {...defaultProps} />)
        const background = screen.getByTestId('hero-background')
        expect(background).toBeTruthy()
        expect(background.getAttribute('data-background-type')).toBe('gradient')
    })

    it('displays trust indicators', () => {
        render(<HeroCTA {...defaultProps} />)
        expect(screen.getByText('Trusted by thousands of customers worldwide')).toBeTruthy()
        expect(screen.getByText('⭐⭐⭐⭐⭐ 4.9/5')).toBeTruthy()
        expect(screen.getByText('🔒 Secure')).toBeTruthy()
        expect(screen.getByText('📞 24/7 Support')).toBeTruthy()
        expect(screen.getByText('💰 Money Back')).toBeTruthy()
    })

    it('handles missing optional props gracefully', () => {
        const minimalProps = {
            id: 'test-hero-cta',
            variant: HeroVariant.CTA,
            theme: getDefaultThemeConfig(),
            responsive: getDefaultResponsiveConfig(),
            accessibility: getDefaultAccessibilityConfig(),
            primaryButton: {
                text: 'Get Started',
                url: '#',
                style: 'primary' as const,
                size: 'lg' as const,
                iconPosition: 'right' as const,
                target: '_self' as const
            },
            background: {
                type: 'color' as const,
                color: '#ffffff'
            },
            layout: 'center' as const,
            showBenefits: false
        }
        
        expect(() => render(<HeroCTA {...minimalProps} />)).not.toThrow()
    })

    it('applies correct CSS classes for layout variants', () => {
        const { rerender } = render(<HeroCTA {...defaultProps} layout="center" />)
        
        // Test center layout
        expect(screen.getByTestId('hero-content-container').getAttribute('maxWidth')).toBe('4xl')
        
        // Test split layout
        rerender(<HeroCTA {...defaultProps} layout="split" />)
        expect(screen.getByTestId('hero-content-container').getAttribute('maxWidth')).toBe('6xl')
    })

    it('renders benefits in split layout with proper styling', () => {
        const propsWithSplitLayout = {
            ...defaultProps,
            layout: 'split' as const,
            benefits: ['Benefit 1', 'Benefit 2'],
            showBenefits: true
        }
        
        render(<HeroCTA {...propsWithSplitLayout} />)
        expect(screen.getByText('Why Choose Us?')).toBeTruthy()
        expect(screen.getByText('Benefit 1')).toBeTruthy()
        expect(screen.getByText('Benefit 2')).toBeTruthy()
    })
})