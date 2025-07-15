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

// Core section configurations
export const SECTION_REGISTRY: Record<string, SectionConfig> = {
    'hero-section': {
        id: 'hero-section',
        name: 'Hero Section',
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
        tags: ['hero', 'banner', 'landing', 'cta'],
        isActive: true,
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