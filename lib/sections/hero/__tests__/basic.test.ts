import { describe, it, expect } from 'vitest'
import { HeroVariant } from '../types'
import { getDefaultThemeConfig, getDefaultResponsiveConfig, getDefaultAccessibilityConfig } from '../utils'

describe('Hero Sections Basic Tests', () => {
  describe('Types and Enums', () => {
    it('has all hero variants defined', () => {
      const expectedVariants = [
        'centered',
        'split-screen', 
        'video',
        'minimal',
        'feature',
        'testimonial',
        'product',
        'service',
        'cta',
        'gallery'
      ]
      
      expectedVariants.forEach(variant => {
        expect(Object.values(HeroVariant)).toContain(variant)
      })
    })
  })

  describe('Utility Functions', () => {
    it('provides default theme configuration', () => {
      const theme = getDefaultThemeConfig()
      
      expect(theme).toHaveProperty('primaryColor')
      expect(theme).toHaveProperty('secondaryColor')
      expect(theme).toHaveProperty('backgroundColor')
      expect(theme).toHaveProperty('textColor')
      expect(theme).toHaveProperty('borderColor')
      expect(theme).toHaveProperty('fontFamily')
      expect(theme).toHaveProperty('borderRadius')
    })

    it('provides default responsive configuration', () => {
      const responsive = getDefaultResponsiveConfig()
      
      expect(responsive).toHaveProperty('mobile')
      expect(responsive).toHaveProperty('tablet')
      expect(responsive).toHaveProperty('desktop')
    })

    it('provides default accessibility configuration', () => {
      const accessibility = getDefaultAccessibilityConfig()
      
      expect(accessibility).toHaveProperty('ariaLabels')
      expect(accessibility).toHaveProperty('keyboardNavigation')
    })
  })
})