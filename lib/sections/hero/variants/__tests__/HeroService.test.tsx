import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import { HeroService } from '../HeroService'
import {
    HeroServiceProps,
    HeroVariant,
    ServiceItem,
    TrustBadge,
    TextContent,
    ButtonConfig,
    BackgroundConfig
} from '../../types'
import Image from 'next/image'

// Mock the base components
jest.mock('../../base/BaseHeroSection', () => ({
    BaseHeroSection: ({ children, ...props }: any) => (
        <div data-testid="base-hero-section" {...props}>
            {children}
        </div>
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
            {content?.text || content}
        </div>
    ),
    HeroButton: ({ button, className }: any) => (
        <button data-testid="hero-button" className={className}>
            {button?.text}
        </button>
    ),
    HeroButtonGroup: ({ buttons, className }: any) => (
        <div data-testid="hero-button-group" className={className}>
            {buttons?.map((button: any, index: number) => (
                <button key={index} data-testid="hero-button">
                    {button?.text}
                </button>
            ))}
        </div>
    ),
    HeroImage: ({ media, className }: any) => (
        <Image
            data-testid="hero-image"
            src={media?.url}
            alt={media?.alt}
            className={className}
        />
    )
}))

// Mock utils
jest.mock('../../utils', () => ({
    getDefaultThemeConfig: () => ({
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderColor: '#e5e7eb'
    }),
    getDefaultResponsiveConfig: () => ({
        mobile: { layout: {}, typography: {}, spacing: {} },
        tablet: { layout: {}, typography: {}, spacing: {} },
        desktop: { layout: {}, typography: {}, spacing: {} }
    }),
    getDefaultAccessibilityConfig: () => ({
        ariaLabels: {},
        altTexts: {},
        keyboardNavigation: true,
        screenReaderSupport: true,
        highContrast: false,
        reducedMotion: false
    })
}))

describe('HeroService', () => {
    const mockTitle: TextContent = {
        text: 'Professional Services',
        tag: 'h1'
    }

    const mockSubtitle: TextContent = {
        text: 'Expert solutions for your business',
        tag: 'h2'
    }

    const mockDescription: TextContent = {
        text: 'We provide comprehensive services designed to help your business grow.',
        tag: 'p'
    }

    const mockServices: ServiceItem[] = [
        {
            id: 'service-1',
            title: 'Consulting',
            description: 'Strategic business consulting',
            icon: '💼',
            features: ['Expert advice', 'Custom solutions']
        },
        {
            id: 'service-2',
            title: 'Development',
            description: 'Custom software development',
            icon: '💻',
            features: ['Web applications', 'Mobile apps'],
            image: {
                id: 'img-1',
                url: '/test-service.jpg',
                type: 'image',
                alt: 'Development service',
                objectFit: 'cover',
                loading: 'lazy'
            }
        }
    ]

    const mockTrustBadges: TrustBadge[] = [
        {
            id: 'badge-1',
            name: 'Google Partner',
            image: {
                id: 'badge-img-1',
                url: '/google-partner.png',
                type: 'image',
                alt: 'Google Partner badge',
                objectFit: 'contain',
                loading: 'lazy'
            },
            link: 'https://google.com'
        },
        {
            id: 'badge-2',
            name: 'AWS Certified',
            image: {
                id: 'badge-img-2',
                url: '/aws-certified.png',
                type: 'image',
                alt: 'AWS Certified badge',
                objectFit: 'contain',
                loading: 'lazy'
            }
        }
    ]

    const mockPrimaryButton: ButtonConfig = {
        text: 'Get Started',
        url: '/contact',
        style: 'primary',
        size: 'lg',
        iconPosition: 'left',
        target: '_self'
    }

    const mockContactButton: ButtonConfig = {
        text: 'Contact Us',
        url: '/contact',
        style: 'outline',
        size: 'lg',
        iconPosition: 'left',
        target: '_self'
    }

    const mockBackground: BackgroundConfig = {
        type: 'color',
        color: '#f8fafc'
    }

    const defaultProps: HeroServiceProps = {
        id: 'test-hero-service',
        variant: HeroVariant.SERVICE,
        theme: {
            primaryColor: '#3b82f6',
            secondaryColor: '#64748b',
            accentColor: '#f59e0b',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            borderColor: '#e5e7eb'
        },
        responsive: {
            mobile: { layout: {}, typography: {}, spacing: {} },
            tablet: { layout: {}, typography: {}, spacing: {} },
            desktop: { layout: {}, typography: {}, spacing: {} }
        } as any,
        accessibility: {
            ariaLabels: {},
            altTexts: {},
            keyboardNavigation: true,
            screenReaderSupport: true,
            highContrast: false,
            reducedMotion: false
        },
        title: mockTitle,
        subtitle: mockSubtitle,
        description: mockDescription,
        services: mockServices,
        trustBadges: mockTrustBadges,
        layout: 'grid',
        showTrustBadges: true,
        background: mockBackground,
        primaryButton: mockPrimaryButton,
        contactButton: mockContactButton
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders without crashing', () => {
        render(<HeroService {...defaultProps} />)
        expect(screen.getByTestId('base-hero-section')).toBeTruthy()
    })

    it('renders title, subtitle, and description', () => {
        render(<HeroService {...defaultProps} />)
        
        expect(screen.getByText('Professional Services')).toBeTruthy()
        expect(screen.getByText('Expert solutions for your business')).toBeTruthy()
        expect(screen.getByText('We provide comprehensive services designed to help your business grow.')).toBeTruthy()
    })

    it('renders action buttons when provided', () => {
        render(<HeroService {...defaultProps} />)
        
        expect(screen.getByText('Get Started')).toBeTruthy()
        expect(screen.getByText('Contact Us')).toBeTruthy()
    })

    it('renders services in grid layout', () => {
        render(<HeroService {...defaultProps} />)
        
        expect(screen.getByText('Consulting')).toBeTruthy()
        expect(screen.getByText('Strategic business consulting')).toBeTruthy()
        expect(screen.getByText('Development')).toBeTruthy()
        expect(screen.getByText('Custom software development')).toBeTruthy()
    })

    it('renders services in list layout', () => {
        const listProps = { ...defaultProps, layout: 'list' as const }
        render(<HeroService {...listProps} />)
        
        expect(screen.getByText('Consulting')).toBeTruthy()
        expect(screen.getByText('Development')).toBeTruthy()
    })

    it('renders service features', () => {
        render(<HeroService {...defaultProps} />)
        
        expect(screen.getByText('Expert advice')).toBeTruthy()
        expect(screen.getByText('Custom solutions')).toBeTruthy()
        expect(screen.getByText('Web applications')).toBeTruthy()
        expect(screen.getByText('Mobile apps')).toBeTruthy()
    })

    it('renders service icons', () => {
        render(<HeroService {...defaultProps} />)
        
        expect(screen.getByText('💼')).toBeTruthy()
        expect(screen.getByText('💻')).toBeTruthy()
    })

    it('renders service images when provided', () => {
        render(<HeroService {...defaultProps} />)
        
        const serviceImage = screen.getByAltText('Development service')
        expect(serviceImage).toBeTruthy()
        expect(serviceImage.getAttribute('src')).toBe('/test-service.jpg')
    })

    it('renders trust badges when showTrustBadges is true', () => {
        render(<HeroService {...defaultProps} />)
        
        expect(screen.getByText('Trusted by Industry Leaders')).toBeTruthy()
        expect(screen.getByAltText('Google Partner badge')).toBeTruthy()
        expect(screen.getByAltText('AWS Certified badge')).toBeTruthy()
    })

    it('does not render trust badges when showTrustBadges is false', () => {
        const propsWithoutTrustBadges = { ...defaultProps, showTrustBadges: false }
        render(<HeroService {...propsWithoutTrustBadges} />)
        
        expect(screen.queryByText('Trusted by 1000+ companies')).toBeFalsy()
    })

    it('renders trust badge links when provided', () => {
        render(<HeroService {...defaultProps} />)
        
        const googlePartnerLink = screen.getByLabelText('Visit Google Partner')
        expect(googlePartnerLink).toBeTruthy()
        expect(googlePartnerLink.getAttribute('href')).toBe('https://google.com')
        expect(googlePartnerLink.getAttribute('target')).toBe('_blank')
        expect(googlePartnerLink.getAttribute('rel')).toBe('noopener noreferrer')
    })

    it('renders service links when provided', () => {
        const servicesWithLinks = [
            { ...mockServices[0], link: '/consulting' },
            { ...mockServices[1], link: '/development' }
        ]
        const propsWithLinks = { ...defaultProps, services: servicesWithLinks }
        
        render(<HeroService {...propsWithLinks} />)
        
        const consultingLink = screen.getByText('Learn More')
        expect(consultingLink).toBeTruthy()
    })

    it('handles empty services array', () => {
        const propsWithoutServices = { ...defaultProps, services: [] }
        render(<HeroService {...propsWithoutServices} />)
        
        expect(screen.getByText('Professional Services')).toBeTruthy()
        expect(screen.queryByText('Consulting')).toBeFalsy()
    })

    it('handles empty trust badges array', () => {
        const propsWithoutBadges = { ...defaultProps, trustBadges: [] }
        render(<HeroService {...propsWithoutBadges} />)
        
        expect(screen.queryByText('Google Partner')).toBeFalsy()
    })

    it('handles missing optional props', () => {
        const minimalProps: HeroServiceProps = {
            id: 'minimal-hero-service',
            variant: HeroVariant.SERVICE,
            theme: defaultProps.theme,
            responsive: defaultProps.responsive,
            accessibility: defaultProps.accessibility,
            title: mockTitle,
            services: [],
            trustBadges: [],
            layout: 'grid',
            showTrustBadges: false,
            background: { type: 'none' }
        }
        
        render(<HeroService {...minimalProps} />)
        expect(screen.getByTestId('base-hero-section')).toBeTruthy()
        expect(screen.getByText('Professional Services')).toBeTruthy()
    })

    it('applies correct CSS classes for grid layout', () => {
        render(<HeroService {...defaultProps} />)
        
        // The grid layout classes should be applied to the services container
        const servicesContainer = screen.getByText('Consulting').closest('.service-card')?.parentElement
        expect(servicesContainer.className).toContain('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')
    })

    it('applies correct CSS classes for list layout', () => {
        const listProps = { ...defaultProps, layout: 'list' as const }
        render(<HeroService {...listProps} />)
        
        // The list layout classes should be applied to the services container
        const servicesContainer = screen.getByText('Consulting').closest('.service-card')?.parentElement
        expect(servicesContainer.className).toContain('space-y-6')
    })

    it('renders background component with correct props', () => {
        render(<HeroService {...defaultProps} />)
        
        const background = screen.getByTestId('hero-background')
        expect(background).toBeTruthy()
        expect(background.getAttribute('data-background-type')).toBe('color')
    })

    it('passes correct props to BaseHeroSection', () => {
        render(<HeroService {...defaultProps} />)
        
        const baseSection = screen.getByTestId('base-hero-section')
        expect(baseSection.getAttribute('id')).toBe('test-hero-service')
    })

    it('handles service without features', () => {
        const serviceWithoutFeatures: ServiceItem = {
            id: 'service-no-features',
            title: 'Simple Service',
            description: 'A service without features'
        }
        const propsWithSimpleService = {
            ...defaultProps,
            services: [serviceWithoutFeatures]
        }
        
        render(<HeroService {...propsWithSimpleService} />)
        
        expect(screen.getByText('Simple Service')).toBeTruthy()
        expect(screen.getByText('A service without features')).toBeTruthy()
    })

    it('handles trust badge without link', () => {
        const badgeWithoutLink: TrustBadge = {
            id: 'badge-no-link',
            name: 'Certification Badge',
            image: {
                id: 'badge-img-no-link',
                url: '/cert-badge.png',
                type: 'image',
                alt: 'Certification badge',
                objectFit: 'contain',
                loading: 'lazy'
            }
        }
        const propsWithBadgeNoLink = {
            ...defaultProps,
            trustBadges: [badgeWithoutLink]
        }
        
        render(<HeroService {...propsWithBadgeNoLink} />)
        
        expect(screen.getByAltText('Certification badge')).toBeTruthy()
        expect(screen.queryByLabelText('Visit Certification Badge')).toBeFalsy()
    })

    it('handles trust badge without image', () => {
        const badgeWithoutImage: TrustBadge = {
            id: 'badge-no-image',
            name: 'Text Badge',
            image: {
                id: '',
                url: '',
                type: 'image',
                alt: '',
                objectFit: 'contain',
                loading: 'lazy'
            }
        }
        const propsWithBadgeNoImage = {
            ...defaultProps,
            trustBadges: [badgeWithoutImage]
        }
        
        render(<HeroService {...propsWithBadgeNoImage} />)
        
        expect(screen.getByText('Text Badge')).toBeTruthy()
    })
})