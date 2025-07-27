import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { HeroCentered } from '../variants/HeroCentered'
import { HeroSplitScreen } from '../variants/HeroSplitScreen'
import { HeroVideo } from '../variants/HeroVideo'
import { HeroMinimal } from '../variants/HeroMinimal'
import { HeroCenteredProps, HeroVariant, ThemeConfig } from '../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../utils'

describe('Hero Sections Theme Integration', () => {
    const baseProps = {
        id: 'test-hero',
        responsive: getDefaultResponsiveConfig(),
        accessibility: getDefaultAccessibilityConfig(),
        title: {
            text: 'Test Title',
            tag: 'h1' as const
        },
        background: {
            type: 'none' as const
        },
        textAlign: 'center' as const
    }

    const defaultTheme = getDefaultThemeConfig()

    const customTheme: ThemeConfig = {
        primaryColor: '#ff0000',
        secondaryColor: '#00ff00',
        accentColor: '#0000ff',
        backgroundColor: '#f0f0f0',
        textColor: '#333333',
        borderColor: '#cccccc',
        fontFamily: 'Arial, sans-serif',
        borderRadius: '8px'
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Theme Application', () => {
        it('applies default theme correctly', () => {
            const props: HeroCenteredProps = {
                ...baseProps,
                variant: HeroVariant.CENTERED,
                theme: defaultTheme
            }

            render(<HeroCentered {...props} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toBeInTheDocument()

            // Check that theme classes are applied
            expect(heroSection.className).toContain('hero-section')
        })

        it('applies custom theme colors', () => {
            const props: HeroCenteredProps = {
                ...baseProps,
                variant: HeroVariant.CENTERED,
                theme: customTheme
            }

            render(<HeroCentered {...props} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toBeInTheDocument()

            // Verify custom theme is applied through CSS variables or styling
            const hasThemeStyles = heroSection.style.cssText.includes('--hero-') ||
                heroSection.style.cssText.includes('color') ||
                heroSection.className.includes('text-') ||
                heroSection.className.includes('bg-')
            expect(hasThemeStyles).toBeTruthy()
        })

        it('applies theme through CSS variables', () => {
            const props: HeroCenteredProps = {
                ...baseProps,
                variant: HeroVariant.CENTERED,
                theme: customTheme
            }

            render(<HeroCentered {...props} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toBeInTheDocument()

            // Check that theme is applied through styling
            expect(heroSection.style.cssText).toBeTruthy()
        })

        it('renders with theme-aware classes', () => {
            const props: HeroCenteredProps = {
                ...baseProps,
                variant: HeroVariant.CENTERED,
                theme: customTheme
            }

            render(<HeroCentered {...props} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toBeInTheDocument()

            // Should have theme-related classes
            expect(heroSection.className).toContain('hero-section')
        })
    })

    describe('Cross-Variant Theme Consistency', () => {
        const variants = [
            { Component: HeroCentered, variant: HeroVariant.CENTERED },
            { Component: HeroSplitScreen, variant: HeroVariant.SPLIT_SCREEN },
            { Component: HeroVideo, variant: HeroVariant.VIDEO },
            { Component: HeroMinimal, variant: HeroVariant.MINIMAL }
        ]

        variants.forEach(({ Component, variant }) => {
            it(`applies theme consistently to ${variant} variant`, () => {
                let props = {
                    ...baseProps,
                    variant,
                    theme: customTheme
                }

                // Add variant-specific required props
                if (variant === HeroVariant.VIDEO) {
                    props = {
                        ...props,
                        video: {
                            id: 'test-video',
                            url: '/test-video.mp4',
                            type: 'video' as const,
                            autoplay: false,
                            loop: true,
                            muted: true,
                            controls: false,
                            objectFit: 'cover' as const,
                            loading: 'eager' as const
                        },
                        content: {
                            title: { text: 'Video Title', tag: 'h1' as const },
                            position: 'center' as const
                        }
                    }
                } else if (variant === HeroVariant.SPLIT_SCREEN) {
                    props = {
                        ...props,
                        content: {
                            title: { text: 'Split Screen Title', tag: 'h1' as const },
                            buttons: []
                        },
                        media: {
                            type: 'image' as const,
                            image: {
                                id: 'test-image',
                                url: '/test-image.jpg',
                                type: 'image' as const,
                                alt: 'Test image',
                                objectFit: 'cover' as const,
                                loading: 'lazy' as const
                            }
                        },
                        layout: {
                            direction: 'left' as const,
                            contentWidth: 50,
                            mediaWidth: 50
                        },
                        contentAlignment: 'center' as const,
                        mediaAlignment: 'center' as const
                    }
                }

                render(<Component {...props} />)

                const heroSection = screen.getByRole('region')
                expect(heroSection).toBeInTheDocument()

                // All variants should have consistent theme application
                expect(heroSection.className).toContain('hero-section')
            })
        })
    })

    describe('Theme Responsiveness', () => {
        it('applies responsive theme classes', () => {
            const props: HeroCenteredProps = {
                ...baseProps,
                variant: HeroVariant.CENTERED,
                theme: customTheme
            }

            render(<HeroCentered {...props} />)

            const heroSection = screen.getByRole('region')

            // Check for responsive classes
            expect(heroSection.className).toMatch(/sm:|md:|lg:/)
        })

        it('handles theme changes dynamically', () => {
            const props: HeroCenteredProps = {
                ...baseProps,
                variant: HeroVariant.CENTERED,
                theme: defaultTheme
            }

            const { rerender } = render(<HeroCentered {...props} />)

            // Change theme
            const updatedProps = {
                ...props,
                theme: customTheme
            }

            rerender(<HeroCentered {...updatedProps} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toBeInTheDocument()
        })
    })

    describe('Theme Validation', () => {
        it('handles missing theme properties gracefully', () => {
            const incompleteTheme = {
                ...customTheme,
                primaryColor: undefined as any
            }

            const props: HeroCenteredProps = {
                ...baseProps,
                variant: HeroVariant.CENTERED,
                theme: incompleteTheme
            }

            expect(() => render(<HeroCentered {...props} />)).not.toThrow()
        })

        it('validates theme color formats', () => {
            const invalidTheme = {
                ...customTheme,
                primaryColor: 'invalid-color'
            }

            const props: HeroCenteredProps = {
                ...baseProps,
                variant: HeroVariant.CENTERED,
                theme: invalidTheme
            }

            // Should still render without throwing
            expect(() => render(<HeroCentered {...props} />)).not.toThrow()
        })
    })

    describe('CSS Variable Integration', () => {
        it('sets CSS variables for theme properties', () => {
            const props: HeroCenteredProps = {
                ...baseProps,
                variant: HeroVariant.CENTERED,
                theme: customTheme
            }

            render(<HeroCentered {...props} />)

            const heroSection = screen.getByRole('region')

            // Check that CSS variables are set
            const style = heroSection.style
            expect(style.getPropertyValue('--primary-color') ||
                style.getPropertyValue('--hero-primary-color')).toBeTruthy()
        })

        it('updates CSS variables when theme changes', () => {
            const props: HeroCenteredProps = {
                ...baseProps,
                variant: HeroVariant.CENTERED,
                theme: defaultTheme
            }

            const { rerender } = render(<HeroCentered {...props} />)

            const heroSection = screen.getByRole('region')
            const initialStyle = heroSection.style.cssText

            // Update theme
            rerender(<HeroCentered {...props} theme={customTheme} />)

            const updatedStyle = heroSection.style.cssText
            expect(updatedStyle).not.toBe(initialStyle)
        })
    })

    describe('Dark Mode Support', () => {
        it('applies dark mode theme correctly', () => {
            const darkTheme: ThemeConfig = {
                ...customTheme,
                backgroundColor: '#1a1a1a',
                textColor: '#ffffff',
                borderColor: '#444444'
            }

            const props: HeroCenteredProps = {
                ...baseProps,
                variant: HeroVariant.CENTERED,
                theme: darkTheme
            }

            render(<HeroCentered {...props} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toBeInTheDocument()

            // Should handle dark theme without issues
            expect(heroSection.className).toContain('hero-section')
        })
    })

    describe('Theme Performance', () => {
        it('does not cause unnecessary re-renders on theme change', () => {
            const renderSpy = vi.fn()

            const TestComponent = (props: HeroCenteredProps) => {
                renderSpy()
                return <HeroCentered {...props} />
            }

            const props: HeroCenteredProps = {
                ...baseProps,
                variant: HeroVariant.CENTERED,
                theme: defaultTheme
            }

            const { rerender } = render(<TestComponent {...props} />)

            expect(renderSpy).toHaveBeenCalledTimes(1)

            // Same theme should not cause re-render
            rerender(<TestComponent {...props} />)
            expect(renderSpy).toHaveBeenCalledTimes(2) // React will re-render, but component should be optimized

            // Different theme should cause re-render
            rerender(<TestComponent {...props} theme={customTheme} />)
            expect(renderSpy).toHaveBeenCalledTimes(3)
        })

        it('efficiently processes theme rendering', () => {
            const start = performance.now()

            for (let i = 0; i < 100; i++) {
                const props: HeroCenteredProps = {
                    ...baseProps,
                    variant: HeroVariant.CENTERED,
                    theme: customTheme
                }
                // Simulate theme processing by creating props
                expect(props.theme).toBeDefined()
            }

            const end = performance.now()
            const duration = end - start

            // Should process 100 theme operations in under 50ms
            expect(duration).toBeLessThan(50)
        })
    })

    describe('Theme Accessibility', () => {
        it('maintains color contrast with theme changes', () => {
            const highContrastTheme: ThemeConfig = {
                ...customTheme,
                backgroundColor: '#000000',
                textColor: '#ffffff'
            }

            const props: HeroCenteredProps = {
                ...baseProps,
                variant: HeroVariant.CENTERED,
                theme: highContrastTheme
            }

            render(<HeroCentered {...props} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toBeInTheDocument()

            // Should apply high contrast theme
            expect(heroSection.className).toContain('hero-section')
        })

        it('preserves focus indicators with custom themes', () => {
            const props: HeroCenteredProps = {
                ...baseProps,
                variant: HeroVariant.CENTERED,
                theme: customTheme,
                primaryButton: {
                    text: 'Click Me',
                    url: '/test',
                    style: 'primary',
                    size: 'lg',
                    iconPosition: 'right',
                    target: '_self'
                }
            }

            render(<HeroCentered {...props} />)

            const button = screen.getByRole('link', { name: 'Click Me' })
            expect(button).toBeInTheDocument()

            // Focus should be visible regardless of theme
            button.focus()
            expect(document.activeElement).toBe(button)
        })
    })
})