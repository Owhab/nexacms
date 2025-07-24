// Hero Section Migration Utilities
// Provides utilities for migrating existing hero sections to new variants

import { HeroVariant } from './types'
import { HERO_MIGRATION_MAP, migrateHeroSection } from '../registry'

export interface MigrationResult {
    success: boolean
    newSectionId: string
    newProps: any
    warnings?: string[]
    errors?: string[]
}

export interface MigrationOptions {
    preserveCustomStyles?: boolean
    fallbackVariant?: HeroVariant
    validateProps?: boolean
}

/**
 * Migrate a legacy hero section to a new hero variant
 */
export function migrateLegacyHeroSection(
    oldProps: any,
    targetVariant?: HeroVariant,
    options: MigrationOptions = {}
): MigrationResult {
    const {
        preserveCustomStyles = true,
        fallbackVariant = HeroVariant.CENTERED,
        validateProps = true
    } = options

    try {
        // First try the standard migration
        const standardMigration = migrateHeroSection('hero-section', oldProps)
        
        if (standardMigration) {
            let result = standardMigration
            
            // If a specific target variant is requested, try to adapt to it
            if (targetVariant && targetVariant !== HeroVariant.CENTERED) {
                result = adaptToVariant(result.props, targetVariant, oldProps)
            }
            
            // Validate the migrated props if requested
            if (validateProps) {
                const validation = validateMigratedProps(result.props, result.sectionId)
                if (!validation.isValid) {
                    return {
                        success: false,
                        newSectionId: result.sectionId,
                        newProps: result.props,
                        errors: validation.errors
                    }
                }
            }
            
            return {
                success: true,
                newSectionId: result.sectionId,
                newProps: result.props,
                warnings: generateMigrationWarnings(oldProps, result.props)
            }
        }
        
        // Fallback to manual migration
        return manualMigration(oldProps, targetVariant || fallbackVariant, options)
        
    } catch (error) {
        return {
            success: false,
            newSectionId: `hero-${targetVariant || fallbackVariant}`,
            newProps: {},
            errors: [`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
        }
    }
}

/**
 * Adapt migrated props to a specific hero variant
 */
function adaptToVariant(
    centeredProps: any,
    targetVariant: HeroVariant,
    originalProps: any
): { sectionId: string; props: any } {
    const sectionId = `hero-${targetVariant}`
    
    switch (targetVariant) {
        case HeroVariant.SPLIT_SCREEN:
            return {
                sectionId,
                props: {
                    content: {
                        title: centeredProps.title,
                        subtitle: centeredProps.subtitle,
                        description: centeredProps.description,
                        buttons: centeredProps.primaryButton ? [centeredProps.primaryButton] : []
                    },
                    media: centeredProps.background?.image || {
                        id: 'hero-media',
                        url: '/assets/hero/hero-image.jpg',
                        type: 'image',
                        alt: 'Hero image',
                        objectFit: 'cover',
                        loading: 'eager'
                    },
                    layout: 'left',
                    contentAlignment: 'center',
                    mediaAlignment: 'center',
                    background: {
                        type: 'color',
                        color: '#ffffff'
                    }
                }
            }
            
        case HeroVariant.MINIMAL:
            return {
                sectionId,
                props: {
                    title: centeredProps.title,
                    subtitle: centeredProps.subtitle,
                    button: centeredProps.primaryButton,
                    background: {
                        type: 'color',
                        color: '#ffffff'
                    },
                    spacing: 'normal'
                }
            }
            
        case HeroVariant.VIDEO:
            return {
                sectionId,
                props: {
                    video: {
                        id: 'hero-video',
                        url: '/assets/hero/hero-video.mp4',
                        type: 'video',
                        autoplay: true,
                        loop: true,
                        muted: true,
                        controls: false,
                        poster: centeredProps.background?.image?.url || '/assets/hero/video-poster.jpg',
                        objectFit: 'cover',
                        loading: 'eager'
                    },
                    overlay: {
                        enabled: true,
                        color: '#000000',
                        opacity: 0.4
                    },
                    content: {
                        title: centeredProps.title,
                        subtitle: centeredProps.subtitle,
                        description: centeredProps.description,
                        buttons: centeredProps.primaryButton ? [centeredProps.primaryButton] : [],
                        position: 'center'
                    }
                }
            }
            
        case HeroVariant.CTA:
            return {
                sectionId,
                props: {
                    title: centeredProps.title,
                    subtitle: centeredProps.subtitle,
                    description: centeredProps.description,
                    primaryButton: centeredProps.primaryButton || {
                        text: 'Get Started',
                        url: '#',
                        style: 'primary',
                        size: 'lg',
                        iconPosition: 'right',
                        target: '_self'
                    },
                    secondaryButton: centeredProps.secondaryButton,
                    background: centeredProps.background,
                    layout: 'center',
                    showBenefits: false
                }
            }
            
        default:
            return { sectionId: `hero-${targetVariant}`, props: centeredProps }
    }
}

/**
 * Manual migration when standard migration fails
 */
function manualMigration(
    oldProps: any,
    targetVariant: HeroVariant,
    options: MigrationOptions
): MigrationResult {
    const sectionId = `hero-${targetVariant}`
    
    // Create basic props structure based on target variant
    let newProps: any = {}
    
    switch (targetVariant) {
        case HeroVariant.CENTERED:
            newProps = {
                title: {
                    text: oldProps.title || 'Welcome to Your Website',
                    tag: 'h1'
                },
                subtitle: oldProps.subtitle ? {
                    text: oldProps.subtitle,
                    tag: 'p'
                } : undefined,
                primaryButton: oldProps.buttonText ? {
                    text: oldProps.buttonText,
                    url: oldProps.buttonLink || '#',
                    style: 'primary',
                    size: 'lg',
                    iconPosition: 'right',
                    target: '_self'
                } : undefined,
                background: {
                    type: 'gradient',
                    gradient: {
                        type: 'linear',
                        direction: '45deg',
                        colors: [
                            { color: '#3b82f6', stop: 0 },
                            { color: '#8b5cf6', stop: 100 }
                        ]
                    }
                },
                textAlign: oldProps.textAlign || 'center'
            }
            break
            
        case HeroVariant.MINIMAL:
            newProps = {
                title: {
                    text: oldProps.title || 'Simple. Elegant. Effective.',
                    tag: 'h1'
                },
                subtitle: oldProps.subtitle ? {
                    text: oldProps.subtitle,
                    tag: 'h2'
                } : undefined,
                button: oldProps.buttonText ? {
                    text: oldProps.buttonText,
                    url: oldProps.buttonLink || '#',
                    style: 'link',
                    size: 'lg',
                    iconPosition: 'right',
                    target: '_self'
                } : undefined,
                background: {
                    type: 'color',
                    color: '#ffffff'
                },
                spacing: 'normal'
            }
            break
            
        default:
            // Fallback to centered variant
            return manualMigration(oldProps, HeroVariant.CENTERED, options)
    }
    
    return {
        success: true,
        newSectionId: sectionId,
        newProps,
        warnings: ['Manual migration performed - please review the migrated content']
    }
}

/**
 * Validate migrated props against the target variant schema
 */
function validateMigratedProps(props: any, sectionId: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    // Basic validation - check for required fields based on variant
    const variant = sectionId.replace('hero-', '') as HeroVariant
    
    switch (variant) {
        case HeroVariant.CENTERED:
            if (!props.title?.text) {
                errors.push('Title is required for centered hero variant')
            }
            break
            
        case HeroVariant.SPLIT_SCREEN:
            if (!props.content?.title?.text) {
                errors.push('Content title is required for split-screen hero variant')
            }
            if (!props.media?.url) {
                errors.push('Media URL is required for split-screen hero variant')
            }
            break
            
        case HeroVariant.VIDEO:
            if (!props.video?.url) {
                errors.push('Video URL is required for video hero variant')
            }
            if (!props.content?.title?.text) {
                errors.push('Content title is required for video hero variant')
            }
            break
            
        case HeroVariant.MINIMAL:
            if (!props.title?.text) {
                errors.push('Title is required for minimal hero variant')
            }
            break
    }
    
    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Generate warnings about potential issues in migration
 */
function generateMigrationWarnings(oldProps: any, newProps: any): string[] {
    const warnings: string[] = []
    
    // Check for lost properties
    if (oldProps.backgroundImage && !newProps.background?.image) {
        warnings.push('Background image may need to be reconfigured')
    }
    
    if (oldProps.customCSS) {
        warnings.push('Custom CSS styles were not migrated - please review and reapply if needed')
    }
    
    if (oldProps.animations) {
        warnings.push('Animation settings were not migrated - please reconfigure if needed')
    }
    
    return warnings
}

/**
 * Get recommended hero variants for migration based on old props
 */
export function getRecommendedVariants(oldProps: any): Array<{ variant: HeroVariant; reason: string; confidence: number }> {
    const recommendations: Array<{ variant: HeroVariant; reason: string; confidence: number }> = []
    
    // Analyze old props to suggest best variants
    if (oldProps.backgroundImage) {
        recommendations.push({
            variant: HeroVariant.SPLIT_SCREEN,
            reason: 'Has background image - works well as media in split-screen layout',
            confidence: 0.8
        })
    }
    
    if (oldProps.buttonText && !oldProps.subtitle) {
        recommendations.push({
            variant: HeroVariant.MINIMAL,
            reason: 'Simple structure with just title and button - perfect for minimal design',
            confidence: 0.7
        })
    }
    
    if (oldProps.title && oldProps.subtitle && oldProps.buttonText) {
        recommendations.push({
            variant: HeroVariant.CENTERED,
            reason: 'Complete content structure - ideal for traditional centered layout',
            confidence: 0.9
        })
    }
    
    if (oldProps.buttonText && (oldProps.title?.toLowerCase().includes('buy') || oldProps.title?.toLowerCase().includes('get'))) {
        recommendations.push({
            variant: HeroVariant.CTA,
            reason: 'Action-oriented content - optimized for conversions',
            confidence: 0.6
        })
    }
    
    // Sort by confidence
    return recommendations.sort((a, b) => b.confidence - a.confidence)
}

/**
 * Batch migrate multiple hero sections
 */
export function batchMigrateHeroSections(
    sections: Array<{ id: string; props: any }>,
    options: MigrationOptions = {}
): Array<{ id: string; migration: MigrationResult }> {
    return sections.map(section => ({
        id: section.id,
        migration: migrateLegacyHeroSection(section.props, undefined, options)
    }))
}

/**
 * Preview migration without applying changes
 */
export function previewMigration(
    oldProps: any,
    targetVariant?: HeroVariant
): { preview: any; warnings: string[]; recommendations: Array<{ variant: HeroVariant; reason: string; confidence: number }> } {
    const migration = migrateLegacyHeroSection(oldProps, targetVariant, { validateProps: false })
    const recommendations = getRecommendedVariants(oldProps)
    
    return {
        preview: migration.newProps,
        warnings: migration.warnings || [],
        recommendations
    }
}