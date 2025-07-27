'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useSiteConfig } from '../../../../contexts/site-config-context'
import {
    ThemeConfig,
    ResponsiveConfig,
    AccessibilityConfig,
    CSSVariableMapping,
    TailwindClassMapping,
    HeroVariant
} from '../types'
import {
    integrateWithSiteConfig,
    createCSSVariableMapping,
    createTailwindClassMapping,
    applyCSSVariableMapping,
    generateThemeAwareClasses,
    getDefaultThemeConfig,
    createFocusManager,
    announceToScreenReader,
    respectsReducedMotion
} from '../utils'
import { usePerformanceOptimization, useCriticalCSS } from './usePerformanceOptimization'

/**
 * Safe hook to use site config with fallback when context is not available
 */
function useSafeConfig() {
    try {
        return useSiteConfig()
    } catch (error) {
        // Return fallback values when SiteConfigProvider is not available
        return {
            config: null,
            loading: false,
            error: null,
            updateConfig: async () => {},
            refreshConfig: async () => {}
        }
    }
}

/**
 * Hook for integrating hero sections with the site configuration context
 * Provides theme integration, CSS variable mapping, and responsive design support
 */
export function useThemeIntegration(
    baseTheme?: Partial<ThemeConfig>,
    responsive?: ResponsiveConfig
) {
    const { config: siteConfig, loading } = useSafeConfig()
    const elementRef = useRef<HTMLElement>(null)

    // Integrate base theme with site configuration
    const integratedTheme = useMemo(() => {
        const defaultTheme = getDefaultThemeConfig()
        const mergedTheme = { ...defaultTheme, ...baseTheme }
        return integrateWithSiteConfig(mergedTheme, siteConfig)
    }, [baseTheme, siteConfig])

    // Create CSS variable mappings
    const cssVariableMappings = useMemo(() => {
        return createCSSVariableMapping()
    }, [])

    // Create Tailwind class mappings
    const tailwindClassMappings = useMemo(() => {
        return createTailwindClassMapping()
    }, [])

    // Generate theme-aware classes for different breakpoints
    const themeClasses = useMemo(() => {
        const baseClasses = generateThemeAwareClasses(integratedTheme, tailwindClassMappings)
        const mobileClasses = generateThemeAwareClasses(integratedTheme, tailwindClassMappings, 'sm')
        const tabletClasses = generateThemeAwareClasses(integratedTheme, tailwindClassMappings, 'md')
        const desktopClasses = generateThemeAwareClasses(integratedTheme, tailwindClassMappings, 'lg')

        return {
            base: baseClasses,
            mobile: mobileClasses,
            tablet: tabletClasses,
            desktop: desktopClasses,
            all: [...baseClasses, ...mobileClasses, ...tabletClasses, ...desktopClasses]
        }
    }, [integratedTheme, tailwindClassMappings])

    // Apply CSS variables to the element when theme changes
    useEffect(() => {
        if (elementRef.current && !loading) {
            applyCSSVariableMapping(elementRef.current, integratedTheme, cssVariableMappings)
        }
    }, [integratedTheme, cssVariableMappings, loading])

    // Generate CSS variables object for inline styles
    const cssVariables = useMemo(() => {
        const variables: Record<string, string> = {}

        cssVariableMappings.forEach(mapping => {
            const value = integratedTheme[mapping.themeKey] || mapping.fallback
            variables[mapping.cssVariable] = value
        })

        return variables
    }, [integratedTheme, cssVariableMappings])

    // Theme compatibility check
    const isThemeCompatible = useMemo(() => {
        if (!siteConfig) return true

        // Check if current theme mode is supported
        const supportedThemes = ['LIGHT', 'DARK', 'AUTO']
        return supportedThemes.includes(siteConfig.theme)
    }, [siteConfig])

    // Responsive breakpoint information
    const breakpointInfo = useMemo(() => {
        if (!responsive) return null

        return {
            mobile: {
                maxWidth: '767px',
                config: responsive.mobile
            },
            tablet: {
                minWidth: '768px',
                maxWidth: '1023px',
                config: responsive.tablet
            },
            desktop: {
                minWidth: '1024px',
                config: responsive.desktop
            }
        }
    }, [responsive])

    return {
        // Theme data
        theme: integratedTheme,
        siteConfig,
        loading,
        isThemeCompatible,

        // CSS integration
        cssVariables,
        cssVariableMappings,
        themeClasses,

        // Responsive data
        breakpointInfo,
        responsive,

        // Element ref for CSS variable application
        elementRef,

        // Utility functions
        applyThemeToElement: (element: HTMLElement) => {
            applyCSSVariableMapping(element, integratedTheme, cssVariableMappings)
        },

        getThemeClassesForBreakpoint: (breakpoint: 'base' | 'mobile' | 'tablet' | 'desktop') => {
            return themeClasses[breakpoint] || []
        }
    }
}

/**
 * Hook for responsive design utilities
 * Provides responsive class generation and breakpoint handling
 */
export function useResponsiveDesign(config: ResponsiveConfig) {
    // Generate responsive classes for common properties
    const responsiveClasses = useMemo(() => {
        const classes: Record<string, string> = {}

        // Layout classes
        classes.container = [
            // Mobile
            'flex',
            config.mobile.layout.direction === 'column' ? 'flex-col' : 'flex-row',
            `items-${config.mobile.layout.alignment}`,
            `justify-${config.mobile.layout.justification}`,
            `gap-${getSpacingClass(config.mobile.layout.gap)}`,

            // Tablet
            `md:${config.tablet.layout.direction === 'column' ? 'flex-col' : 'flex-row'}`,
            `md:items-${config.tablet.layout.alignment}`,
            `md:justify-${config.tablet.layout.justification}`,
            `md:gap-${getSpacingClass(config.tablet.layout.gap)}`,

            // Desktop
            `lg:${config.desktop.layout.direction === 'column' ? 'flex-col' : 'flex-row'}`,
            `lg:items-${config.desktop.layout.alignment}`,
            `lg:justify-${config.desktop.layout.justification}`,
            `lg:gap-${getSpacingClass(config.desktop.layout.gap)}`
        ].join(' ')

        // Typography classes
        classes.typography = [
            // Mobile
            getFontSizeClass(config.mobile.typography.fontSize),
            `leading-${getLineHeightClass(config.mobile.typography.lineHeight)}`,
            getFontWeightClass(config.mobile.typography.fontWeight),
            `text-${config.mobile.typography.textAlign}`,

            // Tablet
            `md:${getFontSizeClass(config.tablet.typography.fontSize)}`,
            `md:leading-${getLineHeightClass(config.tablet.typography.lineHeight)}`,
            `md:${getFontWeightClass(config.tablet.typography.fontWeight)}`,
            `md:text-${config.tablet.typography.textAlign}`,

            // Desktop
            `lg:${getFontSizeClass(config.desktop.typography.fontSize)}`,
            `lg:leading-${getLineHeightClass(config.desktop.typography.lineHeight)}`,
            `lg:${getFontWeightClass(config.desktop.typography.fontWeight)}`,
            `lg:text-${config.desktop.typography.textAlign}`
        ].join(' ')

        // Spacing classes
        classes.spacing = [
            // Mobile padding
            `pt-${getSpacingClass(config.mobile.spacing.padding.top)}`,
            `pr-${getSpacingClass(config.mobile.spacing.padding.right)}`,
            `pb-${getSpacingClass(config.mobile.spacing.padding.bottom)}`,
            `pl-${getSpacingClass(config.mobile.spacing.padding.left)}`,

            // Tablet padding
            `md:pt-${getSpacingClass(config.tablet.spacing.padding.top)}`,
            `md:pr-${getSpacingClass(config.tablet.spacing.padding.right)}`,
            `md:pb-${getSpacingClass(config.tablet.spacing.padding.bottom)}`,
            `md:pl-${getSpacingClass(config.tablet.spacing.padding.left)}`,

            // Desktop padding
            `lg:pt-${getSpacingClass(config.desktop.spacing.padding.top)}`,
            `lg:pr-${getSpacingClass(config.desktop.spacing.padding.right)}`,
            `lg:pb-${getSpacingClass(config.desktop.spacing.padding.bottom)}`,
            `lg:pl-${getSpacingClass(config.desktop.spacing.padding.left)}`
        ].join(' ')

        return classes
    }, [config])

    // Current breakpoint detection (client-side only)
    const currentBreakpoint = useMemo(() => {
        if (typeof window === 'undefined') return 'desktop'

        const width = window.innerWidth
        if (width < 768) return 'mobile'
        if (width < 1024) return 'tablet'
        return 'desktop'
    }, [])

    return {
        responsiveClasses,
        currentBreakpoint,
        config,

        // Utility functions
        getClassesForBreakpoint: (breakpoint: 'mobile' | 'tablet' | 'desktop') => {
            const breakpointConfig = config[breakpoint]
            return {
                layout: `flex ${breakpointConfig.layout.direction === 'column' ? 'flex-col' : 'flex-row'} items-${breakpointConfig.layout.alignment} justify-${breakpointConfig.layout.justification}`,
                typography: `${getFontSizeClass(breakpointConfig.typography.fontSize)} leading-${getLineHeightClass(breakpointConfig.typography.lineHeight)} ${getFontWeightClass(breakpointConfig.typography.fontWeight)} text-${breakpointConfig.typography.textAlign}`,
                spacing: `pt-${getSpacingClass(breakpointConfig.spacing.padding.top)} pr-${getSpacingClass(breakpointConfig.spacing.padding.right)} pb-${getSpacingClass(breakpointConfig.spacing.padding.bottom)} pl-${getSpacingClass(breakpointConfig.spacing.padding.left)}`
            }
        }
    }
}

// Helper functions
function getSpacingClass(value: string): string {
    const spacingMap: Record<string, string> = {
        '0': '0',
        '0.25rem': '1',
        '0.5rem': '2',
        '0.75rem': '3',
        '1rem': '4',
        '1.25rem': '5',
        '1.5rem': '6',
        '2rem': '8',
        '2.5rem': '10',
        '3rem': '12',
        '4rem': '16',
        '5rem': '20',
        '6rem': '24'
    }
    return spacingMap[value] || '4'
}

function getFontSizeClass(size: string): string {
    const sizeMap: Record<string, string> = {
        'xs': 'text-xs',
        'sm': 'text-sm',
        'base': 'text-base',
        'lg': 'text-lg',
        'xl': 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl'
    }
    return sizeMap[size] || 'text-base'
}

function getLineHeightClass(lineHeight: string): string {
    const lineHeightMap: Record<string, string> = {
        '1': 'none',
        '1.25': 'tight',
        '1.375': 'snug',
        '1.5': 'normal',
        '1.625': 'relaxed',
        '2': 'loose'
    }
    return lineHeightMap[lineHeight] || 'normal'
}

function getFontWeightClass(weight: string): string {
    const weightMap: Record<string, string> = {
        'thin': 'font-thin',
        'light': 'font-light',
        'normal': 'font-normal',
        'medium': 'font-medium',
        'semibold': 'font-semibold',
        'bold': 'font-bold',
        'extrabold': 'font-extrabold',
        'black': 'font-black'
    }
    return weightMap[weight] || 'font-normal'
}

/**
 * Accessibility management hook for hero sections
 */
export function useAccessibility(config: AccessibilityConfig) {
    const containerRef = useRef<HTMLElement>(null)
    const focusManager = createFocusManager()
    const [announcements, setAnnouncements] = useState<string[]>([])

    // Initialize focus management
    useEffect(() => {
        if (containerRef.current && config.keyboardNavigation) {
            focusManager.updateFocusableElements(containerRef.current)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.keyboardNavigation])

    // Handle keyboard navigation
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (!config.keyboardNavigation) return

        switch (event.key) {
            case 'Tab':
                // Let default tab behavior work, but update focus tracking
                setTimeout(() => {
                    if (containerRef.current) {
                        focusManager.updateFocusableElements(containerRef.current)
                    }
                }, 0)
                break
            case 'Home':
                if (event.ctrlKey) {
                    event.preventDefault()
                    focusManager.focusFirst()
                }
                break
            case 'End':
                if (event.ctrlKey) {
                    event.preventDefault()
                    focusManager.focusLast()
                }
                break
        }
    }, [config.keyboardNavigation, focusManager])

    // Announce content changes to screen readers
    const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
        if (config.screenReaderSupport) {
            announceToScreenReader(message, priority)
            setAnnouncements(prev => [...prev.slice(-4), message]) // Keep last 5 announcements
        }
    }, [config.screenReaderSupport])

    // Check if reduced motion is preferred
    const prefersReducedMotion = respectsReducedMotion()

    // Generate accessibility props for the container
    const accessibilityProps = {
        ref: containerRef,
        onKeyDown: handleKeyDown,
        'data-reduced-motion': config.reducedMotion || prefersReducedMotion,
        'data-high-contrast': config.highContrast,
        'aria-live': config.screenReaderSupport ? 'polite' as const : undefined
    }

    return {
        containerRef,
        accessibilityProps,
        focusManager,
        announce,
        announcements,
        prefersReducedMotion
    }
}

/**
 * Combined hook for theme, responsive, and accessibility features with performance optimization
 */
export function useHeroIntegration(
    theme: ThemeConfig,
    responsive: ResponsiveConfig,
    accessibility: AccessibilityConfig,
    variant?: HeroVariant
) {
    const themeIntegration = useThemeIntegration(theme, responsive)
    const responsiveDesign = useResponsiveDesign(responsive)
    const accessibilityFeatures = useAccessibility(accessibility)

    // Always call hooks with default values to avoid conditional calls
    const performanceOptimization = usePerformanceOptimization({
        variant: variant || HeroVariant.CENTERED,
        enableMonitoring: process.env.NODE_ENV === 'development'
    })

    // Always call critical CSS hook with default variant
    const criticalCSS = useCriticalCSS(variant || HeroVariant.CENTERED)

    // Combine all refs into one
    const combinedRef = useCallback((element: HTMLElement | null) => {
        if (element) {
            // Note: We can't assign to current directly, so we'll use a different approach
            if (themeIntegration.elementRef) {
                (themeIntegration.elementRef as any).current = element
            }
            if (accessibilityFeatures.containerRef) {
                (accessibilityFeatures.containerRef as any).current = element
            }
        }
    }, [themeIntegration.elementRef, accessibilityFeatures.containerRef])

    return {
        ...themeIntegration,
        ...responsiveDesign,
        ...accessibilityFeatures,
        ...(performanceOptimization || {}),
        combinedRef,
        criticalCSS,

        // Performance utilities
        optimizeImage: performanceOptimization?.optimizeImage,
        optimizeVideo: performanceOptimization?.optimizeVideo,
        measureRender: performanceOptimization?.measureRender,
        getPerformanceMetrics: performanceOptimization?.getMetrics
    }
}

/**
 * Performance-enhanced theme integration hook
 */
export function usePerformantThemeIntegration(
    variant: HeroVariant,
    baseTheme?: Partial<ThemeConfig>,
    responsive?: ResponsiveConfig,
    accessibility?: AccessibilityConfig
) {
    const defaultAccessibility = {
        keyboardNavigation: true,
        screenReaderSupport: true,
        reducedMotion: false,
        highContrast: false,
        ariaLabels: {},
        altTexts: {}
    }

    const defaultTheme = getDefaultThemeConfig()
    const mergedTheme = baseTheme ? { ...defaultTheme, ...baseTheme } : defaultTheme

    return useHeroIntegration(
        mergedTheme,
        responsive || {
            mobile: {
                layout: { 
                    direction: 'column', 
                    alignment: 'center', 
                    justification: 'center', 
                    gap: '1rem',
                    padding: '1rem',
                    margin: '0'
                },
                typography: { fontSize: 'base', lineHeight: '1.5', fontWeight: 'normal', textAlign: 'center' },
                spacing: { 
                    padding: { top: '2rem', right: '1rem', bottom: '2rem', left: '1rem' },
                    margin: { top: '0', right: '0', bottom: '0', left: '0' }
                }
            },
            tablet: {
                layout: { 
                    direction: 'row', 
                    alignment: 'center', 
                    justification: 'center', 
                    gap: '2rem',
                    padding: '2rem',
                    margin: '0'
                },
                typography: { fontSize: 'lg', lineHeight: '1.5', fontWeight: 'normal', textAlign: 'center' },
                spacing: { 
                    padding: { top: '3rem', right: '2rem', bottom: '3rem', left: '2rem' },
                    margin: { top: '0', right: '0', bottom: '0', left: '0' }
                }
            },
            desktop: {
                layout: { 
                    direction: 'row', 
                    alignment: 'center', 
                    justification: 'center', 
                    gap: '3rem',
                    padding: '3rem',
                    margin: '0'
                },
                typography: { fontSize: 'xl', lineHeight: '1.5', fontWeight: 'normal', textAlign: 'center' },
                spacing: { 
                    padding: { top: '4rem', right: '3rem', bottom: '4rem', left: '3rem' },
                    margin: { top: '0', right: '0', bottom: '0', left: '0' }
                }
            }
        },
        accessibility || defaultAccessibility,
        variant
    )
}