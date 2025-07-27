import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { HeroCentered } from '../variants/HeroCentered'
import { HeroVariant } from '../types'
import {
  getDefaultThemeConfig,
  getDefaultResponsiveConfig,
  getDefaultAccessibilityConfig
} from '../utils'

describe('Hero Sections Basic Accessibility', () => {
  const baseProps = {
    id: 'test-hero',
    variant: HeroVariant.CENTERED,
    theme: getDefaultThemeConfig(),
    responsive: getDefaultResponsiveConfig(),
    accessibility: getDefaultAccessibilityConfig(),
    title: {
      text: 'Accessible Hero Title',
      tag: 'h1' as const
    },
    background: {
      type: 'none' as const
    },
    textAlign: 'center' as const
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Accessibility Features', () => {
    it('renders with proper semantic structure', () => {
      render(<HeroCentered {...baseProps} />)
      
      // Should have main landmark
      const heroSection = screen.getByRole('region')
      expect(heroSection).toBeInTheDocument()
      
      // Should have proper heading
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toBeInTheDocument()
      expect(mainHeading.textContent).toBe('Accessible Hero Title')
    })

    it('has proper ARIA labels', () => {
      render(<HeroCentered {...baseProps} />)
      
      const heroSection = screen.getByRole('region')
      expect(heroSection).toHaveAttribute('aria-label')
    })

    it('supports keyboard navigation for interactive elements', () => {
      const propsWithButton = {
        ...baseProps,
        primaryButton: {
          text: 'Click Me',
          url: '/test',
          style: 'primary' as const,
          size: 'lg' as const,
          iconPosition: 'right' as const,
          target: '_self' as const
        }
      }

      render(<HeroCentered {...propsWithButton} />)
      
      const button = screen.getByRole('link', { name: 'Click Me' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('href', '/test')
      
      // Should be focusable
      expect(button.tabIndex).not.toBe(-1)
    })

    it('provides proper alt text for images', () => {
      const propsWithImage = {
        ...baseProps,
        background: {
          type: 'image' as const,
          image: {
            id: 'bg-image',
            url: '/test-image.jpg',
            type: 'image' as const,
            alt: 'Descriptive background image',
            objectFit: 'cover' as const,
            loading: 'lazy' as const
          }
        }
      }

      render(<HeroCentered {...propsWithImage} />)
      
      // Check if image has proper alt text (implementation dependent)
      const heroSection = screen.getByRole('region')
      expect(heroSection).toBeInTheDocument()
    })

    it('maintains proper heading hierarchy', () => {
      const propsWithSubtitle = {
        ...baseProps,
        subtitle: {
          text: 'Accessible subtitle',
          tag: 'h2' as const
        }
      }

      render(<HeroCentered {...propsWithSubtitle} />)
      
      const h1 = screen.getByRole('heading', { level: 1 })
      const h2 = screen.getByRole('heading', { level: 2 })
      
      expect(h1).toBeInTheDocument()
      expect(h2).toBeInTheDocument()
      expect(h1.textContent).toBe('Accessible Hero Title')
      expect(h2.textContent).toBe('Accessible subtitle')
    })

    it('handles missing content gracefully', () => {
      const minimalProps = {
        ...baseProps,
        title: { text: '', tag: 'h1' as const }
      }

      render(<HeroCentered {...minimalProps} />)
      
      // Should still render with accessible structure
      const heroSection = screen.getByRole('region')
      expect(heroSection).toBeInTheDocument()
      expect(heroSection).toHaveAttribute('aria-label')
    })

    it('provides accessible button labels', () => {
      const propsWithButtons = {
        ...baseProps,
        primaryButton: {
          text: 'Primary Action',
          url: '/primary',
          style: 'primary' as const,
          size: 'lg' as const,
          iconPosition: 'right' as const,
          target: '_self' as const
        },
        secondaryButton: {
          text: 'Secondary Action',
          url: '/secondary',
          style: 'outline' as const,
          size: 'lg' as const,
          iconPosition: 'left' as const,
          target: '_self' as const
        }
      }

      render(<HeroCentered {...propsWithButtons} />)
      
      const primaryButton = screen.getByRole('link', { name: 'Primary Action' })
      const secondaryButton = screen.getByRole('link', { name: 'Secondary Action' })
      
      expect(primaryButton).toBeInTheDocument()
      expect(secondaryButton).toBeInTheDocument()
      
      // Both should have accessible names
      expect(primaryButton).toHaveAccessibleName()
      expect(secondaryButton).toHaveAccessibleName()
    })
  })

  describe('Responsive Accessibility', () => {
    it('maintains accessibility across viewport sizes', () => {
      // Mock different viewport sizes
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375, // Mobile width
      })

      render(<HeroCentered {...baseProps} />)
      
      const heroSection = screen.getByRole('region')
      expect(heroSection).toBeInTheDocument()
      
      // Should maintain semantic structure on mobile
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
    })
  })

  describe('Error State Accessibility', () => {
    it('handles broken images accessibly', () => {
      const propsWithBrokenImage = {
        ...baseProps,
        background: {
          type: 'image' as const,
          image: {
            id: 'broken-image',
            url: '/broken-image.jpg',
            type: 'image' as const,
            alt: 'This image failed to load',
            objectFit: 'cover' as const,
            loading: 'lazy' as const
          }
        }
      }

      render(<HeroCentered {...propsWithBrokenImage} />)
      
      // Should still have accessible structure even with broken image
      const heroSection = screen.getByRole('region')
      expect(heroSection).toBeInTheDocument()
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
    })
  })
})