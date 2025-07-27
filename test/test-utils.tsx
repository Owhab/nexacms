import React from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Mock SiteConfigProvider
const MockSiteConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const mockSiteConfig = {
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
  }

  return (
    <div data-testid="mock-site-config-provider">
      {children}
    </div>
  )
}

// Custom render function that includes providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <MockSiteConfigProvider>
        {children}
      </MockSiteConfigProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }