// Hero Section Migration Utilities

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
    ButtonConfig,
    TextContent,
    BackgroundConfig,
    MediaConfig,
    FeatureItem,
    TestimonialItem,
    ProductItem,
    ServiceItem,
    GalleryItem
} from './types'
import { HERO_SECTION_REGISTRY } from './registry'

/**
 * Migration strategy interface
 */
export interface MigrationStrategy {
    name: string
    description: string
    preserveContent: boolean
    preserveMedia: boolean
    preserveLayout: boolean
    allowDataLoss: boolean
}

/**
 * Available migration strategies
 */
export const MIGRATION_STRATEGIES: Record<string, MigrationStrategy> = {
    conservative: {
        name: 'Conservative',
        description: 'Preserve as much data as possible, use defaults for incompatible properties',
        preserveContent: true,
        preserveMedia: true,
        preserveLayout: false,
        allowDataLoss: false
    },
    balanced: {
        name: 'Balanced',
        description: 'Balance between data preservation and target variant optimization',
        preserveContent: true,
        preserveMedia: true,
        preserveLayout: true,
        allowDataLoss: true
    },
    optimized: {
        name: 'Optimized',
        description: 'Optimize for target variant, may lose some source data',
        preserveContent: true,
        preserveMedia: false,
        preserveLayout: true,
        allowDataLoss: true
    }
}

/**
 * Property migration result
 */
export interface MigrationResult<T extends HeroProps> {
    success: boolean
    migratedProps: T
    warnings: string[]
    errors: string[]
    lostData: Array<{
        property: string
        value: any
        reason: string
    }>
    addedDefaults: Array<{
        property: string
        value: any
        reason: string
    }>
}

/**
 * Main migration function
 */
export function migrateHeroSection<T extends HeroProps>(
    sourceProps: HeroProps,
    targetVariant: HeroVariant,
    strategy: MigrationStrategy = MIGRATION_STRATEGIES.balanced
): MigrationResult<T> {
    const result: MigrationResult<T> = {
        success: false,
        migratedProps: {} as T,
        warnings: [],
        errors: [],
        lostData: [],
        addedDefaults: []
    }

    try {
        // Get target variant configuration
        const targetConfig = Object.values(HERO_SECTION_REGISTRY).find(
            config => config.variant === targetVariant
        )

        if (!targetConfig) {
            result.errors.push(`Unknown target variant: ${targetVariant}`)
            return result
        }

        // Start with default props for target variant
        const migratedProps = JSON.parse(JSON.stringify(targetConfig.defaultProps)) as T

        // Preserve base properties
        migratedProps.id = sourceProps.id
        migratedProps.variant = targetVariant
        migratedProps.theme = sourceProps.theme
        migratedProps.responsive = sourceProps.responsive
        migratedProps.animation = sourceProps.animation
        migratedProps.accessibility = sourceProps.accessibility
        migratedProps.className = sourceProps.className
        migratedProps.style = sourceProps.style

        // Apply variant-specific migration
        const migrationFunction = getMigrationFunction(sourceProps.variant, targetVariant)
        if (migrationFunction) {
            const migrationResult = migrationFunction(sourceProps, migratedProps, strategy)
            result.warnings.push(...migrationResult.warnings)
            result.lostData.push(...migrationResult.lostData)
            result.addedDefaults.push(...migrationResult.addedDefaults)
        } else {
            result.warnings.push(`No specific migration available from ${sourceProps.variant} to ${targetVariant}`)
        }

        result.migratedProps = migratedProps
        result.success = true

    } catch (error) {
        result.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    return result
}

/**
 * Get migration function for specific variant combination
 */
function getMigrationFunction(
    sourceVariant: HeroVariant,
    targetVariant: HeroVariant
): ((source: HeroProps, target: HeroProps, strategy: MigrationStrategy) => {
    warnings: string[]
    lostData: Array<{ property: string; value: any; reason: string }>
    addedDefaults: Array<{ property: string; value: any; reason: string }>
}) | null {
    const migrationKey = `${sourceVariant}_to_${targetVariant}`
    
    const migrations: Record<string, any> = {
        [`${HeroVariant.CENTERED}_to_${HeroVariant.SPLIT_SCREEN}`]: migrateCenteredToSplitScreen,
        [`${HeroVariant.CENTERED}_to_${HeroVariant.MINIMAL}`]: migrateCenteredToMinimal,
        [`${HeroVariant.CENTERED}_to_${HeroVariant.VIDEO}`]: migrateCenteredToVideo,
        [`${HeroVariant.CENTERED}_to_${HeroVariant.FEATURE}`]: migrateCenteredToFeature,
        [`${HeroVariant.CENTERED}_to_${HeroVariant.CTA}`]: migrateCenteredToCTA,
        
        [`${HeroVariant.SPLIT_SCREEN}_to_${HeroVariant.CENTERED}`]: migrateSplitScreenToCentered,
        [`${HeroVariant.SPLIT_SCREEN}_to_${HeroVariant.MINIMAL}`]: migrateSplitScreenToMinimal,
        [`${HeroVariant.SPLIT_SCREEN}_to_${HeroVariant.FEATURE}`]: migrateSplitScreenToFeature,
        
        [`${HeroVariant.VIDEO}_to_${HeroVariant.CENTERED}`]: migrateVideoToCentered,
        [`${HeroVariant.VIDEO}_to_${HeroVariant.SPLIT_SCREEN}`]: migrateVideoToSplitScreen,
        
        [`${HeroVariant.MINIMAL}_to_${HeroVariant.CENTERED}`]: migrateMinimalToCentered,
        [`${HeroVariant.MINIMAL}_to_${HeroVariant.SPLIT_SCREEN}`]: migrateMinimalToSplitScreen,
        
        [`${HeroVariant.FEATURE}_to_${HeroVariant.CENTERED}`]: migrateFeatureToCentered,
        [`${HeroVariant.FEATURE}_to_${HeroVariant.SPLIT_SCREEN}`]: migrateFeatureToSplitScreen,
        
        [`${HeroVariant.TESTIMONIAL}_to_${HeroVariant.CENTERED}`]: migrateTestimonialToCentered,
        [`${HeroVariant.PRODUCT}_to_${HeroVariant.CENTERED}`]: migrateProductToCentered,
        [`${HeroVariant.SERVICE}_to_${HeroVariant.CENTERED}`]: migrateServiceToCentered,
        [`${HeroVariant.CTA}_to_${HeroVariant.CENTERED}`]: migrateCTAToCentered,
        [`${HeroVariant.GALLERY}_to_${HeroVariant.CENTERED}`]: migrateGalleryToCentered
    }

    return migrations[migrationKey] || null
}

/**
 * Migration: Centered to Split Screen
 */
function migrateCenteredToSplitScreen(
    source: HeroCenteredProps,
    target: HeroSplitScreenProps,
    strategy: MigrationStrategy
) {
    const warnings: string[] = []
    const lostData: Array<{ property: string; value: any; reason: string }> = []
    const addedDefaults: Array<{ property: string; value: any; reason: string }> = []

    // Migrate content
    target.content = {
        title: source.title,
        subtitle: source.subtitle,
        description: source.description,
        buttons: []
    }

    // Migrate buttons
    if (source.primaryButton) {
        target.content.buttons.push(source.primaryButton)
    }
    if (source.secondaryButton) {
        target.content.buttons.push(source.secondaryButton)
    }

    // Migrate background
    target.background = source.background

    // Handle text alignment loss
    if (source.textAlign !== 'left') {
        lostData.push({
            property: 'textAlign',
            value: source.textAlign,
            reason: 'Split screen variant uses fixed content alignment'
        })
    }

    // Add default media if strategy preserves media
    if (!strategy.preserveMedia) {
        addedDefaults.push({
            property: 'media',
            value: target.media,
            reason: 'Default media added for split screen layout'
        })
    }

    return { warnings, lostData, addedDefaults }
}

/**
 * Migration: Centered to Minimal
 */
function migrateCenteredToMinimal(
    source: HeroCenteredProps,
    target: HeroMinimalProps,
    strategy: MigrationStrategy
) {
    const warnings: string[] = []
    const lostData: Array<{ property: string; value: any; reason: string }> = []
    const addedDefaults: Array<{ property: string; value: any; reason: string }> = []

    // Migrate basic content
    target.title = source.title
    target.subtitle = source.subtitle
    target.background = source.background

    // Migrate primary button only
    if (source.primaryButton) {
        target.button = source.primaryButton
    }

    // Handle lost data
    if (source.description) {
        lostData.push({
            property: 'description',
            value: source.description,
            reason: 'Minimal variant does not support description'
        })
    }

    if (source.secondaryButton) {
        lostData.push({
            property: 'secondaryButton',
            value: source.secondaryButton,
            reason: 'Minimal variant supports only one button'
        })
    }

    if (source.textAlign !== 'center') {
        lostData.push({
            property: 'textAlign',
            value: source.textAlign,
            reason: 'Minimal variant uses centered alignment'
        })
    }

    return { warnings, lostData, addedDefaults }
}

/**
 * Migration: Centered to Video
 */
function migrateCenteredToVideo(
    source: HeroCenteredProps,
    target: HeroVideoProps,
    strategy: MigrationStrategy
) {
    const warnings: string[] = []
    const lostData: Array<{ property: string; value: any; reason: string }> = []
    const addedDefaults: Array<{ property: string; value: any; reason: string }> = []

    // Migrate content to video overlay
    target.content = {
        title: source.title,
        subtitle: source.subtitle,
        description: source.description,
        buttons: [],
        position: 'center'
    }

    // Migrate buttons
    if (source.primaryButton) {
        target.content.buttons.push(source.primaryButton)
    }
    if (source.secondaryButton) {
        target.content.buttons.push(source.secondaryButton)
    }

    // Handle background migration
    if (source.background.type === 'video' && source.background.video) {
        target.video = source.background.video
    } else {
        addedDefaults.push({
            property: 'video',
            value: target.video,
            reason: 'Default video added as source had no video background'
        })
        
        if (source.background.type !== 'none') {
            lostData.push({
                property: 'background',
                value: source.background,
                reason: 'Non-video background replaced with video'
            })
        }
    }

    return { warnings, lostData, addedDefaults }
}

/**
 * Migration: Centered to Feature
 */
function migrateCenteredToFeature(
    source: HeroCenteredProps,
    target: HeroFeatureProps,
    strategy: MigrationStrategy
) {
    const warnings: string[] = []
    const lostData: Array<{ property: string; value: any; reason: string }> = []
    const addedDefaults: Array<{ property: string; value: any; reason: string }> = []

    // Migrate basic content
    target.title = source.title
    target.subtitle = source.subtitle
    target.description = source.description
    target.background = source.background

    // Migrate primary button
    if (source.primaryButton) {
        target.primaryButton = source.primaryButton
    }

    // Handle secondary button loss
    if (source.secondaryButton) {
        lostData.push({
            property: 'secondaryButton',
            value: source.secondaryButton,
            reason: 'Feature variant supports only primary button'
        })
    }

    // Add default features
    addedDefaults.push({
        property: 'features',
        value: target.features,
        reason: 'Default features added for feature variant'
    })

    return { warnings, lostData, addedDefaults }
}

/**
 * Migration: Centered to CTA
 */
function migrateCenteredToCTA(
    source: HeroCenteredProps,
    target: HeroCTAProps,
    strategy: MigrationStrategy
) {
    const warnings: string[] = []
    const lostData: Array<{ property: string; value: any; reason: string }> = []
    const addedDefaults: Array<{ property: string; value: any; reason: string }> = []

    // Migrate content
    target.title = source.title
    target.subtitle = source.subtitle
    target.description = source.description
    target.background = source.background

    // Migrate buttons
    if (source.primaryButton) {
        target.primaryButton = source.primaryButton
    }
    if (source.secondaryButton) {
        target.secondaryButton = source.secondaryButton
    }

    return { warnings, lostData, addedDefaults }
}

/**
 * Migration: Split Screen to Centered
 */
function migrateSplitScreenToCentered(
    source: HeroSplitScreenProps,
    target: HeroCenteredProps,
    strategy: MigrationStrategy
) {
    const warnings: string[] = []
    const lostData: Array<{ property: string; value: any; reason: string }> = []
    const addedDefaults: Array<{ property: string; value: any; reason: string }> = []

    // Migrate content
    target.title = source.content.title
    target.subtitle = source.content.subtitle
    target.description = source.content.description
    target.background = source.background

    // Migrate buttons
    if (source.content.buttons.length > 0) {
        target.primaryButton = source.content.buttons[0]
    }
    if (source.content.buttons.length > 1) {
        target.secondaryButton = source.content.buttons[1]
    }

    // Handle lost data
    if (source.media) {
        lostData.push({
            property: 'media',
            value: source.media,
            reason: 'Centered variant does not support separate media'
        })
    }

    if (source.layout !== 'left') {
        lostData.push({
            property: 'layout',
            value: source.layout,
            reason: 'Centered variant does not have layout options'
        })
    }

    // Handle extra buttons
    if (source.content.buttons.length > 2) {
        lostData.push({
            property: 'extraButtons',
            value: source.content.buttons.slice(2),
            reason: 'Centered variant supports maximum 2 buttons'
        })
    }

    return { warnings, lostData, addedDefaults }
}

/**
 * Migration: Split Screen to Minimal
 */
function migrateSplitScreenToMinimal(
    source: HeroSplitScreenProps,
    target: HeroMinimalProps,
    strategy: MigrationStrategy
) {
    const warnings: string[] = []
    const lostData: Array<{ property: string; value: any; reason: string }> = []
    const addedDefaults: Array<{ property: string; value: any; reason: string }> = []

    // Migrate basic content
    target.title = source.content.title
    target.subtitle = source.content.subtitle
    target.background = source.background

    // Migrate first button only
    if (source.content.buttons.length > 0) {
        target.button = source.content.buttons[0]
    }

    // Handle lost data
    if (source.content.description) {
        lostData.push({
            property: 'description',
            value: source.content.description,
            reason: 'Minimal variant does not support description'
        })
    }

    if (source.media) {
        lostData.push({
            property: 'media',
            value: source.media,
            reason: 'Minimal variant does not support media'
        })
    }

    if (source.content.buttons.length > 1) {
        lostData.push({
            property: 'extraButtons',
            value: source.content.buttons.slice(1),
            reason: 'Minimal variant supports only one button'
        })
    }

    return { warnings, lostData, addedDefaults }
}

/**
 * Migration: Video to Centered
 */
function migrateVideoToCentered(
    source: HeroVideoProps,
    target: HeroCenteredProps,
    strategy: MigrationStrategy
) {
    const warnings: string[] = []
    const lostData: Array<{ property: string; value: any; reason: string }> = []
    const addedDefaults: Array<{ property: string; value: any; reason: string }> = []

    // Migrate content
    target.title = source.content.title
    target.subtitle = source.content.subtitle
    target.description = source.content.description

    // Migrate buttons
    if (source.content.buttons.length > 0) {
        target.primaryButton = source.content.buttons[0]
    }
    if (source.content.buttons.length > 1) {
        target.secondaryButton = source.content.buttons[1]
    }

    // Handle video to background conversion
    if (strategy.preserveMedia && source.video) {
        target.background = {
            type: 'video',
            video: source.video,
            overlay: source.overlay
        }
    } else {
        lostData.push({
            property: 'video',
            value: source.video,
            reason: 'Video background not preserved in migration'
        })
        
        addedDefaults.push({
            property: 'background',
            value: target.background,
            reason: 'Default background added to replace video'
        })
    }

    if (source.overlay) {
        lostData.push({
            property: 'overlay',
            value: source.overlay,
            reason: 'Overlay settings may not transfer perfectly'
        })
    }

    return { warnings, lostData, addedDefaults }
}

/**
 * Migration: Video to Split Screen
 */
function migrateVideoToSplitScreen(
    source: HeroVideoProps,
    target: HeroSplitScreenProps,
    strategy: MigrationStrategy
) {
    const warnings: string[] = []
    const lostData: Array<{ property: string; value: any; reason: string }> = []
    const addedDefaults: Array<{ property: string; value: any; reason: string }> = []

    // Migrate content
    target.content = {
        title: source.content.title,
        subtitle: source.content.subtitle,
        description: source.content.description,
        buttons: source.content.buttons
    }

    // Handle video to media conversion
    if (strategy.preserveMedia && source.video) {
        target.media = {
            id: source.video.id,
            url: source.video.url,
            type: 'video',
            alt: source.video.alt || 'Video content',
            objectFit: source.video.objectFit || 'cover',
            loading: source.video.loading || 'eager'
        }
    } else {
        lostData.push({
            property: 'video',
            value: source.video,
            reason: 'Video not preserved as media in split screen'
        })
    }

    return { warnings, lostData, addedDefaults }
}

/**
 * Migration: Minimal to Centered
 */
function migrateMinimalToCentered(
    source: HeroMinimalProps,
    target: HeroCenteredProps,
    strategy: MigrationStrategy
) {
    const warnings: string[] = []
    const lostData: Array<{ property: string; value: any; reason: string }> = []
    const addedDefaults: Array<{ property: string; value: any; reason: string }> = []

    // Migrate content
    target.title = source.title
    target.subtitle = source.subtitle
    target.background = source.background

    // Migrate button
    if (source.button) {
        target.primaryButton = source.button
    }

    // Handle spacing loss
    if (source.spacing !== 'normal') {
        lostData.push({
            property: 'spacing',
            value: source.spacing,
            reason: 'Centered variant does not have spacing options'
        })
    }

    return { warnings, lostData, addedDefaults }
}

/**
 * Migration: Minimal to Split Screen
 */
function migrateMinimalToSplitScreen(
    source: HeroMinimalProps,
    target: HeroSplitScreenProps,
    strategy: MigrationStrategy
) {
    const warnings: string[] = []
    const lostData: Array<{ property: string; value: any; reason: string }> = []
    const addedDefaults: Array<{ property: string; value: any; reason: string }> = []

    // Migrate content
    target.content = {
        title: source.title,
        subtitle: source.subtitle,
        description: undefined,
        buttons: source.button ? [source.button] : []
    }

    target.background = source.background

    // Add default media
    addedDefaults.push({
        property: 'media',
        value: target.media,
        reason: 'Default media added for split screen layout'
    })

    return { warnings, lostData, addedDefaults }
}

/**
 * Generic migrations for complex variants to simple ones
 */
function migrateFeatureToCentered(source: HeroFeatureProps, target: HeroCenteredProps, strategy: MigrationStrategy) {
    return migrateComplexToCentered(source, target, 'features')
}

function migrateTestimonialToCentered(source: HeroTestimonialProps, target: HeroCenteredProps, strategy: MigrationStrategy) {
    return migrateComplexToCentered(source, target, 'testimonials')
}

function migrateProductToCentered(source: HeroProductProps, target: HeroCenteredProps, strategy: MigrationStrategy) {
    return migrateComplexToCentered(source, target, 'product')
}

function migrateServiceToCentered(source: HeroServiceProps, target: HeroCenteredProps, strategy: MigrationStrategy) {
    return migrateComplexToCentered(source, target, 'services')
}

function migrateCTAToCentered(source: HeroCTAProps, target: HeroCenteredProps, strategy: MigrationStrategy) {
    return migrateComplexToCentered(source, target, 'benefits')
}

function migrateGalleryToCentered(source: HeroGalleryProps, target: HeroCenteredProps, strategy: MigrationStrategy) {
    return migrateComplexToCentered(source, target, 'gallery')
}

/**
 * Generic migration from complex variants to centered
 */
function migrateComplexToCentered(
    source: any,
    target: HeroCenteredProps,
    complexProperty: string
) {
    const warnings: string[] = []
    const lostData: Array<{ property: string; value: any; reason: string }> = []
    const addedDefaults: Array<{ property: string; value: any; reason: string }> = []

    // Migrate basic content
    target.title = source.title
    target.subtitle = source.subtitle
    target.description = source.description
    target.background = source.background

    // Migrate buttons
    if (source.primaryButton) {
        target.primaryButton = source.primaryButton
    }
    if (source.secondaryButton) {
        target.secondaryButton = source.secondaryButton
    }

    // Handle complex property loss
    if (source[complexProperty]) {
        lostData.push({
            property: complexProperty,
            value: source[complexProperty],
            reason: `Centered variant does not support ${complexProperty}`
        })
    }

    return { warnings, lostData, addedDefaults }
}

/**
 * Migration: Split Screen to Feature
 */
function migrateSplitScreenToFeature(
    source: HeroSplitScreenProps,
    target: HeroFeatureProps,
    strategy: MigrationStrategy
) {
    const warnings: string[] = []
    const lostData: Array<{ property: string; value: any; reason: string }> = []
    const addedDefaults: Array<{ property: string; value: any; reason: string }> = []

    // Migrate content
    target.title = source.content.title
    target.subtitle = source.content.subtitle
    target.description = source.content.description
    target.background = source.background

    // Migrate first button as primary button
    if (source.content.buttons.length > 0) {
        target.primaryButton = source.content.buttons[0]
    }

    // Handle lost data
    if (source.media) {
        lostData.push({
            property: 'media',
            value: source.media,
            reason: 'Feature variant does not support separate media'
        })
    }

    if (source.content.buttons.length > 1) {
        lostData.push({
            property: 'extraButtons',
            value: source.content.buttons.slice(1),
            reason: 'Feature variant supports only one primary button'
        })
    }

    // Add default features
    addedDefaults.push({
        property: 'features',
        value: target.features,
        reason: 'Default features added for feature variant'
    })

    return { warnings, lostData, addedDefaults }
}

/**
 * Generic migration from simple variants to complex ones
 */
function migrateFeatureToSplitScreen(source: HeroFeatureProps, target: HeroSplitScreenProps, strategy: MigrationStrategy) {
    return migrateComplexToSplitScreen(source, target, 'features')
}

function migrateComplexToSplitScreen(
    source: any,
    target: HeroSplitScreenProps,
    complexProperty: string
) {
    const warnings: string[] = []
    const lostData: Array<{ property: string; value: any; reason: string }> = []
    const addedDefaults: Array<{ property: string; value: any; reason: string }> = []

    // Migrate content
    target.content = {
        title: source.title,
        subtitle: source.subtitle,
        description: source.description,
        buttons: source.primaryButton ? [source.primaryButton] : []
    }

    target.background = source.background

    // Handle complex property loss
    if (source[complexProperty]) {
        lostData.push({
            property: complexProperty,
            value: source[complexProperty],
            reason: `Split screen variant does not support ${complexProperty}`
        })
    }

    // Add default media
    addedDefaults.push({
        property: 'media',
        value: target.media,
        reason: 'Default media added for split screen layout'
    })

    return { warnings, lostData, addedDefaults }
}

/**
 * Validate migration compatibility
 */
export function validateMigrationCompatibility(
    sourceVariant: HeroVariant,
    targetVariant: HeroVariant
): {
    isSupported: boolean
    compatibility: 'high' | 'medium' | 'low'
    warnings: string[]
    dataLossRisk: 'none' | 'low' | 'medium' | 'high'
    recommendations: string[]
} {
    // Define compatibility matrix
    const compatibilityMatrix: Record<string, {
        compatibility: 'high' | 'medium' | 'low'
        dataLossRisk: 'none' | 'low' | 'medium' | 'high'
    }> = {
        [`${HeroVariant.CENTERED}_${HeroVariant.SPLIT_SCREEN}`]: { compatibility: 'high', dataLossRisk: 'low' },
        [`${HeroVariant.CENTERED}_${HeroVariant.MINIMAL}`]: { compatibility: 'medium', dataLossRisk: 'medium' },
        [`${HeroVariant.CENTERED}_${HeroVariant.VIDEO}`]: { compatibility: 'medium', dataLossRisk: 'medium' },
        [`${HeroVariant.CENTERED}_${HeroVariant.CTA}`]: { compatibility: 'high', dataLossRisk: 'none' },
        
        [`${HeroVariant.SPLIT_SCREEN}_${HeroVariant.CENTERED}`]: { compatibility: 'high', dataLossRisk: 'low' },
        [`${HeroVariant.SPLIT_SCREEN}_${HeroVariant.MINIMAL}`]: { compatibility: 'medium', dataLossRisk: 'high' },
        
        [`${HeroVariant.VIDEO}_${HeroVariant.CENTERED}`]: { compatibility: 'medium', dataLossRisk: 'medium' },
        [`${HeroVariant.VIDEO}_${HeroVariant.SPLIT_SCREEN}`]: { compatibility: 'medium', dataLossRisk: 'low' },
        
        [`${HeroVariant.MINIMAL}_${HeroVariant.CENTERED}`]: { compatibility: 'high', dataLossRisk: 'none' },
        [`${HeroVariant.MINIMAL}_${HeroVariant.SPLIT_SCREEN}`]: { compatibility: 'medium', dataLossRisk: 'low' }
    }

    const key = `${sourceVariant}_${targetVariant}`
    const compatibility = compatibilityMatrix[key] || { compatibility: 'low', dataLossRisk: 'high' }

    const warnings: string[] = []
    const recommendations: string[] = []

    // Add warnings based on compatibility
    if (compatibility.compatibility === 'low') {
        warnings.push('Low compatibility between variants - significant changes expected')
    }
    if (compatibility.dataLossRisk === 'high') {
        warnings.push('High risk of data loss during migration')
    }

    // Add recommendations
    if (compatibility.dataLossRisk !== 'none') {
        recommendations.push('Review migrated content carefully')
        recommendations.push('Consider duplicating the section before migration')
    }
    if (compatibility.compatibility === 'low') {
        recommendations.push('Consider manual recreation for better results')
    }

    return {
        isSupported: getMigrationFunction(sourceVariant, targetVariant) !== null,
        compatibility: compatibility.compatibility,
        warnings,
        dataLossRisk: compatibility.dataLossRisk,
        recommendations
    }
}

/**
 * Get migration preview without actually performing the migration
 */
export function getMigrationPreview(
    sourceProps: HeroProps,
    targetVariant: HeroVariant,
    strategy: MigrationStrategy = MIGRATION_STRATEGIES.balanced
): {
    willMigrate: string[]
    willLose: string[]
    willAdd: string[]
    warnings: string[]
} {
    const result = migrateHeroSection(sourceProps, targetVariant, strategy)
    
    return {
        willMigrate: Object.keys(sourceProps).filter(key => 
            key in result.migratedProps && 
            !['id', 'variant'].includes(key)
        ),
        willLose: result.lostData.map(item => item.property),
        willAdd: result.addedDefaults.map(item => item.property),
        warnings: result.warnings
    }
}