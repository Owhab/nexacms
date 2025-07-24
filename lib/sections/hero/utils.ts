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

// Enhanced theme integration with site configuration
export function integrateWithSiteConfig(theme: ThemeConfig, siteConfig: any): ThemeConfig {
    if (!siteConfig) return theme

    return {
        ...theme,
        primaryColor: siteConfig.primaryColor || theme.primaryColor,
        secondaryColor: siteConfig.secondaryColor || theme.secondaryColor,
        accentColor: siteConfig.accentColor || theme.accentColor,
        backgroundColor: siteConfig.backgroundColor || theme.backgroundColor,
        textColor: siteConfig.textColor || theme.textColor,
        borderColor: siteConfig.borderColor || theme.borderColor,
        fontFamily: theme.fontFamily || 'inherit',
        borderRadius: theme.borderRadius || '0.5rem'
    }
}

// CSS variable mapping for dynamic theme changes
export function createCSSVariableMapping(): CSSVariableMapping[] {
    return [
        {
            property: 'color',
            cssVariable: '--hero-primary-color',
            fallback: '#3b82f6',
            themeKey: 'primaryColor'
        },
        {
            property: 'color',
            cssVariable: '--hero-secondary-color',
            fallback: '#64748b',
            themeKey: 'secondaryColor'
        },
        {
            property: 'color',
            cssVariable: '--hero-accent-color',
            fallback: '#f59e0b',
            themeKey: 'accentColor'
        },
        {
            property: 'background-color',
            cssVariable: '--hero-background-color',
            fallback: '#ffffff',
            themeKey: 'backgroundColor'
        },
        {
            property: 'color',
            cssVariable: '--hero-text-color',
            fallback: '#1f2937',
            themeKey: 'textColor'
        },
        {
            property: 'border-color',
            cssVariable: '--hero-border-color',
            fallback: '#e5e7eb',
            themeKey: 'borderColor'
        }
    ]
}

// Tailwind class mapping for theme integration
export function createTailwindClassMapping(): TailwindClassMapping[] {
    return [
        {
            condition: 'theme.primaryColor',
            classes: ['text-primary', 'border-primary'],
            responsive: true
        },
        {
            condition: 'theme.secondaryColor',
            classes: ['text-secondary', 'bg-secondary'],
            responsive: true
        },
        {
            condition: 'theme.accentColor',
            classes: ['text-accent', 'bg-accent'],
            responsive: true
        },
        {
            condition: 'theme.backgroundColor',
            classes: ['bg-background'],
            responsive: false
        },
        {
            condition: 'theme.textColor',
            classes: ['text-foreground'],
            responsive: false
        },
        {
            condition: 'theme.borderColor',
            classes: ['border-border'],
            responsive: true
        }
    ]
}

// Apply CSS variable mapping to element
export function applyCSSVariableMapping(
    element: HTMLElement,
    theme: ThemeConfig,
    mappings: CSSVariableMapping[]
): void {
    mappings.forEach(mapping => {
        const value = theme[mapping.themeKey] || mapping.fallback
        element.style.setProperty(mapping.cssVariable, value)
    })
}

// Generate theme-aware classes based on mappings
export function generateThemeAwareClasses(
    theme: ThemeConfig,
    mappings: TailwindClassMapping[],
    breakpoint?: string
): string[] {
    const classes: string[] = []

    mappings.forEach(mapping => {
        // Simple condition evaluation (can be enhanced for complex conditions)
        const conditionMet = evaluateCondition(mapping.condition, theme)

        if (conditionMet) {
            mapping.classes.forEach(cls => {
                if (breakpoint && mapping.responsive) {
                    classes.push(`${breakpoint}:${cls}`)
                } else {
                    classes.push(cls)
                }
            })
        }
    })

    return classes
}

// Simple condition evaluator
function evaluateCondition(condition: string, theme: ThemeConfig): boolean {
    // Handle simple property existence checks
    if (condition.startsWith('theme.')) {
        const property = condition.replace('theme.', '') as keyof ThemeConfig
        return !!theme[property]
    }
    return false
}

// Enhanced responsive utilities
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

// Enhanced responsive breakpoint handling
export function generateResponsiveClasses(
    config: ResponsiveConfig,
    properties: Array<keyof ResponsiveBreakpoint['layout']>
): string {
    const allClasses: string[] = []

    properties.forEach(property => {
        const classes = getResponsiveClasses(config, property)
        if (classes) {
            allClasses.push(classes)
        }
    })

    return allClasses.join(' ')
}

// Generate responsive spacing classes
export function getResponsiveSpacingClasses(config: ResponsiveConfig): string {
    const classes: string[] = []

    // Mobile spacing
    const mobilePadding = config.mobile.spacing.padding
    classes.push(
        `pt-${getSpacingValue(mobilePadding.top)}`,
        `pr-${getSpacingValue(mobilePadding.right)}`,
        `pb-${getSpacingValue(mobilePadding.bottom)}`,
        `pl-${getSpacingValue(mobilePadding.left)}`
    )

    // Tablet spacing
    const tabletPadding = config.tablet.spacing.padding
    if (isDifferentSpacing(mobilePadding, tabletPadding)) {
        classes.push(
            `md:pt-${getSpacingValue(tabletPadding.top)}`,
            `md:pr-${getSpacingValue(tabletPadding.right)}`,
            `md:pb-${getSpacingValue(tabletPadding.bottom)}`,
            `md:pl-${getSpacingValue(tabletPadding.left)}`
        )
    }

    // Desktop spacing
    const desktopPadding = config.desktop.spacing.padding
    if (isDifferentSpacing(tabletPadding, desktopPadding)) {
        classes.push(
            `lg:pt-${getSpacingValue(desktopPadding.top)}`,
            `lg:pr-${getSpacingValue(desktopPadding.right)}`,
            `lg:pb-${getSpacingValue(desktopPadding.bottom)}`,
            `lg:pl-${getSpacingValue(desktopPadding.left)}`
        )
    }

    return classes.filter(Boolean).join(' ')
}

// Helper function to convert spacing values to Tailwind classes
function getSpacingValue(value: string): string {
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

// Helper function to check if spacing configurations are different
function isDifferentSpacing(
    spacing1: { top: string; right: string; bottom: string; left: string },
    spacing2: { top: string; right: string; bottom: string; left: string }
): boolean {
    return (
        spacing1.top !== spacing2.top ||
        spacing1.right !== spacing2.right ||
        spacing1.bottom !== spacing2.bottom ||
        spacing1.left !== spacing2.left
    )
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

// Media utilities (enhanced with performance optimizations)
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

    // Add WebP format by default for better compression
    params.set('f', 'webp')

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

// Enhanced Accessibility utilities
export function generateAccessibilityProps(config: AccessibilityConfig): Record<string, any> {
    const props: Record<string, any> = {}

    if (config.ariaLabels) {
        Object.entries(config.ariaLabels).forEach(([key, value]) => {
            props[`aria-${key}`] = value
        })
    }

    if (config.keyboardNavigation) {
        props.tabIndex = 0
        props.role = 'region'
    }

    if (config.reducedMotion) {
        props['data-reduce-motion'] = 'true'
    }

    if (config.screenReaderSupport) {
        props['aria-live'] = 'polite'
    }

    return props
}

export function generateAriaLabel(variant: HeroVariant, title?: string): string {
    const variantLabels: Record<HeroVariant, string> = {
        [HeroVariant.CENTERED]: 'centered hero section',
        [HeroVariant.SPLIT_SCREEN]: 'split screen hero section',
        [HeroVariant.VIDEO]: 'video background hero section',
        [HeroVariant.MINIMAL]: 'minimal hero section',
        [HeroVariant.FEATURE]: 'feature showcase hero section',
        [HeroVariant.TESTIMONIAL]: 'testimonial hero section',
        [HeroVariant.PRODUCT]: 'product showcase hero section',
        [HeroVariant.SERVICE]: 'service hero section',
        [HeroVariant.CTA]: 'call-to-action hero section',
        [HeroVariant.GALLERY]: 'gallery hero section'
    }

    const baseLabel = variantLabels[variant] || `${variant.replace('-', ' ')} hero section`
    return title ? `${baseLabel}: ${title}` : baseLabel
}

// Generate semantic HTML structure for accessibility
export function generateSemanticProps(variant: HeroVariant, isMainHero: boolean = true): Record<string, any> {
    const props: Record<string, any> = {
        role: 'banner',
        'aria-label': generateAriaLabel(variant)
    }

    if (isMainHero) {
        props['data-main-hero'] = 'true'
    }

    return props
}

// Generate ARIA labels for interactive elements
export function generateInteractiveAriaProps(
    element: 'button' | 'link' | 'image' | 'video',
    config: {
        label?: string
        description?: string
        expanded?: boolean
        controls?: string
        hasPopup?: boolean
        current?: boolean
    }
): Record<string, any> {
    const props: Record<string, any> = {}

    if (config.label) {
        props['aria-label'] = config.label
    }

    if (config.description) {
        props['aria-describedby'] = config.description
    }

    if (element === 'button') {
        if (config.expanded !== undefined) {
            props['aria-expanded'] = config.expanded
        }
        if (config.controls) {
            props['aria-controls'] = config.controls
        }
        if (config.hasPopup) {
            props['aria-haspopup'] = config.hasPopup
        }
    }

    if (element === 'link' && config.current) {
        props['aria-current'] = 'page'
    }

    return props
}

// Generate keyboard navigation props
export function generateKeyboardNavigationProps(
    element: 'button' | 'link' | 'focusable',
    config: {
        tabIndex?: number
        onKeyDown?: (event: React.KeyboardEvent) => void
        role?: string
    } = {}
): Record<string, any> {
    const props: Record<string, any> = {
        tabIndex: config.tabIndex ?? 0
    }

    if (config.role) {
        props.role = config.role
    }

    if (config.onKeyDown) {
        props.onKeyDown = config.onKeyDown
    }

    // Add default keyboard handlers for buttons and links
    if (element === 'button' || element === 'link') {
        props.onKeyDown = (event: React.KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                const target = event.target as HTMLElement
                target.click()
            }
            if (config.onKeyDown) {
                config.onKeyDown(event)
            }
        }
    }

    return props
}

// Generate alt text for images with context
export function generateImageAltText(
    media: MediaConfig,
    context: {
        variant: HeroVariant
        isDecorative?: boolean
        purpose?: 'hero' | 'feature' | 'testimonial' | 'product' | 'gallery'
    }
): string {
    if (context.isDecorative) {
        return ''
    }

    if (media.alt) {
        return media.alt
    }

    // Generate contextual alt text based on purpose
    const contextualDescriptions: Record<string, string> = {
        hero: 'Hero section background image',
        feature: 'Feature illustration',
        testimonial: 'Customer testimonial photo',
        product: 'Product showcase image',
        gallery: 'Gallery image'
    }

    const baseDescription = contextualDescriptions[context.purpose || 'hero']
    return `${baseDescription} for ${context.variant.replace('-', ' ')} section`
}

// Generate video accessibility attributes
export function generateVideoAccessibilityProps(
    media: MediaConfig & { autoplay?: boolean; muted?: boolean },
    config: {
        hasAudio?: boolean
        hasSubtitles?: boolean
        isBackground?: boolean
    } = {}
): Record<string, any> {
    const props: Record<string, any> = {}

    if (config.isBackground) {
        props['aria-hidden'] = 'true'
        props.role = 'presentation'
    } else {
        props.role = 'video'
        if (media.alt) {
            props['aria-label'] = media.alt
        }
    }

    if (media.autoplay && config.hasAudio && !media.muted) {
        props['aria-describedby'] = 'video-autoplay-warning'
    }

    if (config.hasSubtitles) {
        props['aria-describedby'] = 'video-subtitles-available'
    }

    return props
}

// Generate focus management utilities
export function createFocusManager() {
    let focusableElements: HTMLElement[] = []
    let currentFocusIndex = -1

    const updateFocusableElements = (container: HTMLElement) => {
        const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        focusableElements = Array.from(container.querySelectorAll(selector)) as HTMLElement[]
        focusableElements = focusableElements.filter(el => !el.hasAttribute('disabled'))
    }

    const focusNext = () => {
        if (focusableElements.length === 0) return
        currentFocusIndex = (currentFocusIndex + 1) % focusableElements.length
        focusableElements[currentFocusIndex]?.focus()
    }

    const focusPrevious = () => {
        if (focusableElements.length === 0) return
        currentFocusIndex = currentFocusIndex <= 0 ? focusableElements.length - 1 : currentFocusIndex - 1
        focusableElements[currentFocusIndex]?.focus()
    }

    const focusFirst = () => {
        if (focusableElements.length === 0) return
        currentFocusIndex = 0
        focusableElements[0]?.focus()
    }

    const focusLast = () => {
        if (focusableElements.length === 0) return
        currentFocusIndex = focusableElements.length - 1
        focusableElements[currentFocusIndex]?.focus()
    }

    return {
        updateFocusableElements,
        focusNext,
        focusPrevious,
        focusFirst,
        focusLast
    }
}

// Screen reader utilities
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (typeof window === 'undefined') return

    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    setTimeout(() => {
        document.body.removeChild(announcement)
    }, 1000)
}

// Color contrast utilities
export function checkColorContrast(foreground: string, background: string): {
    ratio: number
    wcagAA: boolean
    wcagAAA: boolean
} {
    const getLuminance = (color: string): number => {
        const rgb = hexToRgb(color)
        if (!rgb) return 0

        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
            c = c / 255
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        })

        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const foregroundLuminance = getLuminance(foreground)
    const backgroundLuminance = getLuminance(background)

    const ratio = (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
        (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)

    return {
        ratio,
        wcagAA: ratio >= 4.5,
        wcagAAA: ratio >= 7
    }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

// Motion preferences utilities
export function respectsReducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function getMotionSafeClasses(animation?: AnimationConfig): string[] {
    if (!animation?.enabled || respectsReducedMotion()) {
        return []
    }

    return generateAnimationClasses(animation)
}

// Accessibility validation utilities
export function validateAccessibility(element: HTMLElement): {
    errors: string[]
    warnings: string[]
    suggestions: string[]
} {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    // Check for missing alt text on images
    const images = element.querySelectorAll('img')
    images.forEach(img => {
        if (!img.alt && !img.hasAttribute('aria-hidden')) {
            errors.push(`Image missing alt text: ${img.src}`)
        }
    })

    // Check for missing labels on interactive elements
    const buttons = element.querySelectorAll('button')
    buttons.forEach(button => {
        if (!button.textContent?.trim() && !button.getAttribute('aria-label')) {
            errors.push('Button missing accessible label')
        }
    })

    // Check for proper heading hierarchy
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6')
    if (headings.length > 0) {
        const firstHeading = headings[0]
        if (firstHeading.tagName !== 'H1') {
            warnings.push('First heading should be H1')
        }
    }

    // Check for keyboard accessibility
    const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]')
    focusableElements.forEach(el => {
        if (el.getAttribute('tabindex') === '-1' && !el.hasAttribute('aria-hidden')) {
            warnings.push('Focusable element removed from tab order without aria-hidden')
        }
    })

    // Suggestions for improvement
    if (element.querySelectorAll('[role="button"]').length > 0) {
        suggestions.push('Consider using semantic button elements instead of role="button"')
    }

    return { errors, warnings, suggestions }
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