// Section Registry - Central management for all sections
export interface SectionConfig {
    id: string
    name: string
    componentName: string
    category: string
    description: string
    icon: string
    defaultProps: any
    editorComponent?: string
    previewComponent?: string
    tags: string[]
    isActive: boolean
    version: string
    variant?: string // For hero sections and other variants
    themeCompatibility?: any
    responsiveSupport?: any
}

// Import hero section configurations
import { HERO_SECTION_REGISTRY } from './hero/registry'
import type { HeroSectionConfig } from './hero/types'

// Convert hero section config to main registry format
function convertHeroConfigToSectionConfig(heroConfig: HeroSectionConfig): SectionConfig {
    return {
        id: heroConfig.id,
        name: heroConfig.name,
        componentName: `Hero${heroConfig.variant.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join('')}`,
        category: heroConfig.category,
        description: heroConfig.description,
        icon: heroConfig.icon,
        defaultProps: heroConfig.defaultProps,
        editorComponent: heroConfig.editorComponent,
        previewComponent: heroConfig.previewComponent,
        tags: heroConfig.tags,
        isActive: heroConfig.isActive,
        version: heroConfig.version,
        variant: heroConfig.variant,
        themeCompatibility: heroConfig.themeCompatibility,
        responsiveSupport: heroConfig.responsiveSupport
    }
}

// Section Categories
export const SECTION_CATEGORIES = {
    HERO: 'Hero',
    CONTENT: 'Content',
    LAYOUT: 'Layout',
    MEDIA: 'Media',
    FORMS: 'Forms',
    NAVIGATION: 'Navigation',
    FOOTER: 'Footer',
    ECOMMERCE: 'E-commerce',
    TESTIMONIALS: 'Testimonials',
    PRICING: 'Pricing',
    TEAM: 'Team',
    FEATURES: 'Features',
    CTA: 'Call to Action',
    GALLERY: 'Gallery',
    BLOG: 'Blog',
    CONTACT: 'Contact',
    SOCIAL: 'Social Media',
    STATS: 'Statistics',
    FAQ: 'FAQ',
    TIMELINE: 'Timeline'
} as const

// Generate hero section configurations from hero registry
const HERO_SECTIONS: Record<string, SectionConfig> = Object.values(HERO_SECTION_REGISTRY)
    .filter(heroConfig => heroConfig.isActive) // Only include active hero variants
    .reduce((acc, heroConfig) => {
        acc[heroConfig.id] = convertHeroConfigToSectionConfig(heroConfig)
        return acc
    }, {} as Record<string, SectionConfig>)

// Core section configurations
export const SECTION_REGISTRY: Record<string, SectionConfig> = {
    // Include all hero variants
    ...HERO_SECTIONS,

    // Legacy hero section (keeping for backward compatibility)
    'hero-section': {
        id: 'hero-section',
        name: 'Hero Section (Legacy)',
        componentName: 'HeroSection',
        category: SECTION_CATEGORIES.HERO,
        description: 'A hero section with title, subtitle, and call-to-action button',
        icon: '🎯',
        defaultProps: {
            title: 'Welcome to Your Website',
            subtitle: 'Build amazing experiences with our platform',
            buttonText: 'Get Started',
            buttonLink: '#',
            backgroundImage: '',
            textAlign: 'center'
        },
        editorComponent: 'HeroSectionEditor',
        previewComponent: 'HeroSectionPreview',
        tags: ['hero', 'banner', 'landing', 'cta', 'legacy'],
        isActive: false, // Disabled in favor of new variants
        version: '1.0.0'
    },

    'text-block': {
        id: 'text-block',
        name: 'Text Block',
        componentName: 'TextBlock',
        category: SECTION_CATEGORIES.CONTENT,
        description: 'A simple text block with rich text editing',
        icon: '📝',
        defaultProps: {
            content: '<p>Add your content here...</p>',
            textAlign: 'left',
            maxWidth: '800px'
        },
        editorComponent: 'TextBlockEditor',
        previewComponent: 'TextBlockPreview',
        tags: ['text', 'content', 'paragraph', 'rich-text'],
        isActive: true,
        version: '1.0.0'
    },

    'image-text': {
        id: 'image-text',
        name: 'Image & Text',
        componentName: 'ImageText',
        category: SECTION_CATEGORIES.CONTENT,
        description: 'Image with text content side by side',
        icon: '🖼️',
        defaultProps: {
            image: '',
            imageAlt: '',
            title: 'Your Title Here',
            content: '<p>Your content here...</p>',
            layout: 'left',
            imageWidth: '50%'
        },
        editorComponent: 'ImageTextEditor',
        previewComponent: 'ImageTextPreview',
        tags: ['image', 'text', 'media', 'layout'],
        isActive: true,
        version: '1.0.0'
    },

    // Placeholder for future sections
    'feature-grid': {
        id: 'feature-grid',
        name: 'Feature Grid',
        componentName: 'FeatureGrid',
        category: SECTION_CATEGORIES.FEATURES,
        description: 'Grid layout showcasing features with icons and descriptions',
        icon: '⚡',
        defaultProps: {
            title: 'Our Features',
            subtitle: 'Everything you need to succeed',
            features: [
                { icon: '🚀', title: 'Fast Performance', description: 'Lightning-fast loading times' },
                { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security' },
                { icon: '📱', title: 'Responsive', description: 'Works on all devices' }
            ],
            columns: 3
        },
        editorComponent: 'FeatureGridEditor',
        previewComponent: 'FeatureGridPreview',
        tags: ['features', 'grid', 'icons', 'benefits'],
        isActive: false, // Not implemented yet
        version: '1.0.0'
    },

    'testimonial-carousel': {
        id: 'testimonial-carousel',
        name: 'Testimonial Carousel',
        componentName: 'TestimonialCarousel',
        category: SECTION_CATEGORIES.TESTIMONIALS,
        description: 'Rotating testimonials from customers',
        icon: '💬',
        defaultProps: {
            title: 'What Our Customers Say',
            testimonials: [
                { name: 'John Doe', company: 'Acme Corp', content: 'Amazing product!', avatar: '' }
            ],
            autoPlay: true,
            showDots: true
        },
        editorComponent: 'TestimonialCarouselEditor',
        previewComponent: 'TestimonialCarouselPreview',
        tags: ['testimonials', 'carousel', 'reviews', 'social-proof'],
        isActive: false, // Not implemented yet
        version: '1.0.0'
    },

    'pricing-table': {
        id: 'pricing-table',
        name: 'Pricing Table',
        componentName: 'PricingTable',
        category: SECTION_CATEGORIES.PRICING,
        description: 'Pricing plans comparison table',
        icon: '💰',
        defaultProps: {
            title: 'Choose Your Plan',
            subtitle: 'Select the perfect plan for your needs',
            plans: [
                { name: 'Basic', price: '$9', period: 'month', features: ['Feature 1', 'Feature 2'] },
                { name: 'Pro', price: '$19', period: 'month', features: ['Feature 1', 'Feature 2', 'Feature 3'] }
            ]
        },
        editorComponent: 'PricingTableEditor',
        previewComponent: 'PricingTablePreview',
        tags: ['pricing', 'plans', 'table', 'comparison'],
        isActive: false, // Not implemented yet
        version: '1.0.0'
    }
}

// Helper functions
export function getSectionConfig(sectionId: string): SectionConfig | undefined {
    return SECTION_REGISTRY[sectionId]
}

export function getActiveSections(): SectionConfig[] {
    return Object.values(SECTION_REGISTRY).filter(section => section.isActive)
}

export function getSectionsByCategory(category: string): SectionConfig[] {
    return Object.values(SECTION_REGISTRY).filter(section =>
        section.category === category && section.isActive
    )
}

export function searchSections(query: string): SectionConfig[] {
    const lowercaseQuery = query.toLowerCase()
    return Object.values(SECTION_REGISTRY).filter(section =>
        section.isActive && (
            section.name.toLowerCase().includes(lowercaseQuery) ||
            section.description.toLowerCase().includes(lowercaseQuery) ||
            section.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        )
    )
}

export function getAllCategories(): string[] {
    return Object.values(SECTION_CATEGORIES)
}

export function getSectionCount(): number {
    return Object.keys(SECTION_REGISTRY).length
}

export function getActiveSectionCount(): number {
    return getActiveSections().length
}

// Hero section specific helper functions
export function getHeroSections(): SectionConfig[] {
    return Object.values(SECTION_REGISTRY).filter(section =>
        section.category === SECTION_CATEGORIES.HERO && section.isActive
    )
}

export function getHeroSectionsByTag(tag: string): SectionConfig[] {
    return getHeroSections().filter(section =>
        section.tags.includes(tag)
    )
}

export function getHeroVariants(): string[] {
    return getHeroSections()
        .filter(section => section.variant)
        .map(section => section.variant!)
}

export function isHeroSection(sectionId: string): boolean {
    const config = getSectionConfig(sectionId)
    return config?.category === SECTION_CATEGORIES.HERO
}

export function getHeroSectionConfig(variant: string): SectionConfig | undefined {
    return Object.values(SECTION_REGISTRY).find(section =>
        section.category === SECTION_CATEGORIES.HERO && section.variant === variant
    )
}

// Enhanced search with hero section support
export function searchHeroSections(query: string): SectionConfig[] {
    const lowercaseQuery = query.toLowerCase()
    return getHeroSections().filter(section =>
        section.name.toLowerCase().includes(lowercaseQuery) ||
        section.description.toLowerCase().includes(lowercaseQuery) ||
        section.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        (section.variant && section.variant.toLowerCase().includes(lowercaseQuery))
    )
}

// Migration utilities for existing hero sections
export interface HeroSectionMigration {
    fromSectionId: string
    toSectionId: string
    propertyMapping: Record<string, string>
    transformFunction?: (oldProps: any) => any
}

export const HERO_MIGRATION_MAP: HeroSectionMigration[] = [
    {
        fromSectionId: 'hero-section',
        toSectionId: 'hero-centered',
        propertyMapping: {
            'title': 'title.text',
            'subtitle': 'subtitle.text',
            'buttonText': 'primaryButton.text',
            'buttonLink': 'primaryButton.url',
            'backgroundImage': 'background.image.url',
            'textAlign': 'textAlign'
        },
        transformFunction: (oldProps: any) => {
            return {
                title: {
                    text: oldProps.title || 'Welcome to Your Website',
                    tag: 'h1'
                },
                subtitle: {
                    text: oldProps.subtitle || '',
                    tag: 'p'
                },
                primaryButton: oldProps.buttonText ? {
                    text: oldProps.buttonText,
                    url: oldProps.buttonLink || '#',
                    style: 'primary',
                    size: 'lg',
                    iconPosition: 'right',
                    target: '_self'
                } : undefined,
                background: oldProps.backgroundImage ? {
                    type: 'image',
                    image: {
                        id: 'hero-bg',
                        url: oldProps.backgroundImage,
                        type: 'image',
                        alt: 'Hero background',
                        objectFit: 'cover',
                        loading: 'eager'
                    }
                } : {
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
        }
    },
    // Additional migration paths for different legacy formats
    {
        fromSectionId: 'legacy-hero',
        toSectionId: 'hero-minimal',
        propertyMapping: {
            'headline': 'title.text',
            'tagline': 'subtitle.text',
            'cta': 'button.text',
            'ctaLink': 'button.url'
        },
        transformFunction: (oldProps: any) => {
            return {
                title: {
                    text: oldProps.headline || 'Simple. Elegant. Effective.',
                    tag: 'h1'
                },
                subtitle: oldProps.tagline ? {
                    text: oldProps.tagline,
                    tag: 'h2'
                } : undefined,
                button: oldProps.cta ? {
                    text: oldProps.cta,
                    url: oldProps.ctaLink || '#',
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
        }
    }
]

export function migrateHeroSection(fromSectionId: string, oldProps: any): { sectionId: string; props: any } | null {
    const migration = HERO_MIGRATION_MAP.find(m => m.fromSectionId === fromSectionId)
    if (!migration) return null

    const newProps = migration.transformFunction ? 
        migration.transformFunction(oldProps) : 
        transformPropsWithMapping(oldProps, migration.propertyMapping)

    return {
        sectionId: migration.toSectionId,
        props: newProps
    }
}

function transformPropsWithMapping(oldProps: any, mapping: Record<string, string>): any {
    const newProps: any = {}
    
    for (const [oldKey, newKey] of Object.entries(mapping)) {
        if (oldProps[oldKey] !== undefined) {
            setNestedProperty(newProps, newKey, oldProps[oldKey])
        }
    }
    
    return newProps
}

function setNestedProperty(obj: any, path: string, value: any): void {
    const keys = path.split('.')
    let current = obj
    
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (!(key in current)) {
            current[key] = {}
        }
        current = current[key]
    }
    
    current[keys[keys.length - 1]] = value
}

// Additional utility functions for hero section management
export function getAllHeroVariantIds(): string[] {
    return getHeroSections().map(section => section.id)
}

export function getHeroSectionsByCategory(categoryTag: string): SectionConfig[] {
    const categoryMap: Record<string, string[]> = {
        'traditional': ['centered', 'traditional'],
        'modern': ['split-screen', 'modern', 'video'],
        'multimedia': ['video', 'gallery', 'multimedia'],
        'minimal': ['minimal', 'clean'],
        'business': ['service', 'business', 'professional'],
        'e-commerce': ['product', 'e-commerce', 'gallery'],
        'cta': ['cta', 'conversion'],
        'testimonial': ['testimonial', 'social-proof'],
        'features': ['feature', 'features', 'benefits']
    }
    
    const tags = categoryMap[categoryTag] || [categoryTag]
    return getHeroSections().filter(section =>
        tags.some(tag => section.tags.includes(tag))
    )
}

export function validateHeroSectionIntegration(): {
    isValid: boolean
    errors: string[]
    warnings: string[]
    stats: {
        totalHeroVariants: number
        activeHeroVariants: number
        registeredVariants: string[]
    }
} {
    const errors: string[] = []
    const warnings: string[] = []
    
    // Check if all expected hero variants are present
    const expectedVariants = [
        'hero-centered', 'hero-split-screen', 'hero-video', 'hero-minimal',
        'hero-feature', 'hero-testimonial', 'hero-service', 'hero-product',
        'hero-gallery', 'hero-cta'
    ]
    
    const registeredVariants = getAllHeroVariantIds()
    const missingVariants = expectedVariants.filter(variant => !registeredVariants.includes(variant))
    
    if (missingVariants.length > 0) {
        errors.push(`Missing hero variants: ${missingVariants.join(', ')}`)
    }
    
    // Check if all hero sections are properly configured
    const heroSections = getHeroSections()
    heroSections.forEach(section => {
        if (!section.variant) {
            warnings.push(`Hero section ${section.id} is missing variant property`)
        }
        
        if (!section.editorComponent) {
            warnings.push(`Hero section ${section.id} is missing editor component`)
        }
        
        if (!section.previewComponent) {
            warnings.push(`Hero section ${section.id} is missing preview component`)
        }
        
        if (section.tags.length === 0) {
            warnings.push(`Hero section ${section.id} has no tags`)
        }
    })
    
    // Check migration mappings
    const migrationSources = HERO_MIGRATION_MAP.map(m => m.fromSectionId)
    if (!migrationSources.includes('hero-section')) {
        warnings.push('No migration mapping found for legacy hero-section')
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        stats: {
            totalHeroVariants: expectedVariants.length,
            activeHeroVariants: heroSections.length,
            registeredVariants
        }
    }
}