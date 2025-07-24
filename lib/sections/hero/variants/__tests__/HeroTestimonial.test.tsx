import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { HeroTestimonial } from '../HeroTestimonial'
import {
    HeroTestimonialProps,
    HeroVariant,
    TestimonialItem,
    BackgroundConfig
} from '../../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../../utils'

// Mock the base components
jest.mock('../../base/BaseHeroSection', () => ({
    BaseHeroSection: ({ children, ...props }: any) => (
        <div data-testid="base-hero-section" {...props}>
            {children}
        </div>
    ),
    HeroBackground: ({ background }: { background: BackgroundConfig }) => (
        <div data-testid="hero-background" data-background-type={background.type} />
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
            {content.text}
        </div>
    ),
    HeroButton: ({ config }: any) => (
        <button data-testid="hero-button">{config.text}</button>
    ),
    HeroButtonGroup: ({ buttons }: any) => (
        <div data-testid="hero-button-group">
            {buttons.map((button: any, index: number) => (
                <button key={index} data-testid="hero-button">
                    {button.text}
                </button>
            ))}
        </div>
    )
}))

// Sample testimonials for testing
const sampleTestimonials: TestimonialItem[] = [
    {
        id: 'testimonial-1',
        quote: 'This product has completely transformed our business operations.',
        author: 'John Doe',
        company: 'Tech Corp',
        role: 'CEO',
        rating: 5,
        avatar: {
            id: 'avatar-1',
            url: '/images/john-doe.jpg',
            type: 'image',
            alt: 'John Doe avatar',
            objectFit: 'cover',
            loading: 'lazy'
        }
    },
    {
        id: 'testimonial-2',
        quote: 'Outstanding service and incredible results. Highly recommended!',
        author: 'Jane Smith',
        company: 'Design Studio',
        role: 'Creative Director',
        rating: 5
    },
    {
        id: 'testimonial-3',
        quote: 'The best investment we have made for our company this year.',
        author: 'Mike Johnson',
        company: 'StartupXYZ',
        role: 'Founder',
        rating: 4
    }
]

const defaultBackground: BackgroundConfig = {
    type: 'gradient',
    gradient: {
        type: 'linear',
        direction: '45deg',
        colors: [
            { color: '#3b82f6', stop: 0 },
            { color: '#1d4ed8', stop: 100 }
        ]
    }
}

const defaultProps: HeroTestimonialProps = {
    id: 'test-hero-testimonial',
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
    testimonials: sampleTestimonials,
    layout: 'single',
    autoRotate: false,
    rotationInterval: 5000,
    showRatings: true,
    background: defaultBackground
}

describe('HeroTestimonial', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('renders with default props', () => {
        render(<HeroTestimonial {...defaultProps} />)
        
        expect(screen.getByTestId('base-hero-section')).toBeTruthy()
        expect(screen.getByTestId('hero-background')).toBeTruthy()
        expect(screen.getByTestId('hero-content-container')).toBeTruthy()
    })

    it('displays title and subtitle correctly', () => {
        render(<HeroTestimonial {...defaultProps} />)
        
        expect(screen.getByText('What Our Customers Say')).toBeTruthy()
        expect(screen.getByText('Trusted by thousands of businesses worldwide')).toBeTruthy()
    })

    it('renders testimonials in single layout', () => {
        render(<HeroTestimonial {...defaultProps} />)
        
        // Should show only the first testimonial in single layout
        expect(screen.getByText(sampleTestimonials[0].quote)).toBeTruthy()
        expect(screen.getByText(sampleTestimonials[0].author)).toBeTruthy()
        expect(screen.getByText(`${sampleTestimonials[0].role} at ${sampleTestimonials[0].company}`)).toBeTruthy()
        
        // Should not show other testimonials initially
        expect(screen.queryByText(sampleTestimonials[1].content)).toBeFalsy()
    })

    it('renders testimonials in grid layout', () => {
        const gridProps = { ...defaultProps, layout: 'grid' as const }
        render(<HeroTestimonial {...gridProps} />)
        
        // Should show all testimonials in grid layout
        sampleTestimonials.forEach(testimonial => {
            expect(screen.getByText(testimonial.quote)).toBeTruthy()
            expect(screen.getByText(testimonial.author)).toBeTruthy()
        })
    })

    it('displays star ratings when showRatings is true', () => {
        render(<HeroTestimonial {...defaultProps} />)
        
        // Should show 5 stars for the first testimonial (rating: 5)
        const stars = screen.getAllByText('★')
        expect(stars).toHaveLength(5)
    })

    it('hides star ratings when showRatings is false', () => {
        const noRatingsProps = { ...defaultProps, showRatings: false }
        render(<HeroTestimonial {...noRatingsProps} />)
        
        // Should not show any stars
        expect(screen.queryByText('★')).toBeFalsy()
    })

    it('displays customer avatar when available', () => {
        render(<HeroTestimonial {...defaultProps} />)
        
        const avatar = screen.getByAltText('John Doe avatar')
        expect(avatar).toBeTruthy()
        expect(avatar.getAttribute('src')).toBe('/images/john-doe.jpg')
    })

    it('shows navigation dots for single layout with multiple testimonials', () => {
        render(<HeroTestimonial {...defaultProps} />)
        
        // Should show navigation dots for each testimonial
        const dots = screen.getAllByRole('button', { name: /Go to testimonial/ })
        expect(dots).toHaveLength(sampleTestimonials.length)
    })

    it('allows manual navigation through testimonials', () => {
        render(<HeroTestimonial {...defaultProps} />)
        
        // Initially shows first testimonial
        expect(screen.getByText(sampleTestimonials[0].quote)).toBeTruthy()
        
        // Click on second dot
        const secondDot = screen.getByRole('button', { name: 'Go to testimonial 2' })
        fireEvent.click(secondDot)
        
        // Should now show second testimonial
        expect(screen.getByText(sampleTestimonials[1].quote)).toBeTruthy()
        expect(screen.queryByText(sampleTestimonials[0].quote)).toBeFalsy()
    })

    it('auto-rotates testimonials when autoRotate is enabled', async () => {
        const autoRotateProps = {
            ...defaultProps,
            autoRotate: true,
            rotationInterval: 1000
        }
        render(<HeroTestimonial {...autoRotateProps} />)
        
        // Initially shows first testimonial
        expect(screen.getByText(sampleTestimonials[0].quote)).toBeTruthy()
        
        // Fast-forward time by rotation interval
        jest.advanceTimersByTime(1000)
        
        await waitFor(() => {
            expect(screen.getByText(sampleTestimonials[1].quote)).toBeTruthy()
        })
    })

    it('renders carousel layout with navigation arrows', () => {
        const carouselProps = { ...defaultProps, layout: 'carousel' as const }
        render(<HeroTestimonial {...carouselProps} />)
        
        // Should show navigation arrows
        expect(screen.getByLabelText('Previous testimonial')).toBeTruthy()
        expect(screen.getByLabelText('Next testimonial')).toBeTruthy()
    })

    it('navigates testimonials with carousel arrows', () => {
        const carouselProps = { ...defaultProps, layout: 'carousel' as const }
        render(<HeroTestimonial {...carouselProps} />)
        
        // Initially shows first testimonial
        expect(screen.getByText(sampleTestimonials[0].quote)).toBeTruthy()
        
        // Click next arrow
        const nextButton = screen.getByLabelText('Next testimonial')
        fireEvent.click(nextButton)
        
        // Should show second testimonial
        expect(screen.getByText(sampleTestimonials[1].quote)).toBeTruthy()
        
        // Click previous arrow
        const prevButton = screen.getByLabelText('Previous testimonial')
        fireEvent.click(prevButton)
        
        // Should go back to first testimonial
        expect(screen.getByText(sampleTestimonials[0].quote)).toBeTruthy()
    })

    it('wraps around when navigating past the last testimonial', () => {
        const carouselProps = { ...defaultProps, layout: 'carousel' as const }
        render(<HeroTestimonial {...carouselProps} />)
        
        const nextButton = screen.getByLabelText('Next testimonial')
        
        // Navigate to last testimonial
        fireEvent.click(nextButton) // testimonial 2
        fireEvent.click(nextButton) // testimonial 3
        
        expect(screen.getByText(sampleTestimonials[2].quote)).toBeTruthy()
        
        // Click next again should wrap to first
        fireEvent.click(nextButton)
        expect(screen.getByText(sampleTestimonials[0].quote)).toBeTruthy()
    })

    it('wraps around when navigating before the first testimonial', () => {
        const carouselProps = { ...defaultProps, layout: 'carousel' as const }
        render(<HeroTestimonial {...carouselProps} />)
        
        // Click previous from first testimonial should go to last
        const prevButton = screen.getByLabelText('Previous testimonial')
        fireEvent.click(prevButton)
        
        expect(screen.getByText(sampleTestimonials[2].quote)).toBeTruthy()
    })

    it('renders primary button when provided', () => {
        const propsWithButton = {
            ...defaultProps,
            primaryButton: {
                text: 'Get Started',
                url: '/signup',
                style: 'primary' as const,
                size: 'lg' as const,
                iconPosition: 'left' as const,
                target: '_self' as const
            }
        }
        render(<HeroTestimonial {...propsWithButton} />)
        
        expect(screen.getByTestId('hero-button-group')).toBeTruthy()
        expect(screen.getByText('Get Started')).toBeTruthy()
    })

    it('handles empty testimonials array gracefully', () => {
        const emptyProps = { ...defaultProps, testimonials: [] }
        render(<HeroTestimonial {...emptyProps} />)
        
        // Should still render title and subtitle
        expect(screen.getByText('What Our Customers Say')).toBeTruthy()
        expect(screen.getByText('Trusted by thousands of businesses worldwide')).toBeTruthy()
        
        // Should not show testimonials section
        expect(screen.queryByRole('button', { name: /Go to testimonial/ })).toBeFalsy()
        expect(screen.queryByLabelText('Previous testimonial')).toBeFalsy()
    })

    it('handles testimonials without avatars', () => {
        const testimonialWithoutAvatar: TestimonialItem = {
            id: 'testimonial-no-avatar',
            quote: 'Great product!',
            author: 'Anonymous User',
            rating: 4
        }
        
        const propsWithoutAvatar = {
            ...defaultProps,
            testimonials: [testimonialWithoutAvatar]
        }
        
        render(<HeroTestimonial {...propsWithoutAvatar} />)
        
        expect(screen.getByText('Great product!')).toBeTruthy()
        expect(screen.getByText('Anonymous User')).toBeTruthy()
        // Should not have an avatar image
        expect(screen.queryByRole('img')).toBeFalsy()
    })

    it('handles testimonials without company or role', () => {
        const minimalTestimonial: TestimonialItem = {
            id: 'testimonial-minimal',
            quote: 'Simple but effective!',
            author: 'Simple User',
            rating: 5
        }
        
        const propsMinimal = {
            ...defaultProps,
            testimonials: [minimalTestimonial]
        }
        
        render(<HeroTestimonial {...propsMinimal} />)
        
        expect(screen.getByText('Simple but effective!')).toBeTruthy()
        expect(screen.getByText('Simple User')).toBeTruthy()
        // Should not show company/role info
        expect(screen.queryByText('at')).toBeFalsy()
    })

    it('shows auto-rotate indicator when auto-rotate is enabled', () => {
        const autoRotateProps = {
            ...defaultProps,
            layout: 'carousel' as const,
            autoRotate: true
        }
        render(<HeroTestimonial {...autoRotateProps} />)
        
        expect(screen.getByText('Auto')).toBeTruthy()
    })

    it('applies correct CSS classes for different layouts', () => {
        // Test grid layout
        const { rerender } = render(<HeroTestimonial {...defaultProps} layout="grid" />)
        expect(document.querySelector('.hero-testimonials > div')).toHaveClass('grid')
        
        // Test single layout
        rerender(<HeroTestimonial {...defaultProps} layout="single" />)
        expect(document.querySelector('.hero-testimonials > div')).toHaveClass('flex', 'justify-center')
        
        // Test carousel layout
        rerender(<HeroTestimonial {...defaultProps} layout="carousel" />)
        expect(document.querySelector('.hero-testimonials > div')).toHaveClass('relative')
    })

    it('cleans up auto-rotation timer on unmount', () => {
        const autoRotateProps = {
            ...defaultProps,
            autoRotate: true,
            rotationInterval: 1000
        }
        
        const { unmount } = render(<HeroTestimonial {...autoRotateProps} />)
        
        // Verify timer is set
        expect(jest.getTimerCount()).toBe(1)
        
        // Unmount component
        unmount()
        
        // Timer should be cleared
        expect(jest.getTimerCount()).toBe(0)
    })
})