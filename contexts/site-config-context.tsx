'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface SiteConfig {
    id: string
    siteName: string
    siteDescription?: string
    logoUrl?: string
    faviconUrl?: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
    borderColor: string
    theme: 'LIGHT' | 'DARK' | 'AUTO'
    language: string
    direction: 'LTR' | 'RTL'
    headerTemplateId?: string
    footerTemplateId?: string
}

interface SiteConfigContextType {
    config: SiteConfig | null
    loading: boolean
    error: string | null
    updateConfig: (updates: Partial<SiteConfig>) => Promise<void>
    refreshConfig: () => Promise<void>
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined)

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<SiteConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchConfig = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/site-config')
            if (response.ok) {
                const data = await response.json()
                setConfig(data.config)
                applyThemeToDocument(data.config)
            } else {
                setError('Failed to load site configuration')
            }
        } catch (err) {
            setError('Network error loading site configuration')
        } finally {
            setLoading(false)
        }
    }

    const updateConfig = async (updates: Partial<SiteConfig>) => {
        try {
            const response = await fetch('/api/admin/site-config', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            })

            if (response.ok) {
                const data = await response.json()
                setConfig(data.config)
                applyThemeToDocument(data.config)
            } else {
                throw new Error('Failed to update configuration')
            }
        } catch (err) {
            setError('Failed to update site configuration')
            throw err
        }
    }

    const refreshConfig = async () => {
        await fetchConfig()
    }

    const applyThemeToDocument = (config: SiteConfig) => {
        if (typeof document === 'undefined') return

        const root = document.documentElement

        // Apply CSS custom properties
        root.style.setProperty('--primary-color', config.primaryColor)
        root.style.setProperty('--secondary-color', config.secondaryColor)
        root.style.setProperty('--accent-color', config.accentColor)
        root.style.setProperty('--background-color', config.backgroundColor)
        root.style.setProperty('--text-color', config.textColor)
        root.style.setProperty('--border-color', config.borderColor)

        // Apply theme class
        root.classList.remove('light', 'dark')
        if (config.theme === 'AUTO') {
            // Use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            root.classList.add(prefersDark ? 'dark' : 'light')
        } else {
            root.classList.add(config.theme.toLowerCase())
        }

        // Apply direction
        root.setAttribute('dir', config.direction.toLowerCase())
        root.setAttribute('lang', config.language)

        // Update favicon if provided
        if (config.faviconUrl) {
            const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
            if (favicon) {
                favicon.href = config.faviconUrl
            }
        }

        // Update page title
        if (config.siteName) {
            document.title = config.siteName
        }
    }

    useEffect(() => {
        fetchConfig()
    }, [])

    // Listen for system theme changes when in AUTO mode
    useEffect(() => {
        if (config?.theme === 'AUTO') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const handleChange = () => applyThemeToDocument(config)

            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        }
    }, [config])

    return (
        <SiteConfigContext.Provider
            value={{
                config,
                loading,
                error,
                updateConfig,
                refreshConfig,
            }}
        >
            {children}
        </SiteConfigContext.Provider>
    )
}

export function useSiteConfig() {
    const context = useContext(SiteConfigContext)
    if (context === undefined) {
        throw new Error('useSiteConfig must be used within a SiteConfigProvider')
    }
    return context
}