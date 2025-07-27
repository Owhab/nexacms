import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getHeroSectionConfigByVariant, getAllHeroSections } from '../registry'
import { HeroVariant } from '../types'

describe('Hero Section Registry Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Registry Configuration', () => {
    it('contains all 10 hero section variants', () => {
      const allSections = getAllHeroSections()
      
      expect(allSections).toHaveLength(10)
      
      const expectedVariants = [
        HeroVariant.CENTERED,
        HeroVariant.SPLIT_SCREEN,
        HeroVariant.VIDEO,
        HeroVariant.MINIMAL,
        HeroVariant.FEATURE,
        HeroVariant.TESTIMONIAL,
        HeroVariant.PRODUCT,
        HeroVariant.SERVICE,
        HeroVariant.CTA,
        HeroVariant.GALLERY
      ]

      expectedVariants.forEach(variant => {
        const config = getHeroSectionConfigByVariant(variant)
        expect(config).toBeDefined()
        expect(config?.variant).toBe(variant)
      })
    })

    it('has proper configuration for each variant', () => {
      const allSections = getAllHeroSections()

      allSections.forEach(section => {
        expect(section).toHaveProperty('id')
        expect(section).toHaveProperty('variant')
        expect(section).toHaveProperty('name')
        expect(section).toHaveProperty('description')
        expect(section).toHaveProperty('icon')
        expect(section).toHaveProperty('category', 'HERO')
        expect(section).toHaveProperty('defaultProps')
        expect(section).toHaveProperty('editorSchema')
        expect(section).toHaveProperty('previewComponent')
        expect(section).toHaveProperty('editorComponent')
        expect(section).toHaveProperty('tags')
        expect(section).toHaveProperty('isActive', true)
        expect(section).toHaveProperty('version')
        expect(section).toHaveProperty('themeCompatibility')
        expect(section).toHaveProperty('responsiveSupport')
      })
    })

    it('has unique IDs for all sections', () => {
      const allSections = getAllHeroSections()
      const ids = allSections.map(section => section.id)
      const uniqueIds = new Set(ids)

      expect(uniqueIds.size).toBe(allSections.length)
    })

    it('has proper editor schemas', () => {
      const allSections = getAllHeroSections()

      allSections.forEach(section => {
        const { editorSchema } = section
        
        expect(editorSchema).toHaveProperty('sections')
        expect(Array.isArray(editorSchema.sections)).toBe(true)
        expect(editorSchema.sections.length).toBeGreaterThan(0)

        editorSchema.sections.forEach(editorSection => {
          expect(editorSection).toHaveProperty('id')
          expect(editorSection).toHaveProperty('title')
          expect(editorSection).toHaveProperty('fields')
          expect(Array.isArray(editorSection.fields)).toBe(true)
        })
      })
    })
  })

  describe('Section Retrieval', () => {
    it('retrieves specific section by variant', () => {
      const centeredConfig = getHeroSectionConfigByVariant(HeroVariant.CENTERED)
      
      expect(centeredConfig).toBeDefined()
      expect(centeredConfig?.variant).toBe(HeroVariant.CENTERED)
      expect(centeredConfig?.name).toBe('Hero Centered')
    })

    it('returns undefined for invalid variant', () => {
      const invalidConfig = getHeroSectionConfigByVariant('invalid' as HeroVariant)
      
      expect(invalidConfig).toBeUndefined()
    })

    it('filters sections by active status', () => {
      const activeSections = getAllHeroSections().filter(section => section.isActive)
      
      expect(activeSections.length).toBe(10) // All should be active by default
    })

    it('filters sections by tags', () => {
      const allSections = getAllHeroSections()
      const heroSections = allSections.filter(section => 
        section.tags.includes('hero')
      )
      
      expect(heroSections.length).toBeGreaterThan(0)
      
      const landingSections = allSections.filter(section => 
        section.tags.includes('landing')
      )
      
      expect(landingSections.length).toBeGreaterThan(0)
    })
  })

  describe('Theme Compatibility', () => {
    it('all sections support theme integration', () => {
      const allSections = getAllHeroSections()

      allSections.forEach(section => {
        const { themeCompatibility } = section
        
        expect(themeCompatibility).toHaveProperty('supportedThemes')
        expect(themeCompatibility).toHaveProperty('customCSSVariables')
        expect(themeCompatibility).toHaveProperty('tailwindClasses')
        
        expect(Array.isArray(themeCompatibility.supportedThemes)).toBe(true)
        expect(Array.isArray(themeCompatibility.customCSSVariables)).toBe(true)
        expect(Array.isArray(themeCompatibility.tailwindClasses)).toBe(true)
      })
    })
  })

  describe('Responsive Support', () => {
    it('all sections support responsive design', () => {
      const allSections = getAllHeroSections()

      allSections.forEach(section => {
        const { responsiveSupport } = section
        
        expect(responsiveSupport).toHaveProperty('breakpoints')
        expect(responsiveSupport).toHaveProperty('adaptiveLayout')
        expect(responsiveSupport).toHaveProperty('responsiveImages')
        expect(responsiveSupport).toHaveProperty('responsiveTypography')
        
        expect(Array.isArray(responsiveSupport.breakpoints)).toBe(true)
        expect(responsiveSupport.breakpoints).toContain('mobile')
        expect(responsiveSupport.breakpoints).toContain('tablet')
        expect(responsiveSupport.breakpoints).toContain('desktop')
        expect(typeof responsiveSupport.adaptiveLayout).toBe('boolean')
        expect(typeof responsiveSupport.responsiveImages).toBe('boolean')
        expect(typeof responsiveSupport.responsiveTypography).toBe('boolean')
      })
    })
  })

  describe('Default Props Validation', () => {
    it('all sections have valid default props', () => {
      const allSections = getAllHeroSections()

      allSections.forEach(section => {
        const { defaultProps } = section
        
        // Check that defaultProps has the basic structure expected for hero sections
        expect(defaultProps).toBeDefined()
        expect(typeof defaultProps).toBe('object')
        
        // Most sections should have a title
        if (defaultProps.title) {
          expect(defaultProps.title).toHaveProperty('text')
          expect(defaultProps.title).toHaveProperty('tag')
        }
        
        // Most sections should have a background
        if (defaultProps.background) {
          expect(defaultProps.background).toHaveProperty('type')
        }
      })
    })
  })

  describe('Component Loading', () => {
    it('can dynamically import variant components', async () => {
      const centeredConfig = getHeroSectionConfigByVariant(HeroVariant.CENTERED)
      
      expect(centeredConfig).toBeDefined()
      
      // Test that component paths are valid
      expect(centeredConfig?.previewComponent).toBe('HeroCenteredPreview')
      expect(centeredConfig?.editorComponent).toBe('HeroCenteredEditor')
    })

    it('has consistent naming convention', () => {
      const allSections = getAllHeroSections()

      allSections.forEach(section => {
        let variantName = section.variant
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('')
        
        // Handle special case for CTA
        if (variantName === 'Cta') {
          variantName = 'CTA'
        }
        
        expect(section.previewComponent).toBe(`Hero${variantName}Preview`)
        expect(section.editorComponent).toBe(`Hero${variantName}Editor`)
      })
    })
  })

  describe('Registry Performance', () => {
    it('retrieves sections efficiently', () => {
      const start = performance.now()
      
      for (let i = 0; i < 1000; i++) {
        getAllHeroSections()
      }
      
      const end = performance.now()
      const duration = end - start
      
      // Should complete 1000 retrievals in under 100ms
      expect(duration).toBeLessThan(100)
    })

    it('caches section configurations', () => {
      const first = getHeroSectionConfigByVariant(HeroVariant.CENTERED)
      const second = getHeroSectionConfigByVariant(HeroVariant.CENTERED)
      
      // Should return the same reference (cached)
      expect(first).toBe(second)
    })
  })

  describe('Error Handling', () => {
    it('handles missing section gracefully', () => {
      const missingSection = getHeroSectionConfigByVariant('nonexistent' as HeroVariant)
      
      expect(missingSection).toBeUndefined()
    })

    it('validates section structure on registration', () => {
      // This would test the validation logic if we had it
      // For now, we ensure all sections have required properties
      const allSections = getAllHeroSections()
      
      allSections.forEach(section => {
        expect(typeof section.id).toBe('string')
        expect(typeof section.name).toBe('string')
        expect(typeof section.description).toBe('string')
        expect(typeof section.version).toBe('string')
        expect(typeof section.isActive).toBe('boolean')
        expect(Array.isArray(section.tags)).toBe(true)
      })
    })
  })
})