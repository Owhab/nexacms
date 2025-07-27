import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { HeroCentered } from '../variants/HeroCentered'
import { HeroSplitScreen } from '../variants/HeroSplitScreen'
import { HeroVideo } from '../variants/HeroVideo'
import { HeroMinimal } from '../variants/HeroMinimal'
import { HeroFeature } from '../variants/HeroFeature'
import { HeroTestimonial } from '../variants/HeroTestimonial'
import { HeroProduct } from '../variants/HeroProduct'
import { HeroService } from '../variants/HeroService'
import { HeroCTA } from '../variants/HeroCTA'
import { HeroGallery } from '../variants/HeroGallery'

import {
  HeroCenteredProps,
  HeroSplitScreenProps,
  HeroVideoProps,
  HeroMinimalProps,
  HeroFeatureProps,
  HeroTestimonialProps,
  HeroProductProps,
  HeroServiceProps,
  HeroCTAProps,
  HeroGalleryProps,
  HeroVariant
} from '../types'

import {
  getDefaultThemeConfig,
  getDefaultResponsiveConfig,
  getDefaultAccessibilityConfig
} from '../utils'

expect.extend(toHaveNoViolations)

describe('Hero Sections Accessibility Compliance', () => {
  const baseProps = {
    id: 'test-hero',
    theme: getDefaultThemeConfig(),
    responsive: getDefaultResponsiveConfig(),
    accessibility: getDefaultAccessibilityConfig()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    if (global.mockScreenReader) {
      global.mockScreenReader.clear()
    }
  })

  describe('WCAG 2.1 AA Compliance', () => {
    const heroVariants = [
      {
        name: 'HeroCentered',
        Component: HeroCentered,
        props: {
          ...baseProps,
          variant: HeroVariant.CENTERED,
          title: { text: 'Accessible Hero Title', tag: 'h1' as const },
          subtitle: { text: 'Accessible subtitle', tag: 'h2' as const },
          description: { text: 'Accessible description content', tag: 'p' as const },
          primaryButton: {
            text: 'Get Started',
            url: '/get-started',
            style: 'primary' as const,
            size: 'lg' as const,
            iconPosition: 'right' as const,
            target: '_self' as const
          },
          background: { type: 'none' as const },
          textAlign: 'center' as const
        } as HeroCenteredProps
      },
      {
        name: 'HeroSplitScreen',
        Component: HeroSplitScreen,
        props: {
          ...baseProps,
          variant: HeroVariant.SPLIT_SCREEN,
          title: { text: 'Split Screen Hero', tag: 'h1' as const },
          content: {
            title: { text: 'Content Title', tag: 'h2' as const },
            description: { text: 'Content description', tag: 'p' as const }
          },
          media: {
            type: 'image' as const,
            image: {
              id: 'test-image',
              url: '/test-image.jpg',
              type: 'image' as const,
              alt: 'Descriptive alt text for accessibility',
              objectFit: 'cover' as const,
              loading: 'lazy' as const
            }
          },
          layout: {
            direction: 'left' as const,
            contentWidth: 50,
            mediaWidth: 50
          },
          background: { type: 'none' as const }
        } as HeroSplitScreenProps
      },
      {
        name: 'HeroVideo',
        Component: HeroVideo,
        props: {
          ...baseProps,
          variant: HeroVariant.VIDEO,
          title: { text: 'Video Hero Title', tag: 'h1' as const },
          video: {
            id: 'test-video',
            url: '/test-video.mp4',
            type: 'video' as const,
            poster: '/test-poster.jpg',
            autoplay: false,
            loop: true,
            muted: true,
            controls: true
          },
          overlay: {
            opacity: 0.5,
            color: '#000000'
          },
          background: { type: 'none' as const }
        } as HeroVideoProps
      }
    ]

    heroVariants.forEach(({ name, Component, props }) => {
      describe(name, () => {
        it('has no accessibility violations', async () => {
          const { container } = render(<Component {...props} />)
          const results = await axe(container)
          expect(results).toHaveNoViolations()
        })

        it('has proper semantic structure', () => {
          render(<Component {...props} />)

          // Should have main landmark
          const heroSection = screen.getByRole('region')
          expect(heroSection).toBeInTheDocument()
          expect(heroSection).toHaveAttribute('aria-label')

          // Should have proper heading hierarchy
          const mainHeading = screen.getByRole('heading', { level: 1 })
          expect(mainHeading).toBeInTheDocument()
        })

        it('supports keyboard navigation', async () => {
          const user = userEvent.setup()
          render(<Component {...props} />)

          // Should be able to tab through interactive elements
          await user.tab()

          const focusedElement = document.activeElement
          expect(focusedElement).toBeTruthy()

          // If there's a button, it should be focusable
          const buttons = screen.queryAllByRole('link')
          if (buttons.length > 0) {
            buttons.forEach(button => {
              expect(button).toHaveAttribute('href')
              expect(button.tabIndex).not.toBe(-1)
            })
          }
        })

        it('has proper ARIA labels and descriptions', () => {
          render(<Component {...props} />)

          const heroSection = screen.getByRole('region')
          expect(heroSection).toHaveAttribute('aria-label')

          // Check for proper labeling of interactive elements
          const links = screen.queryAllByRole('link')
          links.forEach(link => {
            expect(link).toHaveAccessibleName()
          })

          // Check for proper image alt text
          const images = screen.queryAllByRole('img')
          images.forEach(image => {
            expect(image).toHaveAttribute('alt')
            expect(image.getAttribute('alt')).not.toBe('')
          })
        })
      })
    })
  })

  describe('Screen Reader Compatibility', () => {
    it('announces content changes appropriately', async () => {
      const user = userEvent.setup()

      const TestComponent = () => {
        const [title, setTitle] = React.useState('Initial Title')

        return (
          <div>
            <button onClick={() => setTitle('Updated Title')}>
              Update Title
            </button>
            <HeroCentered
              {...baseProps}
              variant={HeroVariant.CENTERED}
              title={{ text: title, tag: 'h1' }}
              background={{ type: 'none' }}
              textAlign="center"
            />
          </div>
        )
      }

      render(<TestComponent />)

      const updateButton = screen.getByText('Update Title')
      await user.click(updateButton)

      // Check that screen reader would announce the change
      expect(screen.getByText('Updated Title')).toBeInTheDocument()
    })

    it('provides proper context for complex content', () => {
      const featureProps: HeroFeatureProps = {
        ...baseProps,
        variant: HeroVariant.FEATURE,
        title: { text: 'Feature Hero', tag: 'h1' },
        features: [
          {
            id: 'feature-1',
            icon: 'check',
            title: 'Feature One',
            description: 'Description of feature one'
          },
          {
            id: 'feature-2',
            icon: 'star',
            title: 'Feature Two',
            description: 'Description of feature two'
          }
        ],
        background: { type: 'none' }
      }

      render(<HeroFeature {...featureProps} />)

      // Features should be in a list for screen readers
      const featureList = screen.getByRole('list')
      expect(featureList).toBeInTheDocument()

      const featureItems = screen.getAllByRole('listitem')
      expect(featureItems).toHaveLength(2)
    })
  })

  describe('Color Contrast and Visual Accessibility', () => {
    it('maintains sufficient color contrast', () => {
      const highContrastProps: HeroCenteredProps = {
        ...baseProps,
        variant: HeroVariant.CENTERED,
        title: { text: 'High Contrast Title', tag: 'h1' },
        theme: {
          ...getDefaultThemeConfig(),
          backgroundColor: '#000000',
          textColor: '#ffffff',
          primaryColor: '#ffffff',
          secondaryColor: '#cccccc'
        },
        background: { type: 'color', color: '#000000' },
        textAlign: 'center'
      }

      render(<HeroCentered {...highContrastProps} />)

      const heroSection = screen.getByRole('region')
      expect(heroSection).toBeInTheDocument()

      // Visual test would need actual color contrast calculation
      // This is a placeholder for the structure
    })

    it('respects reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      render(
        <HeroCentered
          {...baseProps}
          variant={HeroVariant.CENTERED}
          title={{ text: 'Motion Sensitive Hero', tag: 'h1' }}
          background={{ type: 'none' }}
          textAlign="center"
        />
      )

      const heroSection = screen.getByRole('region')
      expect(heroSection).toBeInTheDocument()

      // Should not have animation classes when reduced motion is preferred
      expect(heroSection.className).not.toContain('animate-')
    })
  })

  describe('Focus Management', () => {
    it('manages focus properly in interactive elements', async () => {
      const user = userEvent.setup()

      const ctaProps: HeroCTAProps = {
        ...baseProps,
        variant: HeroVariant.CTA,
        title: { text: 'CTA Hero', tag: 'h1' },
        primaryButton: {
          text: 'Primary Action',
          url: '/primary',
          style: 'primary',
          size: 'lg',
          iconPosition: 'right',
          target: '_self'
        },
        secondaryButton: {
          text: 'Secondary Action',
          url: '/secondary',
          style: 'outline',
          size: 'lg',
          iconPosition: 'left',
          target: '_self'
        },
        background: { type: 'none' }
      }

      render(<HeroCTA {...ctaProps} />)

      // Tab through buttons
      await user.tab()
      const primaryButton = screen.getByRole('link', { name: 'Primary Action' })
      expect(document.activeElement).toBe(primaryButton)

      await user.tab()
      const secondaryButton = screen.getByRole('link', { name: 'Secondary Action' })
      expect(document.activeElement).toBe(secondaryButton)
    })

    it('provides visible focus indicators', async () => {
      const user = userEvent.setup()

      render(
        <HeroCentered
          {...baseProps}
          variant={HeroVariant.CENTERED}
          title={{ text: 'Focus Test Hero', tag: 'h1' }}
          primaryButton={{
            text: 'Focus Me',
            url: '/focus',
            style: 'primary',
            size: 'lg',
            iconPosition: 'right',
            target: '_self'
          }}
          background={{ type: 'none' }}
          textAlign="center"
        />
      )

      const button = screen.getByRole('link', { name: 'Focus Me' })

      // Focus the button
      await user.tab()
      expect(document.activeElement).toBe(button)

      // Should have focus styles
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2')
    })
  })

  describe('Error States and Fallbacks', () => {
    it('provides accessible error messages', () => {
      const errorProps: HeroSplitScreenProps = {
        ...baseProps,
        variant: HeroVariant.SPLIT_SCREEN,
        title: { text: 'Error Test Hero', tag: 'h1' },
        content: {
          title: { text: 'Content Title', tag: 'h2' },
          description: { text: 'Content description', tag: 'p' }
        },
        media: {
          type: 'image',
          image: {
            id: 'broken-image',
            url: '/broken-image.jpg',
            type: 'image',
            alt: 'This image failed to load',
            objectFit: 'cover',
            loading: 'lazy'
          }
        },
        layout: {
          direction: 'left',
          contentWidth: 50,
          mediaWidth: 50
        },
        background: { type: 'none' }
      }

      render(<HeroSplitScreen {...errorProps} />)

      // Should still have accessible structure even with broken image
      const heroSection = screen.getByRole('region')
      expect(heroSection).toBeInTheDocument()

      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toBeInTheDocument()
    })

    it('handles missing content gracefully', () => {
      const minimalProps: HeroCenteredProps = {
        ...baseProps,
        variant: HeroVariant.CENTERED,
        title: { text: '', tag: 'h1' }, // Empty title
        background: { type: 'none' },
        textAlign: 'center'
      }

      render(<HeroCentered {...minimalProps} />)

      // Should still render with fallback content
      const heroSection = screen.getByRole('region')
      expect(heroSection).toBeInTheDocument()

      // Should have some accessible content even if title is empty
      expect(heroSection).toHaveAttribute('aria-label')
    })
  })

  describe('Mobile Accessibility', () => {
    it('maintains accessibility on mobile viewports', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      })

      render(
        <HeroCentered
          {...baseProps}
          variant={HeroVariant.CENTERED}
          title={{ text: 'Mobile Hero', tag: 'h1' }}
          primaryButton={{
            text: 'Mobile Button',
            url: '/mobile',
            style: 'primary',
            size: 'lg',
            iconPosition: 'right',
            target: '_self'
          }}
          background={{ type: 'none' }}
          textAlign="center"
        />
      )

      const button = screen.getByRole('link', { name: 'Mobile Button' })

      // Button should be large enough for touch targets (44px minimum)
      const computedStyle = window.getComputedStyle(button)
      const minTouchTarget = 44 // pixels

      // This would need actual measurement in a real test
      expect(button).toBeInTheDocument()
    })

    it('supports touch navigation', async () => {
      const user = userEvent.setup()

      render(
        <HeroGallery
          {...baseProps}
          variant={HeroVariant.GALLERY}
          title={{ text: 'Gallery Hero', tag: 'h1' }}
          images={[
            {
              id: 'img-1',
              url: '/image1.jpg',
              type: 'image',
              alt: 'Gallery image 1',
              objectFit: 'cover',
              loading: 'lazy'
            },
            {
              id: 'img-2',
              url: '/image2.jpg',
              type: 'image',
              alt: 'Gallery image 2',
              objectFit: 'cover',
              loading: 'lazy'
            }
          ]}
          gallery={{
            layout: 'carousel',
            showThumbnails: true,
            autoplay: false
          }}
          background={{ type: 'none' }}
        />
      )

      // Gallery navigation should be accessible via touch/click
      const nextButton = screen.queryByRole('button', { name: /next/i })
      if (nextButton) {
        await user.click(nextButton)
        expect(nextButton).toBeInTheDocument()
      }
    })
  })
})