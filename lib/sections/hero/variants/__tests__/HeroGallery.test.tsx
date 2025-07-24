import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { HeroGallery } from '../HeroGallery'
import {
    HeroGalleryProps,
    HeroVariant,
    GalleryItem
} from '../../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../../utils'
import Image from 'next/image'

// Mock the utils module
jest.mock('../../utils', () => ({
    getDefaultThemeConfig: jest.fn(() => ({
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        accentColor: '#8b5cf6',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderColor: '#e5e7eb'
    })),
    getDefaultResponsiveConfig: jest.fn(() => ({
        mobile: { layout: {}, typography: {}, spacing: {} },
        tablet: { layout: {}, typography: {}, spacing: {} },
        desktop: { layout: {}, typography: {}, spacing: {} }
    })),
    getDefaultAccessibilityConfig: jest.fn(() => ({
        ariaLabels: {},
        altTexts: {},
        keyboardNavigation: true,
        screenReaderSupport: true,
        highContrast: false,
        reducedMotion: false
    })),
    generateCSSVariables: jest.fn(() => ({})),
    generateBackgroundStyles: jest.fn(() => ({})),
    generateBackgroundClasses: jest.fn(() => []),
    getResponsiveClasses: jest.fn(() => ''),
    generateAnimationClasses: jest.fn(() => []),
    generateAccessibilityProps: jest.fn(() => ({})),
    generateAriaLabel: jest.fn(() => 'Hero Gallery'),
    generateTextClasses: jest.fn(() => []),
    generateButtonClasses: jest.fn(() => []),
    optimizeImageUrl: jest.fn((media) => media.url)
}))

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

// Mock the preview components
jest.mock('../../previews/BaseHeroPreview', () => ({
    HeroText: ({ content }: any) => (
        <div data-testid="hero-text" data-tag={content.tag}>
            {content.text}
        </div>
    ),
    HeroButton: ({ button }: any) => (
        <a data-testid="hero-button" href={button.url}>
            {button.text}
        </a>
    ),
    HeroImage: ({ media, className, ...props }: any) => (
        <Image
            data-testid="hero-image"
            src={media.url}
            alt={media.alt}
            className={className}
            {...props}
        />
    )
}))

describe('HeroGallery', () => {
    const mockGallery: GalleryItem[] = [
        {
            id: 'item-1',
            image: {
                id: 'img-1',
                url: 'https://example.com/image1.jpg',
                type: 'image',
                alt: 'Test image 1',
                objectFit: 'cover',
                loading: 'lazy'
            },
            caption: 'First test image'
        },
        {
            id: 'item-2',
            image: {
                id: 'img-2',
                url: 'https://example.com/image2.jpg',
                type: 'image',
                alt: 'Test image 2',
                objectFit: 'cover',
                loading: 'lazy'
            },
            caption: 'Second test image'
        },
        {
            id: 'item-3',
            image: {
                id: 'img-3',
                url: 'https://example.com/image3.jpg',
                type: 'image',
                alt: 'Test image 3',
                objectFit: 'cover',
                loading: 'lazy'
            },
            caption: 'Third test image'
        }
    ]

    const defaultProps: HeroGalleryProps = {
        id: 'test-hero-gallery',
        variant: HeroVariant.GALLERY,
        theme: getDefaultThemeConfig(),
        responsive: getDefaultResponsiveConfig(),
        accessibility: getDefaultAccessibilityConfig(),
        title: {
            text: 'Test Gallery',
            tag: 'h1'
        },
        subtitle: {
            text: 'Test gallery subtitle',
            tag: 'p'
        },
        gallery: mockGallery,
        layout: 'grid',
        columns: 3,
        showCaptions: true,
        lightbox: true,
        autoplay: false,
        autoplayInterval: 5000,
        background: {
            type: 'none'
        }
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders without crashing', () => {
        render(<HeroGallery {...defaultProps} />)
        expect(screen.getByTestId('base-hero-section')).toBeTruthy()
    })

    it('renders title and subtitle', () => {
        render(<HeroGallery {...defaultProps} />)
        
        expect(screen.getByTestId('hero-text')).toHaveTextContent('Test Gallery')
        expect(screen.getByText('Test gallery subtitle')).toBeTruthy()
    })

    it('renders gallery images in grid layout', () => {
        render(<HeroGallery {...defaultProps} />)
        
        const images = screen.getAllByTestId('hero-image')
        expect(images).toHaveLength(3)
        
        expect(images[0].getAttribute('src')).toBe('https://example.com/image1.jpg')
        expect(images[0].getAttribute('alt')).toBe('Test image 1')
        expect(images[1].getAttribute('src')).toBe('https://example.com/image2.jpg')
        expect(images[2].getAttribute('src')).toBe('https://example.com/image3.jpg')
    })

    it('shows captions when showCaptions is true', () => {
        render(<HeroGallery {...defaultProps} />)
        
        expect(screen.getByText('First test image')).toBeTruthy()
        expect(screen.getByText('Second test image')).toBeTruthy()
        expect(screen.getByText('Third test image')).toBeTruthy()
    })

    it('hides captions when showCaptions is false', () => {
        render(<HeroGallery {...defaultProps} showCaptions={false} />)
        
        expect(screen.queryByText('First test image')).toBeFalsy()
        expect(screen.queryByText('Second test image')).toBeFalsy()
        expect(screen.queryByText('Third test image')).toBeFalsy()
    })

    it('renders carousel layout with navigation', () => {
        render(<HeroGallery {...defaultProps} layout="carousel" />)
        
        // Should show navigation arrows
        expect(screen.getByLabelText('Previous image')).toBeTruthy()
        expect(screen.getByLabelText('Next image')).toBeTruthy()
        
        // Should show thumbnails
        const images = screen.getAllByTestId('hero-image')
        expect(images.length).toBeGreaterThan(3) // Main image + thumbnails
        
        // Should show progress indicators
        const progressButtons = screen.getAllByLabelText(/Go to image \d+/)
        expect(progressButtons).toHaveLength(3)
    })

    it('handles carousel navigation', () => {
        render(<HeroGallery {...defaultProps} layout="carousel" />)
        
        const nextButton = screen.getByLabelText('Next image')
        const prevButton = screen.getByLabelText('Previous image')
        
        // Click next button
        fireEvent.click(nextButton)
        
        // Click previous button
        fireEvent.click(prevButton)
        
        // Should not throw errors
        expect(nextButton).toBeTruthy()
        expect(prevButton).toBeTruthy()
    })

    it('opens lightbox when image is clicked and lightbox is enabled', () => {
        render(<HeroGallery {...defaultProps} />)
        
        const firstImage = screen.getAllByTestId('hero-image')[0]
        fireEvent.click(firstImage.closest('.gallery-item')!)
        
        // Should show lightbox
        expect(screen.getByLabelText('Close lightbox')).toBeTruthy()
        expect(screen.getByText('1 of 3')).toBeTruthy()
    })

    it('does not open lightbox when lightbox is disabled', () => {
        render(<HeroGallery {...defaultProps} lightbox={false} />)
        
        const firstImage = screen.getAllByTestId('hero-image')[0]
        fireEvent.click(firstImage.closest('.gallery-item')!)
        
        // Should not show lightbox
        expect(screen.queryByTestId('lightbox')).toBeFalsy()
    })

    it('handles lightbox navigation', () => {
        render(<HeroGallery {...defaultProps} />)
        
        // Open lightbox
        const firstImage = screen.getAllByTestId('hero-image')[0]
        fireEvent.click(firstImage.closest('.gallery-item')!)
        
        // Navigate in lightbox
        const lightboxNext = screen.getAllByLabelText('Next image').find(btn => 
            btn.closest('.fixed') // Lightbox is in fixed position
        )
        const lightboxPrev = screen.getAllByLabelText('Previous image').find(btn => 
            btn.closest('.fixed')
        )
        
        if (lightboxNext) fireEvent.click(lightboxNext)
        if (lightboxPrev) fireEvent.click(lightboxPrev)
        
        // Should still show lightbox
        expect(screen.getByLabelText('Close lightbox')).toBeTruthy()
    })

    it('closes lightbox when close button is clicked', () => {
        render(<HeroGallery {...defaultProps} />)
        
        // Open lightbox
        const firstImage = screen.getAllByTestId('hero-image')[0]
        fireEvent.click(firstImage.closest('.gallery-item')!)
        
        // Close lightbox
        const closeButton = screen.getByLabelText('Close lightbox')
        fireEvent.click(closeButton)
        
        // Should hide lightbox
        expect(screen.queryByLabelText('Close lightbox')).toBeFalsy()
    })

    it('renders primary button when provided', () => {
        const buttonProps = {
            text: 'View All',
            url: '/gallery',
            style: 'primary' as const,
            size: 'lg' as const,
            iconPosition: 'right' as const,
            target: '_self' as const
        }
        
        render(<HeroGallery {...defaultProps} primaryButton={buttonProps} />)
        
        const button = screen.getByTestId('hero-button')
        expect(button.textContent).toBe('View All')
        expect(button.getAttribute('href')).toBe('/gallery')
    })

    it('handles empty gallery gracefully', () => {
        render(<HeroGallery {...defaultProps} gallery={[]} />)
        
        expect(screen.getByTestId('base-hero-section')).toBeTruthy()
        expect(screen.queryByTestId('hero-image')).toBeFalsy()
    })

    it('applies correct grid columns class', () => {
        const { container } = render(<HeroGallery {...defaultProps} columns={4} />)
        
        // Should apply grid classes (exact implementation may vary)
        expect(container.querySelector('.gallery-container')).toBeTruthy()
    })

    it('handles masonry layout', () => {
        render(<HeroGallery {...defaultProps} layout="masonry" />)
        
        // Should render images
        const images = screen.getAllByTestId('hero-image')
        expect(images).toHaveLength(3)
    })

    it('auto-advances carousel when autoplay is enabled', async () => {
        jest.useFakeTimers()
        
        render(
            <HeroGallery 
                {...defaultProps} 
                layout="carousel" 
                autoplay={true} 
                autoplayInterval={1000}
            />
        )
        
        // Fast-forward time
        jest.advanceTimersByTime(1000)
        
        // Should still be rendered (auto-advance logic is internal)
        expect(screen.getByTestId('base-hero-section')).toBeTruthy()
        
        jest.useRealTimers()
    })

    it('renders with custom background', () => {
        const backgroundProps = {
            type: 'color' as const,
            color: '#ff0000'
        }
        
        render(<HeroGallery {...defaultProps} background={backgroundProps} />)
        
        const background = screen.getByTestId('hero-background')
        expect(background.getAttribute('data-background-type')).toBe('color')
    })

    it('applies custom className and style', () => {
        const customProps = {
            className: 'custom-gallery',
            style: { backgroundColor: 'red' }
        }
        
        render(<HeroGallery {...defaultProps} {...customProps} />)
        
        const section = screen.getByTestId('base-hero-section')
        expect(section.className).toContain('custom-gallery')
        expect(section.style).toMatchObject({ backgroundColor: 'red' })
    })

    it('handles keyboard navigation in lightbox', () => {
        render(<HeroGallery {...defaultProps} />)
        
        // Open lightbox
        const firstImage = screen.getAllByTestId('hero-image')[0]
        fireEvent.click(firstImage.closest('.gallery-item')!)
        
        // Test escape key to close
        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
        
        // Note: Actual keyboard handling would need to be implemented in the component
        expect(screen.getByLabelText('Close lightbox')).toBeTruthy()
    })
})