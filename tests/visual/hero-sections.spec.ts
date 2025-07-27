import { test, expect } from '@playwright/test'

test.describe('Hero Sections Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses for consistent testing
    await page.route('**/api/**', (route) => {
      if (route.request().url().includes('/api/sections')) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ sections: [] })
        })
      } else {
        route.continue()
      }
    })
  })

  const heroVariants = [
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

  const themes = [
    { name: 'default', colors: { primary: '#3b82f6', secondary: '#8b5cf6' } },
    { name: 'dark', colors: { primary: '#1f2937', secondary: '#374151' } },
    { name: 'high-contrast', colors: { primary: '#000000', secondary: '#ffffff' } }
  ]

  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ]

  heroVariants.forEach(variant => {
    test.describe(`Hero ${variant} variant`, () => {
      themes.forEach(theme => {
        viewports.forEach(viewport => {
          test(`${variant} - ${theme.name} theme - ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height })
            
            // Navigate to test page with specific hero variant
            await page.goto(`/test/hero-sections?variant=${variant}&theme=${theme.name}`)
            
            // Wait for hero section to load
            await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 })
            
            // Wait for any animations to complete
            await page.waitForTimeout(1000)
            
            // Take screenshot
            await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot(
              `hero-${variant}-${theme.name}-${viewport.name}.png`,
              {
                threshold: 0.2,
                maxDiffPixels: 100
              }
            )
          })
        })
      })
    })
  })

  test.describe('Hero Section Editor Visual Tests', () => {
    test('editor interface renders correctly', async ({ page }) => {
      await page.goto('/admin/pages/new')
      
      // Open section library
      await page.click('[data-testid="add-section-button"]')
      
      // Select hero section
      await page.click('[data-testid="hero-section-category"]')
      await page.click('[data-testid="hero-centered-option"]')
      
      // Wait for editor to load
      await page.waitForSelector('[data-testid="hero-editor"]')
      
      // Take screenshot of editor
      await expect(page.locator('[data-testid="hero-editor"]')).toHaveScreenshot(
        'hero-editor-interface.png'
      )
    })

    test('editor preview updates in real-time', async ({ page }) => {
      await page.goto('/admin/pages/new')
      
      // Add hero section
      await page.click('[data-testid="add-section-button"]')
      await page.click('[data-testid="hero-section-category"]')
      await page.click('[data-testid="hero-centered-option"]')
      
      // Wait for editor
      await page.waitForSelector('[data-testid="hero-editor"]')
      
      // Change title
      await page.fill('[data-testid="title-input"]', 'Updated Hero Title')
      
      // Wait for preview update
      await page.waitForTimeout(500)
      
      // Take screenshot of updated preview
      await expect(page.locator('[data-testid="hero-preview"]')).toHaveScreenshot(
        'hero-editor-preview-updated.png'
      )
    })
  })

  test.describe('Responsive Design Tests', () => {
    heroVariants.slice(0, 3).forEach(variant => { // Test first 3 variants for performance
      test(`${variant} responsive behavior`, async ({ page }) => {
        await page.goto(`/test/hero-sections?variant=${variant}`)
        await page.waitForSelector('[data-testid="hero-section"]')
        
        // Desktop view
        await page.setViewportSize({ width: 1920, height: 1080 })
        await page.waitForTimeout(500)
        await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot(
          `${variant}-responsive-desktop.png`
        )
        
        // Tablet view
        await page.setViewportSize({ width: 768, height: 1024 })
        await page.waitForTimeout(500)
        await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot(
          `${variant}-responsive-tablet.png`
        )
        
        // Mobile view
        await page.setViewportSize({ width: 375, height: 667 })
        await page.waitForTimeout(500)
        await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot(
          `${variant}-responsive-mobile.png`
        )
      })
    })
  })

  test.describe('Theme Integration Visual Tests', () => {
    test('theme changes are visually consistent', async ({ page }) => {
      await page.goto('/test/hero-sections?variant=centered')
      await page.waitForSelector('[data-testid="hero-section"]')
      
      // Default theme
      await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot(
        'theme-default.png'
      )
      
      // Switch to dark theme
      await page.click('[data-testid="theme-selector"]')
      await page.click('[data-testid="dark-theme-option"]')
      await page.waitForTimeout(500)
      
      await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot(
        'theme-dark.png'
      )
      
      // Switch to custom theme
      await page.click('[data-testid="theme-selector"]')
      await page.click('[data-testid="custom-theme-option"]')
      await page.waitForTimeout(500)
      
      await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot(
        'theme-custom.png'
      )
    })
  })

  test.describe('Animation and Interaction Tests', () => {
    test('hover states and animations', async ({ page }) => {
      await page.goto('/test/hero-sections?variant=cta')
      await page.waitForSelector('[data-testid="hero-section"]')
      
      // Normal state
      await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot(
        'cta-normal-state.png'
      )
      
      // Hover over primary button
      await page.hover('[data-testid="primary-button"]')
      await page.waitForTimeout(300) // Wait for hover animation
      
      await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot(
        'cta-button-hover.png'
      )
    })

    test('focus states for accessibility', async ({ page }) => {
      await page.goto('/test/hero-sections?variant=centered')
      await page.waitForSelector('[data-testid="hero-section"]')
      
      // Focus on primary button using keyboard
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab') // Navigate to button
      
      await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot(
        'button-focus-state.png'
      )
    })
  })

  test.describe('Error States Visual Tests', () => {
    test('missing image fallback', async ({ page }) => {
      await page.goto('/test/hero-sections?variant=split-screen&missing-image=true')
      await page.waitForSelector('[data-testid="hero-section"]')
      
      await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot(
        'missing-image-fallback.png'
      )
    })

    test('loading states', async ({ page }) => {
      // Slow down network to simulate loading
      await page.route('**/*.jpg', route => {
        setTimeout(() => route.continue(), 2000)
      })
      
      await page.goto('/test/hero-sections?variant=gallery')
      
      // Capture loading state
      await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot(
        'gallery-loading-state.png'
      )
    })
  })

  test.describe('Cross-Browser Compatibility', () => {
    const criticalVariants = ['centered', 'split-screen', 'cta']
    
    criticalVariants.forEach(variant => {
      test(`${variant} cross-browser consistency`, async ({ page, browserName }) => {
        await page.goto(`/test/hero-sections?variant=${variant}`)
        await page.waitForSelector('[data-testid="hero-section"]')
        
        await expect(page.locator('[data-testid="hero-section"]')).toHaveScreenshot(
          `${variant}-${browserName}.png`,
          {
            threshold: 0.3, // Allow for browser differences
            maxDiffPixels: 200
          }
        )
      })
    })
  })
})