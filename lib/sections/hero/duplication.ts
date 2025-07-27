// Hero Section Duplication and Variant Switching Utilities

import {
    HeroProps,
    HeroVariant,
    HeroCenteredProps,
    HeroSplitScreenProps,
    HeroVideoProps,
    HeroMinimalProps,
    HeroFeatureProps,
    HeroTestimonialProps,
    HeroProductProps,
    HeroServiceProps,
    HeroCTAProps,
    HeroGalleryProps,
    BackgroundConfig,
    ButtonConfig,
    TextContent,
    MediaConfig,
    ThemeConfig,
    ResponsiveConfig,
    AnimationConfig,
    AccessibilityConfig
} from './types'
import { HERO_SECTION_REGISTRY } from './registry'

/**
 * Duplicate a hero section with all properties preserved
 */
export function duplicateHeroSection<T extends HeroProps>(
    originalProps: T,
    options: {
        newId?: string
        preserveMedia?: boolean
        preserveButtons?: boolean
        namePrefix?: string
    } = {}
): T {
    const {
        newId = `${originalProps.id}-copy-${Date.now()}`,
        preserveMedia = true,
        preserveButtons = true,
        namePrefix = 'Copy of '
    } = options

    // Deep clone the original props
    const duplicatedProps = JSON.parse(JSON.stringify(originalProps)) as T

    // Update the ID
    duplicatedProps.id = newId

    // Update titles if they exist to indicate it's a copy
    if ('title' in duplicatedProps && duplicatedProps.title) {
        const title = duplicatedProps.title as TextContent
        if (title.text && !title.text.startsWith(namePrefix)) {
            title.text = `${namePrefix}${title.text}`
        }
    }

    // Handle content.title for variants that have nested content
    if ('content' in duplicatedProps && duplicatedProps.content && 
        typeof duplicatedProps.content === 'object' && 'title' in duplicatedProps.content) {
        const content = duplicatedProps.content as any
        if (content.title?.text && !content.title.text.startsWith(namePrefix)) {
            content.title.text = `${namePrefix}${content.title.text}`
        }
    }

    // Optionally preserve or reset media references
    if (!preserveMedia) {
        resetMediaReferences(duplicatedProps)
    }

    // Optionally preserve or reset button URLs
    if (!preserveButtons) {
        resetButtonUrls(duplicatedProps)
    }

    return duplicatedProps
}

/**
 * Switch hero section variant with property mapping
 */
export function switchHeroVariant<T extends HeroProps, U extends HeroProps>(
    originalProps: T,
    targetVariant: HeroVariant,
    options: {
        preserveCompatibleProps?: boolean
        useDefaultsForIncompatible?: boolean
        migrationStrategy?: 'strict' | 'flexible' | 'aggressive'
    } = {}
): U {
    const {
        preserveCompatibleProps = true,
        useDefaultsForIncompatible = true,
        migrationStrategy = 'flexible'
    } = options

    // Get target variant configuration
    const targetConfig = Object.values(HERO_SECTION_REGISTRY).find(
        config => config.variant === targetVariant
    )

    if (!targetConfig) {
        throw new Error(`Unknown hero variant: ${targetVariant}`)
    }

    // Start with default props for target variant
    const newProps = JSON.parse(JSON.stringify(targetConfig.defaultProps)) as U

    // Preserve base properties
    newProps.id = originalProps.id
    newProps.variant = targetVariant
    newProps.theme = originalProps.theme
    newProps.responsive = originalProps.responsive
    newProps.animation = originalProps.animation
    newProps.accessibility = originalProps.accessibility
    newProps.className = originalProps.className
    newProps.style = originalProps.style

    if (preserveCompatibleProps) {
        // Apply property migration based on strategy
        switch (migrationStrategy) {
            case 'strict':
                migratePropertiesStrict(originalProps, newProps, targetVariant)
                break
            case 'flexible':
                migratePropertiesFlexible(originalProps, newProps, targetVariant)
                break
            case 'aggressive':
                migratePropertiesAggressive(originalProps, newProps, targetVariant)
                break
        }
    }

    return newProps
}

/**
 * Get property compatibility map between variants
 */
export function getPropertyCompatibilityMap(
    sourceVariant: HeroVariant,
    targetVariant: HeroVariant
): {
    compatible: string[]
    incompatible: string[]
    requiresTransformation: Array<{
        source: string
        target: string
        transformer: (value: any) => any
    }>
} {
    const compatibilityMaps: Record<string, Record<string, any>> = {
        // Common properties that are compatible across most variants
        common: {
            compatible: [
                'theme',
                'responsive',
                'animation',
                'accessibility',
                'className',
                'style',
                'background'
            ],
            incompatible: [],
            requiresTransformation: []
        },

        // Centered variant compatibility
        [`${HeroVariant.CENTERED}-${HeroVariant.SPLIT_SCREEN}`]: {
            compatible: ['title', 'subtitle', 'description', 'primaryButton', 'secondaryButton', 'background'],
            incompatible: ['textAlign'],
            requiresTransformation: [
                {
                    source: 'primaryButton',
                    target: 'content.buttons[0]',
                    transformer: (button: ButtonConfig) => [button]
                },
                {
                    source: 'secondaryButton',
                    target: 'content.buttons[1]',
                    transformer: (button: ButtonConfig) => button
                }
            ]
        },

        [`${HeroVariant.CENTERED}-${HeroVariant.MINIMAL}`]: {
            compatible: ['title', 'subtitle', 'background'],
            incompatible: ['description', 'secondaryButton', 'textAlign'],
            requiresTransformation: [
                {
                    source: 'primaryButton',
                    target: 'button',
                    transformer: (button: ButtonConfig) => button
                }
            ]
        },

        [`${HeroVariant.SPLIT_SCREEN}-${HeroVariant.CENTERED}`]: {
            compatible: ['background'],
            incompatible: ['media', 'layout', 'contentAlignment', 'mediaAlignment'],
            requiresTransformation: [
                {
                    source: 'content.title',
                    target: 'title',
                    transformer: (title: TextContent) => title
                },
                {
                    source: 'content.subtitle',
                    target: 'subtitle',
                    transformer: (subtitle: TextContent) => subtitle
                },
                {
                    source: 'content.description',
                    target: 'description',
                    transformer: (description: TextContent) => description
                },
                {
                    source: 'content.buttons[0]',
                    target: 'primaryButton',
                    transformer: (button: ButtonConfig) => button
                },
                {
                    source: 'content.buttons[1]',
                    target: 'secondaryButton',
                    transformer: (button: ButtonConfig) => button
                }
            ]
        },

        [`${HeroVariant.VIDEO}-${HeroVariant.CENTERED}`]: {
            compatible: ['background'],
            incompatible: ['video', 'overlay'],
            requiresTransformation: [
                {
                    source: 'content.title',
                    target: 'title',
                    transformer: (title: TextContent) => title
                },
                {
                    source: 'content.subtitle',
                    target: 'subtitle',
                    transformer: (subtitle: TextContent) => subtitle
                },
                {
                    source: 'content.description',
                    target: 'description',
                    transformer: (description: TextContent) => description
                },
                {
                    source: 'content.buttons[0]',
                    target: 'primaryButton',
                    transformer: (button: ButtonConfig) => button
                },
                {
                    source: 'content.buttons[1]',
                    target: 'secondaryButton',
                    transformer: (button: ButtonConfig) => button
                }
            ]
        }
    }

    const key = `${sourceVariant}-${targetVariant}`
    const specificMap = compatibilityMaps[key] || {}
    const commonMap = compatibilityMaps.common

    return {
        compatible: [...commonMap.compatible, ...(specificMap.compatible || [])],
        incompatible: [...commonMap.incompatible, ...(specificMap.incompatible || [])],
        requiresTransformation: [...commonMap.requiresTransformation, ...(specificMap.requiresTransformation || [])]
    }
}

/**
 * Strict property migration - only migrate exact matches
 */
function migratePropertiesStrict<T extends HeroProps, U extends HeroProps>(
    source: T,
    target: U,
    targetVariant: HeroVariant
): void {
    const compatibility = getPropertyCompatibilityMap(source.variant, targetVariant)

    // Only migrate properties that are directly compatible
    compatibility.compatible.forEach(prop => {
        if (prop in source && prop in target) {
            (target as any)[prop] = (source as any)[prop]
        }
    })
}

/**
 * Flexible property migration - migrate compatible props and apply transformations
 */
function migratePropertiesFlexible<T extends HeroProps, U extends HeroProps>(
    source: T,
    target: U,
    targetVariant: HeroVariant
): void {
    const compatibility = getPropertyCompatibilityMap(source.variant, targetVariant)

    // Migrate directly compatible properties
    compatibility.compatible.forEach(prop => {
        if (prop in source && prop in target) {
            (target as any)[prop] = (source as any)[prop]
        }
    })

    // Apply transformations
    compatibility.requiresTransformation.forEach(({ source: sourcePath, target: targetPath, transformer }) => {
        const sourceValue = getNestedProperty(source, sourcePath)
        if (sourceValue !== undefined) {
            const transformedValue = transformer(sourceValue)
            setNestedProperty(target, targetPath, transformedValue)
        }
    })
}

/**
 * Aggressive property migration - attempt to migrate as much as possible
 */
function migratePropertiesAggressive<T extends HeroProps, U extends HeroProps>(
    source: T,
    target: U,
    targetVariant: HeroVariant
): void {
    // Start with flexible migration
    migratePropertiesFlexible(source, target, targetVariant)

    // Attempt additional migrations based on common patterns
    migrateCommonPatterns(source, target, targetVariant)
}

/**
 * Migrate common patterns between variants
 */
function migrateCommonPatterns<T extends HeroProps, U extends HeroProps>(
    source: T,
    target: U,
    targetVariant: HeroVariant
): void {
    // Try to migrate title from various sources
    if (!hasNestedProperty(target, 'title') && !hasNestedProperty(target, 'content.title')) {
        const titleSources = ['title', 'content.title', 'product.name']
        for (const titleSource of titleSources) {
            const title = getNestedProperty(source, titleSource)
            if (title) {
                if (hasNestedProperty(target, 'title')) {
                    setNestedProperty(target, 'title', title)
                } else if (hasNestedProperty(target, 'content.title')) {
                    setNestedProperty(target, 'content.title', title)
                }
                break
            }
        }
    }

    // Try to migrate buttons
    if (hasNestedProperty(target, 'primaryButton') || hasNestedProperty(target, 'button')) {
        const buttonSources = ['primaryButton', 'button', 'content.buttons[0]']
        for (const buttonSource of buttonSources) {
            const button = getNestedProperty(source, buttonSource)
            if (button) {
                if (hasNestedProperty(target, 'primaryButton')) {
                    setNestedProperty(target, 'primaryButton', button)
                } else if (hasNestedProperty(target, 'button')) {
                    setNestedProperty(target, 'button', button)
                }
                break
            }
        }
    }

    // Try to migrate background
    if (hasNestedProperty(target, 'background')) {
        const background = getNestedProperty(source, 'background')
        if (background) {
            setNestedProperty(target, 'background', background)
        }
    }
}

/**
 * Reset media references in duplicated props
 */
function resetMediaReferences(props: HeroProps): void {
    // Reset background image/video
    if ('background' in props && props.background) {
        const background = props.background as BackgroundConfig
        if (background.type === 'image' && background.image) {
            background.image = undefined
        }
        if (background.type === 'video' && background.video) {
            background.video = undefined
        }
    }

    // Reset media in split screen variant
    if (props.variant === HeroVariant.SPLIT_SCREEN && 'media' in props) {
        (props as any).media = undefined
    }

    // Reset video in video variant
    if (props.variant === HeroVariant.VIDEO && 'video' in props) {
        (props as any).video = undefined
    }

    // Reset gallery images
    if (props.variant === HeroVariant.GALLERY && 'gallery' in props) {
        (props as any).gallery = []
    }

    // Reset product images
    if (props.variant === HeroVariant.PRODUCT && 'product' in props) {
        const product = (props as any).product
        if (product && product.images) {
            product.images = []
        }
    }
}

/**
 * Reset button URLs in duplicated props
 */
function resetButtonUrls(props: HeroProps): void {
    const resetButton = (button: ButtonConfig | undefined) => {
        if (button) {
            button.url = '#'
        }
    }

    // Reset buttons based on variant
    if ('primaryButton' in props) {
        resetButton((props as any).primaryButton)
    }
    if ('secondaryButton' in props) {
        resetButton((props as any).secondaryButton)
    }
    if ('button' in props) {
        resetButton((props as any).button)
    }
    if ('content' in props && (props as any).content?.buttons) {
        const buttons = (props as any).content.buttons as ButtonConfig[]
        buttons.forEach(resetButton)
    }
    if ('contactButton' in props) {
        resetButton((props as any).contactButton)
    }
}

/**
 * Get nested property value using dot notation
 */
function getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
        // Handle array notation like buttons[0]
        const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/)
        if (arrayMatch) {
            const [, arrayKey, index] = arrayMatch
            return current?.[arrayKey]?.[parseInt(index)]
        }
        return current?.[key]
    }, obj)
}

/**
 * Set nested property value using dot notation
 */
function setNestedProperty(obj: any, path: string, value: any): void {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    
    let current = obj
    for (const key of keys) {
        // Handle array notation like buttons[0]
        const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/)
        if (arrayMatch) {
            const [, arrayKey, index] = arrayMatch
            if (!current[arrayKey]) {
                current[arrayKey] = []
            }
            if (!current[arrayKey][parseInt(index)]) {
                current[arrayKey][parseInt(index)] = {}
            }
            current = current[arrayKey][parseInt(index)]
        } else {
            if (!current[key]) {
                current[key] = {}
            }
            current = current[key]
        }
    }

    // Handle array notation for the last key
    const arrayMatch = lastKey.match(/^(\w+)\[(\d+)\]$/)
    if (arrayMatch) {
        const [, arrayKey, index] = arrayMatch
        if (!current[arrayKey]) {
            current[arrayKey] = []
        }
        current[arrayKey][parseInt(index)] = value
    } else {
        current[lastKey] = value
    }
}

/**
 * Check if nested property exists
 */
function hasNestedProperty(obj: any, path: string): boolean {
    return getNestedProperty(obj, path) !== undefined
}

/**
 * Get default values for incompatible properties
 */
export function getDefaultValuesForVariant(variant: HeroVariant): Record<string, any> {
    const config = Object.values(HERO_SECTION_REGISTRY).find(
        config => config.variant === variant
    )
    
    return config?.defaultProps || {}
}

/**
 * Validate migrated properties
 */
export function validateMigratedProperties<T extends HeroProps>(
    props: T,
    targetVariant: HeroVariant
): {
    isValid: boolean
    errors: Array<{
        property: string
        message: string
        severity: 'error' | 'warning'
    }>
} {
    const errors: Array<{ property: string; message: string; severity: 'error' | 'warning' }> = []

    // Check required properties based on variant
    const requiredProperties = getRequiredPropertiesForVariant(targetVariant)
    
    requiredProperties.forEach(property => {
        if (!hasNestedProperty(props, property)) {
            errors.push({
                property,
                message: `Required property '${property}' is missing`,
                severity: 'error'
            })
        }
    })

    // Check for potentially problematic migrations
    if (props.variant !== targetVariant) {
        errors.push({
            property: 'variant',
            message: `Variant mismatch: expected '${targetVariant}', got '${props.variant}'`,
            severity: 'error'
        })
    }

    return {
        isValid: errors.filter(e => e.severity === 'error').length === 0,
        errors
    }
}

/**
 * Get required properties for a variant
 */
function getRequiredPropertiesForVariant(variant: HeroVariant): string[] {
    const requiredPropsMap: Record<HeroVariant, string[]> = {
        [HeroVariant.CENTERED]: ['title'],
        [HeroVariant.SPLIT_SCREEN]: ['content.title', 'media'],
        [HeroVariant.VIDEO]: ['video', 'content.title'],
        [HeroVariant.MINIMAL]: ['title'],
        [HeroVariant.FEATURE]: ['title', 'features'],
        [HeroVariant.TESTIMONIAL]: ['title', 'testimonials'],
        [HeroVariant.PRODUCT]: ['product'],
        [HeroVariant.SERVICE]: ['title', 'services'],
        [HeroVariant.CTA]: ['title', 'primaryButton'],
        [HeroVariant.GALLERY]: ['title', 'gallery']
    }

    return requiredPropsMap[variant] || []
}

/**
 * Create migration report
 */
export function createMigrationReport<T extends HeroProps, U extends HeroProps>(
    originalProps: T,
    migratedProps: U,
    targetVariant: HeroVariant
): {
    sourceVariant: HeroVariant
    targetVariant: HeroVariant
    migratedProperties: string[]
    droppedProperties: string[]
    addedProperties: string[]
    transformedProperties: Array<{
        source: string
        target: string
        description: string
    }>
    warnings: string[]
    recommendations: string[]
} {
    const compatibility = getPropertyCompatibilityMap(originalProps.variant, targetVariant)
    
    return {
        sourceVariant: originalProps.variant,
        targetVariant,
        migratedProperties: compatibility.compatible,
        droppedProperties: compatibility.incompatible,
        addedProperties: Object.keys(migratedProps).filter(
            key => !(key in originalProps) && !['id', 'variant'].includes(key)
        ),
        transformedProperties: compatibility.requiresTransformation.map(t => ({
            source: t.source,
            target: t.target,
            description: `Transformed ${t.source} to ${t.target}`
        })),
        warnings: [
            ...compatibility.incompatible.map(prop => 
                `Property '${prop}' from ${originalProps.variant} variant is not compatible with ${targetVariant}`
            )
        ],
        recommendations: [
            'Review migrated content for accuracy',
            'Update media references if needed',
            'Test the migrated section in preview mode',
            'Consider adjusting layout-specific properties'
        ]
    }
}