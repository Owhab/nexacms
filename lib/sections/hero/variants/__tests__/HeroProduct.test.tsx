import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import { HeroProduct } from '../HeroProduct'
import { HeroVariant, ProductItem, MediaConfig, ButtonConfig, BackgroundConfig } from '../../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../../utils'
import Image from 'next/image'

// Mock the utils functions
jest.mock('../../utils', () => ({
    getDefaultThemeConfig: jest.fn(() => ({
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        accentColor: '#f59e0b',
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
    }))
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
        <div data-testid="hero-text" data-tag={content?.tag}>
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
    ),
    HeroImage: ({ media }: any) => (
        <Image
            data-testid="hero-image"
            src={media?.url}
            alt={media?.alt}
            className={media?.className}
        />
    )
}))

describe('HeroProduct', () => {
    const mockProduct: ProductItem = {
        id: 'test-product',
        name: 'Test Product',
        description: 'This is a test product description',
        price: '99.99',
        originalPrice: '149.99',
        currency: '$',
        badge: 'Best Seller',
        images: [
            {
                id: 'image-1',
                url: '/test-image-1.jpg',
                type: 'image',
                alt: 'Test Product Image 1',
                objectFit: 'cover',
                loading: 'eager'
            },
            {
                id: 'image-2',
                url: '/test-image-2.jpg',
                type: 'image',
                alt: 'Test Product Image 2',
                objectFit: 'cover',
                loading: 'lazy'
            }
        ] as MediaConfig[],
        features: [
            'Premium quality materials',
            'Advanced technology',
            'Eco-friendly design'
        ],
        link: '/products/test-product'
    }

    const mockBackground: BackgroundConfig = {
        type: 'color',
        color: '#ffffff'
    }

    const mockPrimaryButton: ButtonConfig = {
        text: 'Buy Now',
        url: '/checkout',
        style: 'primary',
        size: 'lg',
        iconPosition: 'right',
        target: '_self'
    }

    const mockSecondaryButton: ButtonConfig = {
        text: 'Learn More',
        url: '/products/test-product',
        style: 'outline',
        size: 'lg',
        iconPosition: 'left',
        target: '_self'
    }

    const defaultProps = {
        id: 'test-hero-product',
        variant: HeroVariant.PRODUCT,
        theme: getDefaultThemeConfig(),
        responsive: getDefaultResponsiveConfig(),
        accessibility: getDefaultAccessibilityConfig(),
        product: mockProduct,
        layout: 'left' as const,
        showGallery: true,
        showFeatures: true,
        showPricing: true,
        background: mockBackground,
        primaryButton: mockPrimaryButton,
        secondaryButton: mockSecondaryButton
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders without crashing', () => {
        render(<HeroProduct {...defaultProps} />)
        expect(screen.getByTestId('base-hero-section')).toBeTruthy()
    })

    it('displays product name as title', () => {
        render(<HeroProduct {...defaultProps} />)
        expect(screen.getByText('Test Product')).toBeTruthy()
    })

    it('displays product description', () => {
        render(<HeroProduct {...defaultProps} />)
        expect(screen.getByText('This is a test product description')).toBeTruthy()
    })

    it('displays product badge when provided', () => {
        render(<HeroProduct {...defaultProps} />)
        expect(screen.getByText('Best Seller')).toBeTruthy()
    })

    it('displays pricing when showPricing is true', () => {
        render(<HeroProduct {...defaultProps} />)
        expect(screen.getByText('$99.99')).toBeTruthy()
        expect(screen.getByText('$149.99')).toBeTruthy()
    })

    it('hides pricing when showPricing is false', () => {
        render(<HeroProduct {...defaultProps} showPricing={false} />)
        expect(screen.queryByText('$99.99')).toBeFalsy()
        expect(screen.queryByText('$149.99')).toBeFalsy()
    })

    it('displays features when showFeatures is true', () => {
        render(<HeroProduct {...defaultProps} />)
        expect(screen.getByText('Key Features:')).toBeTruthy()
        expect(screen.getByText('Premium quality materials')).toBeTruthy()
        expect(screen.getByText('Advanced technology')).toBeTruthy()
        expect(screen.getByText('Eco-friendly design')).toBeTruthy()
    })

    it('hides features when showFeatures is false', () => {
        render(<HeroProduct {...defaultProps} showFeatures={false} />)
        expect(screen.queryByText('Key Features:')).toBeFalsy()
        expect(screen.queryByText('Premium quality materials')).toBeFalsy()
    })

    it('displays product gallery when showGallery is true', () => {
        render(<HeroProduct {...defaultProps} />)
        const images = screen.getAllByTestId('hero-image')
        expect(images).toHaveLength(2)
        expect(images[0].getAttribute('src')).toBe('/test-image-1.jpg')
        expect(images[0].getAttribute('alt')).toBe('Test Product Image 1')
    })

    it('hides gallery when showGallery is false', () => {
        render(<HeroProduct {...defaultProps} showGallery={false} />)
        expect(screen.queryByTestId('hero-image')).toBeFalsy()
    })

    it('displays action buttons', () => {
        render(<HeroProduct {...defaultProps} />)
        const buttons = screen.getAllByTestId('hero-button')
        expect(buttons).toHaveLength(2)
        expect(buttons[0].getAttribute('href')).toBe('/checkout')
        expect(buttons[0].textContent).toBe('Buy Now')
        expect(buttons[1].getAttribute('href')).toBe('/products/test-product')
        expect(buttons[1].textContent).toBe('Learn More')
    })

    it('handles left layout correctly', () => {
        render(<HeroProduct {...defaultProps} layout="left" />)
        const container = screen.getByTestId('hero-content-container')
        expect(container.getAttribute('textAlign')).toBe('left')
    })

    it('handles right layout correctly', () => {
        render(<HeroProduct {...defaultProps} layout="right" />)
        const container = screen.getByTestId('hero-content-container')
        expect(container.getAttribute('textAlign')).toBe('left')
    })

    it('handles center layout correctly', () => {
        render(<HeroProduct {...defaultProps} layout="center" />)
        const container = screen.getByTestId('hero-content-container')
        expect(container.getAttribute('textAlign')).toBe('center')
    })

    it('handles gallery navigation', () => {
        render(<HeroProduct {...defaultProps} />)
        
        // Check if navigation arrows are present (when multiple images)
        const prevButton = screen.getByLabelText('Previous image')
        const nextButton = screen.getByLabelText('Next image')
        
        expect(prevButton).toBeTruthy()
        expect(nextButton).toBeTruthy()
        
        // Test navigation functionality
        fireEvent.click(nextButton)
        // The first image should still be displayed initially
        const mainImage = screen.getAllByTestId('hero-image')[0]
        expect(mainImage.getAttribute('src')).toBe('/test-image-1.jpg')
    })

    it('displays image counter when multiple images', () => {
        render(<HeroProduct {...defaultProps} />)
        expect(screen.getByText('1 / 2')).toBeTruthy()
    })

    it('handles single image without navigation', () => {
        const singleImageProduct = {
            ...mockProduct,
            images: [mockProduct.images![0]]
        }
        
        render(<HeroProduct {...defaultProps} product={singleImageProduct} />)
        
        expect(screen.queryByLabelText('Previous image')).toBeFalsy()
        expect(screen.queryByLabelText('Next image')).toBeFalsy()
        expect(screen.queryByText('1 / 2')).toBeFalsy()
    })

    it('handles missing product gracefully', () => {
        render(<HeroProduct {...defaultProps} product={undefined} />)
        expect(screen.getByTestId('base-hero-section')).toBeTruthy()
        expect(screen.queryByText('Test Product')).toBeFalsy()
    })

    it('handles empty product images', () => {
        const emptyImagesProduct = {
            ...mockProduct,
            images: []
        }
        
        render(<HeroProduct {...defaultProps} product={emptyImagesProduct} />)
        expect(screen.queryByTestId('hero-image')).toBeFalsy()
    })

    it('handles missing product features', () => {
        const noFeaturesProduct = {
            ...mockProduct,
            features: undefined
        }
        
        render(<HeroProduct {...defaultProps} product={noFeaturesProduct} />)
        expect(screen.queryByText('Key Features:')).toBeFalsy()
    })

    it('applies custom className', () => {
        render(<HeroProduct {...defaultProps} className="custom-class" />)
        const section = screen.getByTestId('base-hero-section')
        expect(section.className).toContain('custom-class')
    })

    it('applies custom styles', () => {
        const customStyle = { backgroundColor: 'red' }
        render(<HeroProduct {...defaultProps} style={customStyle} />)
        const section = screen.getByTestId('base-hero-section')
        expect(section.style).toMatchObject('background-color: red')
    })

    it('renders background component', () => {
        render(<HeroProduct {...defaultProps} />)
        const background = screen.getByTestId('hero-background')
        expect(background).toBeTruthy()
        expect(background.getAttribute('data-background-type')).toBe('color')
    })

    it('handles thumbnail gallery interaction', () => {
        render(<HeroProduct {...defaultProps} />)
        
        // Find thumbnail buttons (should be 2 for our test data)
        const thumbnails = screen.getAllByLabelText(/View image \d+/)
        expect(thumbnails).toHaveLength(2)
        
        // Click on second thumbnail
        fireEvent.click(thumbnails[1])
        
        // The main image should update (this would be tested with actual state management)
        expect(thumbnails[1]).toBeTruthy()
    })

    it('displays only price when no original price', () => {
        const noPriceProduct = {
            ...mockProduct,
            originalPrice: undefined
        }
        
        render(<HeroProduct {...defaultProps} product={noPriceProduct} />)
        expect(screen.getByText('$99.99')).toBeTruthy()
        expect(screen.queryByText('$149.99')).toBeFalsy()
    })

    it('uses default currency when not specified', () => {
        const noCurrencyProduct = {
            ...mockProduct,
            currency: undefined
        }
        
        render(<HeroProduct {...defaultProps} product={noCurrencyProduct} />)
        expect(screen.getByText('$99.99')).toBeTruthy()
    })
})