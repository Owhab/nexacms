import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    route: '/'
  })
}))

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn()
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}))

// Mock Next.js image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', { src, alt, ...props })
  }
}))

// Mock MediaPicker component
vi.mock('@/components/ui/MediaPicker', () => ({
  MediaPicker: ({ onChange, value, placeholder }: any) => {
    return React.createElement('div', { 'data-testid': 'media-picker' }, [
      React.createElement('input', {
        key: 'input',
        type: 'file',
        onChange: (e: any) => {
          const file = e.target.files?.[0]
          if (file) {
            onChange({
              id: 'test-media',
              url: URL.createObjectURL(file),
              type: 'IMAGE',
              fileName: file.name,
              fileSize: file.size,
              mimeType: file.type
            })
          }
        },
        'data-testid': 'file-input'
      }),
      value && React.createElement('div', { key: 'selected', 'data-testid': 'selected-media' }, value.url),
      React.createElement('div', { key: 'placeholder' }, placeholder)
    ])
  }
}))

// Mock Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant, className }: any) => {
    return React.createElement('button', {
      onClick,
      disabled,
      'data-variant': variant,
      className,
      'data-testid': 'button'
    }, children)
  }
}))

// Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    section: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    page: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}))

// Mock site config context
vi.mock('@/contexts/site-config-context', () => ({
  useSiteConfig: () => ({
    siteConfig: {
      siteName: 'Test Site',
      siteDescription: 'Test Description',
      theme: {
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        accentColor: '#10b981',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderColor: '#e5e7eb',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '0.5rem'
      },
      logo: null,
      favicon: null,
      socialLinks: [],
      contactInfo: {
        email: 'test@example.com',
        phone: '+1234567890',
        address: '123 Test St'
      },
      seo: {
        metaTitle: 'Test Site',
        metaDescription: 'Test Description',
        keywords: ['test'],
        ogImage: null
      },
      analytics: {
        googleAnalyticsId: null,
        facebookPixelId: null
      },
      integrations: {
        mailchimp: null,
        stripe: null
      }
    },
    updateSiteConfig: vi.fn(),
    isLoading: false,
    error: null
  })
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url')
global.URL.revokeObjectURL = vi.fn()

// Mock fetch
global.fetch = vi.fn()

// Suppress console errors in tests unless explicitly needed
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})