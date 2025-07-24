import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HeroVideo } from '../HeroVideo'
import { HeroVariant } from '../../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../../utils'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
})
window.IntersectionObserver = mockIntersectionObserver

describe('HeroVideo', () => {
    const defaultProps = {
        id: 'test-hero-video',
        variant: HeroVariant.VIDEO,
        theme: getDefaultThemeConfig(),
        responsive: getDefaultResponsiveConfig(),
        accessibility: getDefaultAccessibilityConfig(),
        video: {
            id: 'test-video',
            url: '/test-video.mp4',
            type: 'video' as const,
            autoplay: true,
            loop: true,
            muted: true,
            controls: false,
            poster: '/test-poster.jpg',
            objectFit: 'cover' as const,
            loading: 'eager' as const
        },
        overlay: {
            enabled: true,
            color: '#000000',
            opacity: 0.4
        },
        content: {
            title: {
                text: 'Test Video Hero',
                tag: 'h1' as const
            },
            subtitle: {
                text: 'Test Subtitle',
                tag: 'h2' as const
            },
            description: {
                text: 'Test description for video hero',
                tag: 'p' as const
            },
            buttons: [
                {
                    text: 'Watch Demo',
                    url: '#demo',
                    style: 'primary' as const,
                    size: 'lg' as const,
                    icon: '▶️',
                    iconPosition: 'left' as const,
                    target: '_self' as const
                }
            ],
            position: 'center' as const
        }
    }

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks()
    })

    it('renders video hero with all content', () => {
        render(<HeroVideo {...defaultProps} />)

        // Check if title is rendered
        expect(screen.getByText('Test Video Hero')).toBeTruthy()
        expect(screen.getByText('Test Subtitle')).toBeTruthy()
        expect(screen.getByText('Test description for video hero')).toBeTruthy()

        // Check if button is rendered
        expect(screen.getByText('Watch Demo')).toBeTruthy()

        // Check if video element is rendered
        const video = screen.getByRole('presentation', { hidden: true })
        expect(video).toBeTruthy()
        expect(video.getAttribute('src')).toBe('/test-video.mp4')
    })

    it('renders video with correct attributes', () => {
        render(<HeroVideo {...defaultProps} />)

        const video = document.querySelector('video')
        expect(video).toBeTruthy()
        if (video) {
            expect(video.hasAttribute('autoplay')).toBe(true)
            expect(video.hasAttribute('loop')).toBe(true)
            expect(video.hasAttribute('muted')).toBe(true)
            expect(video.getAttribute('poster')).toBe('/test-poster.jpg')
            expect(video.hasAttribute('controls')).toBe(false)
        }
    })

    it('renders overlay when enabled', () => {
        render(<HeroVideo {...defaultProps} />)

        const overlay = document.querySelector('[style*="background-color: rgb(0, 0, 0)"]')
        expect(overlay).toBeTruthy()
    })

    it('does not render overlay when disabled', () => {
        const propsWithoutOverlay = {
            ...defaultProps,
            overlay: {
                enabled: false,
                color: '#000000',
                opacity: 0.4
            }
        }

        render(<HeroVideo {...propsWithoutOverlay} />)

        const overlay = document.querySelector('[style*="background-color"]')
        expect(overlay).not.toBeTruthy()
    })

    it('renders content in different positions', () => {
        const positions = ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'] as const

        positions.forEach(position => {
            const { rerender } = render(
                <HeroVideo
                    {...defaultProps}
                    content={{
                        ...defaultProps.content,
                        position
                    }}
                />
            )

            const contentContainer = document.querySelector('.hero-content-container')
            expect(contentContainer).toBeTruthy()

            // Clean up for next iteration
            rerender(<div />)
        })
    })

    it('renders video controls when enabled', () => {
        const propsWithControls = {
            ...defaultProps,
            video: {
                ...defaultProps.video,
                controls: true
            }
        }

        render(<HeroVideo {...propsWithControls} />)

        // Controls should be rendered after video loads
        // We'll simulate video load event
        const video = document.querySelector('video')
        if (video) {
            fireEvent.loadedData(video)
        }

        // Check for control buttons (they appear after video loads)
        waitFor(() => {
            const playButton = screen.getByLabelText('Play/Pause video')
            const muteButton = screen.getByLabelText('Mute/Unmute video')
            expect(playButton).toBeTruthy()
            expect(muteButton).toBeTruthy()
        })
    })

    it('handles video load events', () => {
        render(<HeroVideo {...defaultProps} />)

        const video = document.querySelector('video')
        expect(video).toBeTruthy()

        // Simulate video loaded
        if (video) {
            fireEvent.loadedData(video)
        }

        // Loading indicator should not be visible after load
        expect(screen.queryByText('Loading video...')).toBeFalsy()
    })

    it('handles video error events', () => {
        render(<HeroVideo {...defaultProps} />)

        const video = document.querySelector('video')
        expect(video).toBeTruthy()

        // Simulate video error
        if (video) {
            fireEvent.error(video)
        }

        // Error message should be displayed
        waitFor(() => {
            expect(screen.getByText('Unable to load video')).toBeTruthy()
        })
    })

    it('renders fallback poster image', () => {
        render(<HeroVideo {...defaultProps} />)

        // Initially, poster should be shown as fallback
        const posterImage = document.querySelector('img[src="/test-poster.jpg"]')
        expect(posterImage).toBeTruthy()
    })

    it('renders without video when video prop is missing', () => {
        const propsWithoutVideo = {
            ...defaultProps,
            video: undefined as any
        }

        render(<HeroVideo {...propsWithoutVideo} />)

        // Should still render content
        expect(screen.getByText('Test Video Hero')).toBeTruthy()

        // But no video element
        const video = document.querySelector('video')
        expect(video).not.toBeTruthy()
    })

    it('renders with minimal content', () => {
        const minimalProps = {
            ...defaultProps,
            content: {
                title: {
                    text: 'Minimal Hero',
                    tag: 'h1' as const
                },
                buttons: [],
                position: 'center' as const
            }
        }

        render(<HeroVideo {...minimalProps} />)

        expect(screen.getByText('Minimal Hero')).toBeTruthy()
        expect(screen.queryByText('Test Subtitle')).toBeFalsy()
        expect(screen.queryByText('Test description for video hero')).toBeFalsy()
    })

    it('applies custom className and style', () => {
        const customProps = {
            ...defaultProps,
            className: 'custom-hero-class',
            style: { backgroundColor: 'red' }
        }

        render(<HeroVideo {...customProps} />)

        const heroSection = document.querySelector('.hero-section') as HTMLElement
        expect(heroSection).toBeTruthy()
        if (heroSection) {
            expect(heroSection.className).toContain('custom-hero-class')
            expect(heroSection.style.backgroundColor).toBe('red')
        }
    })

    it('handles button clicks', () => {
        render(<HeroVideo {...defaultProps} />)

        const button = screen.getByText('Watch Demo')
        fireEvent.click(button)

        // Button should have correct href
        expect(button.closest('a')?.getAttribute('href')).toBe('#demo')
    })

    it('renders multiple buttons', () => {
        const propsWithMultipleButtons = {
            ...defaultProps,
            content: {
                ...defaultProps.content,
                buttons: [
                    {
                        text: 'Primary Button',
                        url: '#primary',
                        style: 'primary' as const,
                        size: 'lg' as const,
                        iconPosition: 'left' as const,
                        target: '_self' as const
                    },
                    {
                        text: 'Secondary Button',
                        url: '#secondary',
                        style: 'outline' as const,
                        size: 'md' as const,
                        iconPosition: 'right' as const,
                        target: '_blank' as const
                    }
                ]
            }
        }

        render(<HeroVideo {...propsWithMultipleButtons} />)

        expect(screen.getByText('Primary Button')).toBeTruthy()
        expect(screen.getByText('Secondary Button')).toBeTruthy()
    })

    it('supports different video formats', () => {
        const propsWithWebM = {
            ...defaultProps,
            video: {
                ...defaultProps.video,
                url: '/test-video.webm'
            }
        }

        render(<HeroVideo {...propsWithWebM} />)

        const video = document.querySelector('video')
        const sources = video?.querySelectorAll('source')

        expect(sources).toHaveLength(2)
        expect(sources?.[0].getAttribute('src')).toBe('/test-video.webm')
        expect(sources?.[0].getAttribute('type')).toBe('video/mp4')
        expect(sources?.[1].getAttribute('src')).toBe('/test-video.webm')
        expect(sources?.[1].getAttribute('type')).toBe('video/webm')
    })
})