// Hero Section Utilities

import {
    ThemeConfig,
    ResponsiveConfig,
    ResponsiveBreakpoint,
    BackgroundConfig,
    MediaConfig,
    ButtonConfig,
    TextContent,
    CSSVariableMapping,
    TailwindClassMapping,
    HeroVariant,
    AnimationConfig,
    AccessibilityConfig
} from './types'

// Theme integration utilities
export function applyThemeToProps(props: any, theme: ThemeConfig): any {
    return {
        ...props,
        theme: {
            ...props.theme,
            ...theme
        }
    }
}

export function generateCSSVariables(theme: ThemeConfig): Record<string, string> {
    return {
        '--hero-primary-color': theme.primaryColor,
        '--hero-secondary-color': theme.secondaryColor,
        '--hero-accent-color': theme.accentColor,
        '--hero-background-color': theme.backgroundColor,
        '--hero-text-color': theme.textColor,
        '--hero-border-color': theme.borderColor,
        '--hero-font-family': theme.fontFamily || 'inherit',
        '--hero-border-radius': theme.borderRadius || '0.5rem'
    }
}

export function mapThemeToTailwindClasses(theme: ThemeConfig): string[] {
    const classes: string[] = []

    // Add theme-based classes
    if (theme.primaryColor) {
        classes.push('text-primary')
    }

    if (theme.backgroundColor) {
        classes.push('bg-background')
    }

    if (theme.borderColor) {
        classes.push('border-border')
    }

    return classes
}

// Responsive utilities
export function getResponsiveClasses(
    config: ResponsiveConfig,
    property: keyof ResponsiveBreakpoint['layout']
): string {
    const { mobile, tablet, desktop } = config
    const classes: string[] = []

    // Mobile first approach
    if (mobile.layout[property]) {
        classes.push(getResponsiveClass('', property, mobile.layout[property]))
    }

    if (tablet.layout[property] && tablet.layout[property] !== mobile.layout[property]) {
        classes.push(getResponsiveClass('md:', property, tablet.layout[property]))
    }

    if (desktop.layout[property] && desktop.layout[property] !== tablet.layout[property]) {
        classes.push(getResponsiveClass('lg:', property, desktop.layout[property]))
    }

    return classes.join(' ')
}

function getResponsiveClass(prefix: string, property: string, value: any): string {
    const propertyMap: Record<string, string> = {
        direction: 'flex',
        alignment: 'items',
        justification: 'justify',
        gap: 'gap',
        padding: 'p',
        margin: 'm'
    }

    const valueMap: Record<string, string> = {
        // Direction values
        row: 'row',
        column: 'col',
        'row-reverse': 'row-reverse',
        'column-reverse': 'col-reverse',

        // Alignment values
        start: 'start',
        center: 'center',
        end: 'end',
        stretch: 'stretch',

        // Justification values
        between: 'between',
        around: 'around',
        evenly: 'evenly'
    }

    const mappedProperty = propertyMap[property] || property
    const mappedValue = valueMap[value] || value

    return `${prefix}${mappedProperty}-${mappedValue}`
}

export function getResponsiveTypographyClasses(config: ResponsiveConfig): string {
    const classes: string[] = []

    // Font size classes
    if (config.mobile.typography.fontSize) {
        classes.push(getFontSizeClass(config.mobile.typography.fontSize))
    }

    if (config.tablet.typography.fontSize) {
        classes.push(`md:${getFontSizeClass(config.tablet.typography.fontSize)}`)
    }

    if (config.desktop.typography.fontSize) {
        classes.push(`lg:${getFontSizeClass(config.desktop.typography.fontSize)}`)
    }

    return classes.join(' ')
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
        '6xl': 'text-6xl',
        '7xl': 'text-7xl',
        '8xl': 'text-8xl',
        '9xl': 'text-9xl'
    }

    return sizeMap[size] || 'text-base'
}

// Background utilities
export function generateBackgroundStyles(background: BackgroundConfig): React.CSSProperties {
    const styles: React.CSSProperties = {}

    switch (background.type) {
        case 'color':
            if (background.color) {
                styles.backgroundColor = background.color
            }
            break

        case 'gradient':
            if (background.gradient) {
                const { type, direction, colors } = background.gradient
                const colorStops = colors
                    .map(c => `${c.color} ${c.stop}%`)
                    .join(', ')

                if (type === 'linear') {
                    styles.background = `linear-gradient(${direction || '45deg'}, ${colorStops})`
                } else {
                    styles.background = `radial-gradient(${colorStops})`
                }
            }
            break

        case 'image':
            if (background.image) {
                styles.backgroundImage = `url(${background.image.url})`
                styles.backgroundSize = background.image.objectFit || 'cover'
                styles.backgroundPosition = 'center'
                styles.backgroundRepeat = 'no-repeat'
            }
            break

        case 'video':
            // Video backgrounds are handled separately in components
            break
    }

    return styles
}

export function generateBackgroundClasses(background: BackgroundConfig): string[] {
    const classes: string[] = []

    switch (background.type) {
        case 'color':
            classes.push('bg-background')
            break

        case 'gradient':
            classes.push('bg-gradient-to-r')
            break

        case 'image':
            classes.push('bg-cover', 'bg-center', 'bg-no-repeat')
            break

        case 'video':
            classes.push('relative', 'overflow-hidden')
            break

        default:
            classes.push('bg-transparent')
    }

    if (background.overlay?.enabled) {
        classes.push('relative')
    }

    return classes
}

// Media utilities
export function optimizeImageUrl(media: MediaConfig, width?: number, quality?: number): string {
    const { url } = media

    // If it's already optimized or external, return as-is
    if (url.includes('?') || !url.startsWith('/')) {
        return url
    }

    const params = new URLSearchParams()

    if (width) {
        params.set('w', width.toString())
    }

    if (quality) {
        params.set('q', quality.toString())
    }

    return params.toString() ? `${url}?${params.toString()}` : url
}

export function generateResponsiveImageSrcSet(media: MediaConfig): string {
    const { url } = media
    const breakpoints = [480, 768, 1024, 1280, 1536]

    return breakpoints
        .map(width => `${optimizeImageUrl(media, width)} ${width}w`)
        .join(', ')
}

export function getImageSizes(breakpoints: string[] = ['100vw']): string {
    return breakpoints.join(', ')
}

// Button utilities
export function generateButtonClasses(button: ButtonConfig): string[] {
    const classes: string[] = ['inline-flex', 'items-center', 'justify-center', 'font-medium', 'transition-colors']

    // Size classes
    switch (button.size) {
        case 'sm':
            classes.push('px-3', 'py-1.5', 'text-sm')
            break
        case 'md':
            classes.push('px-4', 'py-2', 'text-base')
            break
        case 'lg':
            classes.push('px-6', 'py-3', 'text-lg')
            break
        case 'xl':
            classes.push('px-8', 'py-4', 'text-xl')
            break
    }

    // Style classes
    switch (button.style) {
        case 'primary':
            classes.push('bg-primary', 'text-primary-foreground', 'hover:bg-primary/90')
            break
        case 'secondary':
            classes.push('bg-secondary', 'text-secondary-foreground', 'hover:bg-secondary/80')
            break
        case 'outline':
            classes.push('border', 'border-input', 'bg-background', 'hover:bg-accent', 'hover:text-accent-foreground')
            break
        case 'ghost':
            classes.push('hover:bg-accent', 'hover:text-accent-foreground')
            break
        case 'link':
            classes.push('text-primary', 'underline-offset-4', 'hover:underline')
            break
    }

    return classes
}

// Text utilities
export function generateTextClasses(text: TextContent): string[] {
    const classes: string[] = []

    // Add default classes based on tag
    switch (text.tag) {
        case 'h1':
            classes.push('text-4xl', 'md:text-5xl', 'lg:text-6xl', 'font-bold')
            break
        case 'h2':
            classes.push('text-3xl', 'md:text-4xl', 'lg:text-5xl', 'font-bold')
            break
        case 'h3':
            classes.push('text-2xl', 'md:text-3xl', 'lg:text-4xl', 'font-semibold')
            break
        case 'h4':
            classes.push('text-xl', 'md:text-2xl', 'lg:text-3xl', 'font-semibold')
            break
        case 'h5':
            classes.push('text-lg', 'md:text-xl', 'lg:text-2xl', 'font-medium')
            break
        case 'h6':
            classes.push('text-base', 'md:text-lg', 'lg:text-xl', 'font-medium')
            break
        case 'p':
            classes.push('text-base', 'md:text-lg', 'leading-relaxed')
            break
        default:
            classes.push('text-base')
    }

    return classes
}

// Animation utilities
export function generateAnimationClasses(animation?: AnimationConfig): string[] {
    if (!animation?.enabled) return []

    const classes: string[] = ['transition-all']

    // Duration classes
    switch (animation.duration) {
        case 150:
            classes.push('duration-150')
            break
        case 300:
            classes.push('duration-300')
            break
        case 500:
            classes.push('duration-500')
            break
        case 700:
            classes.push('duration-700')
            break
        case 1000:
            classes.push('duration-1000')
            break
        default:
            classes.push('duration-300')
    }

    // Easing classes
    switch (animation.easing) {
        case 'ease-in':
            classes.push('ease-in')
            break
        case 'ease-out':
            classes.push('ease-out')
            break
        case 'ease-in-out':
            classes.push('ease-in-out')
            break
        case 'linear':
            classes.push('ease-linear')
            break
        default:
            classes.push('ease-out')
    }

    return classes
}

// Accessibility utilities
export function generateAccessibilityProps(config: AccessibilityConfig): Record<string, any> {
    const props: Record<string, any> = {}

    if (config.ariaLabels) {
        Object.entries(config.ariaLabels).forEach(([key, value]) => {
            props[`aria-${key}`] = value
        })
    }

    if (config.keyboardNavigation) {
        props.tabIndex = 0
    }

    if (config.reducedMotion) {
        props['data-reduce-motion'] = 'true'
    }

    return props
}

export function generateAriaLabel(variant: HeroVariant, title?: string): string {
    const baseLabel = `Hero section with ${variant.replace('-', ' ')} layout`
    return title ? `${baseLabel}: ${title}` : baseLabel
}

// Validation utilities
export function validateMediaConfig(media: MediaConfig): string[] {
    const errors: string[] = []

    if (!media.url) {
        errors.push('Media URL is required')
    }

    if (!media.alt && media.type === 'image') {
        errors.push('Alt text is required for images')
    }

    if (media.type === 'video' && !media.url.match(/\.(mp4|webm|ogg)$/i)) {
        errors.push('Video must be in MP4, WebM, or OGG format')
    }

    return errors
}

export function validateButtonConfig(button: ButtonConfig): string[] {
    const errors: string[] = []

    if (!button.text) {
        errors.push('Button text is required')
    }

    if (!button.url) {
        errors.push('Button URL is required')
    }

    if (button.url && !isValidUrl(button.url)) {
        errors.push('Button URL must be valid')
    }

    return errors
}

function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        // Check for relative URLs
        return url.startsWith('/') || url.startsWith('#')
    }
}

// Performance utilities
export function shouldLazyLoad(media: MediaConfig, isAboveFold: boolean = false): boolean {
    return media.loading === 'lazy' && !isAboveFold
}

export function getOptimalImageFormat(url: string): string {
    // Check if browser supports WebP
    if (typeof window !== 'undefined' && window.HTMLCanvasElement) {
        const canvas = document.createElement('canvas')
        const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0

        if (webpSupported && !url.includes('.svg')) {
            return url.replace(/\.(jpg|jpeg|png)$/i, '.webp')
        }
    }

    return url
}

// Default configurations
export function getDefaultThemeConfig(): ThemeConfig {
    return {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderColor: '#e5e7eb',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        borderRadius: '0.5rem'
    }
}

export function getDefaultResponsiveConfig(): ResponsiveConfig {
    return {
        mobile: {
            layout: {
                direction: 'column',
                alignment: 'center',
                justification: 'center',
                gap: '1rem',
                padding: '1rem',
                margin: '0'
            },
            typography: {
                fontSize: 'base',
                lineHeight: '1.5',
                fontWeight: 'normal',
                textAlign: 'center'
            },
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
            typography: {
                fontSize: 'lg',
                lineHeight: '1.6',
                fontWeight: 'normal',
                textAlign: 'center'
            },
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
            typography: {
                fontSize: 'xl',
                lineHeight: '1.7',
                fontWeight: 'normal',
                textAlign: 'center'
            },
            spacing: {
                padding: { top: '4rem', right: '3rem', bottom: '4rem', left: '3rem' },
                margin: { top: '0', right: '0', bottom: '0', left: '0' }
            }
        }
    }
}

export function getDefaultAccessibilityConfig(): AccessibilityConfig {
    return {
        ariaLabels: {},
        altTexts: {},
        keyboardNavigation: true,
        screenReaderSupport: true,
        highContrast: false,
        reducedMotion: false
    }
}

// Utility function to merge configurations
export function mergeConfigs<T extends Record<string, any>>(
    defaultConfig: T,
    userConfig: Partial<T>
): T {
    return {
        ...defaultConfig,
        ...userConfig
    }
}