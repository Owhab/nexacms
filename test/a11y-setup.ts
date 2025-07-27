import { vi } from 'vitest'
import { toHaveNoViolations } from 'jest-axe'

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations)

// Mock axe-core for testing
vi.mock('axe-core', () => ({
  run: vi.fn().mockResolvedValue({
    violations: [],
    passes: [],
    incomplete: [],
    inapplicable: []
  }),
  configure: vi.fn(),
  reset: vi.fn()
}))

// Add custom accessibility testing utilities
global.testAccessibility = async (container: HTMLElement) => {
  const { run } = await import('axe-core')
  const results = await run(container)
  return results
}

// Mock screen reader announcements
global.mockScreenReader = {
  announcements: [] as string[],
  announce: (message: string) => {
    global.mockScreenReader.announcements.push(message)
  },
  clear: () => {
    global.mockScreenReader.announcements = []
  }
}

// Mock ARIA live regions - simplified version
// Note: This is a simplified mock for testing purposes

// Mock focus management
let focusedElement: Element | null = null

Object.defineProperty(document, 'activeElement', {
  get: () => focusedElement,
  configurable: true
})

const originalFocus = HTMLElement.prototype.focus
HTMLElement.prototype.focus = function() {
  focusedElement = this
  return originalFocus.call(this)
}

const originalBlur = HTMLElement.prototype.blur
HTMLElement.prototype.blur = function() {
  if (focusedElement === this) {
    focusedElement = null
  }
  return originalBlur.call(this)
}