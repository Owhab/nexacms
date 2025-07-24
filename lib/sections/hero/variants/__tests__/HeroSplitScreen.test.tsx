import React from 'react'
import { render, screen } from '@testing-library/react'

import { HeroSplitScreen } from '../HeroSplitScreen'
import {
    HeroSplitScreenProps,
    HeroVariant
} from '../../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../../utils'
import Image from 'next/image'


// Mock the base components
jest.mock('../../base/BaseHeroSection', () => ({
    BaseHeroSection: ({ children, ...props }: any) => (
        <section data-testid="base-hero-section" {...props}>
            {children}
        </section>
    ),
    HeroBackground: ({ background }: any) => (
        <div data-testid="hero-background" data-background-type={background?.type} />
    )
}))

jest.mock('../../previews/BaseHeroPreview', () => ({
    HeroText: ({ content, className }: any) => (
        <div data-testid="hero-text" className={className}>
            {content?.text}
        </div>
    ),
    HeroButtonGroup: ({ buttons }: any) => (
        <div data-testid="hero-button-group">
            {buttons?.map((button: any, index: number) => (
                <button key={index} data-testid={`hero-button-${index}`}>
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

describe('HeroSplitScreen', () => {
    const defaultProps: HeroSplitScreenProps = {
        id: 'test-hero-split-screen',
        variant: HeroVariant.SPLIT_SCREEN,
        theme: getDefaultThemeConfig(),
        responsive: getDefaultResponsiveConfig(),
        accessibility: getDefaultAccessibilityConfig(),
        content: {
            title: {
                text: 'Test Title',
                tag: 'h1'
            },
            subtitle: {
                text: 'Test Subtitle',
                tag: 'h2'
            },
            description: {
                text: 'Test Description',
                tag: 'p'
            },
            buttons: [
                {
                    text: 'Primary Button',
                    url: '#primary',
                    style: 'primary',
                    size: 'lg',
                    iconPosition: 'right',
                    target: '_self'
                },
                {
                    text: 'Secondary Button',
                    url: '#secondary',
                    style: 'outline',
                    size: 'lg',
                    iconPosition: 'left',
                    target: '_self'
                }
            ]
        },
        media: {
            id: 'test-media',
            url: '/test-image.jpg',
            type: 'image',
            alt: 'Test image',
            objectFit: 'cover',
            loading: 'eager'
        },
        layout: 'left',
        contentAlignment: 'center',
        mediaAlignment: 'center',
        background: {
            type: 'color',
            color: '#ffffff'
        }
    }

    it('renders without crashing', () => {
        render(<HeroSplitScreen {...defaultProps} />)
        expect(screen.getByTestId('base-hero-section')).toBeTruthy()
    })

    it('renders all content elements', () => {
        render(<HeroSplitScreen {...defaultProps} />)
        
        expect(screen.getByText('Test Title')).toBeTruthy()
        expect(screen.getByText('Test Subtitle')).toBeTruthy()
        expect(screen.getByText('Test Description')).toBeTruthy()
    })

    it('renders buttons when provided', () => {
        render(<HeroSplitScreen {...defaultProps} />)
        
        expect(screen.getByTestId('hero-button-group')).toBeTruthy()
        expect(screen.getByText('Primary Button')).toBeTruthy()
        expect(screen.getByText('Secondary Button')).toBeTruthy()
    })

    it('renders media when provided', () => {
        render(<HeroSplitScreen {...defaultProps} />)
        
        const image = screen.getByTestId('hero-image')
        expect(image).toBeTruthy()
        expect(image.getAttribute('src')).toBe('/test-image.jpg')
        expect(image.getAttribute('alt')).toBe('Test image')
    })

    it('renders background component', () => {
        render(<HeroSplitScreen {...defaultProps} />)
        
        const background = screen.getByTestId('hero-background')
        expect(background).toBeTruthy()
        expect(background.getAttribute('data-background-type')).toBe('color')
    })

    it('applies correct layout classes for left layout', () => {
        render(<HeroSplitScreen {...defaultProps} layout="left" />)
        
        const container = screen.getByTestId('base-hero-section')
        expect(container.querySelector('.lg\\:flex-row')).toBeTruthy()
    })

    it('applies correct layout classes for right layout', () => {
        render(<HeroSplitScreen {...defaultProps} layout="right" />)
        
        const container = screen.getByTestId('base-hero-section')
        expect(container.querySelector('.lg\\:flex-row-reverse')).toBeTruthy()
    })

    it('handles missing content gracefully', () => {
        const propsWithoutContent = {
            ...defaultProps,
            content: {
                title: {
                    text: 'Only Title',
                    tag: 'h1' as const
                },
                buttons: []
            }
        }
        
        render(<HeroSplitScreen {...propsWithoutContent} />)
        
        expect(screen.getByText('Only Title')).toBeTruthy()
        expect(screen.queryByText('Transform Your Business')).toBeFalsy()
        expect(screen.queryByText('Discover how our cutting-edge technology')).toBeFalsy()
    })

    it('handles missing media gracefully', () => {
        const propsWithoutMedia = {
            ...defaultProps,
            media: null as any
        }
        
        render(<HeroSplitScreen {...propsWithoutMedia} />)
        
        expect(screen.queryByTestId('hero-image')).toBeFalsy()
    })

    it('handles empty buttons array', () => {
        const propsWithoutButtons = {
            ...defaultProps,
            content: {
                ...defaultProps.content,
                buttons: []
            }
        }
        
        render(<HeroSplitScreen {...propsWithoutButtons} />)
        
        expect(screen.queryByText('Primary Button')).toBeFalsy()
    })

    it('applies different content alignment classes', () => {
        const { rerender } = render(
            <HeroSplitScreen {...defaultProps} contentAlignment="start" />
        )
        
        let container = screen.getByTestId('base-hero-section')
        expect(container.querySelector('.justify-start')).toBeTruthy()
        expect(container.querySelector('.text-left')).toBeTruthy()
        
        rerender(<HeroSplitScreen {...defaultProps} contentAlignment="end" />)
        
        container = screen.getByTestId('base-hero-section')
        expect(container.querySelector('.justify-end')).toBeTruthy()
        expect(container.querySelector('.text-right')).toBeTruthy()
    })

    it('applies different media alignment classes', () => {
        const { rerender } = render(
            <HeroSplitScreen {...defaultProps} mediaAlignment="start" />
        )
        
        let container = screen.getByTestId('base-hero-section')
        expect(container.querySelector('.justify-start')).toBeTruthy()
        
        rerender(<HeroSplitScreen {...defaultProps} mediaAlignment="end" />)
        
        container = screen.getByTestId('base-hero-section')
        expect(container.querySelector('.justify-end')).toBeTruthy()
    })

    it('renders video media when type is video', () => {
        const propsWithVideo = {
            ...defaultProps,
            media: {
                id: 'test-video',
                url: '/test-video.mp4',
                type: 'video' as const,
                alt: 'Test video',
                autoplay: true,
                loop: true,
                muted: true,
                controls: false,
                poster: '/test-poster.jpg',
                objectFit: 'cover' as const,
                loading: 'eager' as const
            }
        }
        
        render(<HeroSplitScreen {...propsWithVideo} />)
        
        const video = screen.getByRole('application') // video element
        expect(video).toBeTruthy()
        expect(video.hasAttribute('autoplay')).toBe(true)
        expect(video.hasAttribute('loop')).toBe(true)
        expect(video.hasAttribute('muted')).toBe(true)
        expect(video.getAttribute('poster')).toBe('/test-poster.jpg')
    })

    it('passes through custom className and style', () => {
        const customProps = {
            ...defaultProps,
            className: 'custom-class',
            style: { backgroundColor: 'red' }
        }
        
        render(<HeroSplitScreen {...customProps} />)
        
        const container = screen.getByTestId('base-hero-section')
        expect(container.className).toContain('custom-class')
        expect(container.style).toMatchObject({ backgroundColor: 'red' })
    })

    it('uses default values when props are missing', () => {
        const minimalProps = {
            id: 'minimal-hero',
            variant: HeroVariant.SPLIT_SCREEN,
            theme: getDefaultThemeConfig(),
            responsive: getDefaultResponsiveConfig(),
            accessibility: getDefaultAccessibilityConfig(),
            content: {
                title: {
                    text: 'Minimal Title',
                    tag: 'h1' as const
                },
                buttons: []
            },
            media: {
                id: 'minimal-media',
                url: '/minimal.jpg',
                type: 'image' as const,
                alt: 'Minimal image',
                objectFit: 'cover' as const,
                loading: 'eager' as const
            },
            layout: 'left' as const,
            contentAlignment: 'center' as const,
            mediaAlignment: 'center' as const,
            background: {
                type: 'none' as const
            }
        }
        
        render(<HeroSplitScreen {...minimalProps} />)
        
        expect(screen.getByText('Minimal Title')).toBeTruthy()
        expect(screen.getByTestId('hero-image')).toBeTruthy()
    })
})