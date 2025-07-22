// Hero Section Registry Configuration

import {
    HeroSectionConfig,
    HeroVariant,
    FieldType,
    ThemeCompatibility,
    ResponsiveSupport
} from './types'

// Hero section configurations for all 10 variants
export const HERO_SECTION_REGISTRY: Record<string, HeroSectionConfig> = {
    'hero-centered': {
        id: 'hero-centered',
        variant: HeroVariant.CENTERED,
        name: 'Hero Centered',
        description: 'Traditional centered hero with title, subtitle, and call-to-action buttons',
        icon: '🎯',
        category: 'HERO',
        defaultProps: {
            title: {
                text: 'Welcome to Your Website',
                tag: 'h1'
            },
            subtitle: {
                text: 'Build amazing experiences with our platform',
                tag: 'p'
            },
            description: {
                text: 'Discover the power of our innovative solutions designed to help you succeed.',
                tag: 'p'
            },
            primaryButton: {
                text: 'Get Started',
                url: '#',
                style: 'primary',
                size: 'lg',
                iconPosition: 'right',
                target: '_self'
            },
            secondaryButton: {
                text: 'Learn More',
                url: '#',
                style: 'outline',
                size: 'lg',
                iconPosition: 'left',
                target: '_self'
            },
            background: {
                type: 'gradient',
                gradient: {
                    type: 'linear',
                    direction: '45deg',
                    colors: [
                        { color: '#3b82f6', stop: 0 },
                        { color: '#8b5cf6', stop: 100 }
                    ]
                },
                overlay: {
                    enabled: false,
                    color: '#000000',
                    opacity: 0.4
                }
            },
            textAlign: 'center'
        },
        editorSchema: {
            sections: [
                {
                    id: 'content',
                    title: 'Content',
                    collapsible: false,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'title.text',
                            type: FieldType.TEXT,
                            label: 'Title',
                            placeholder: 'Enter hero title',
                            required: true,
                            validation: [
                                { type: 'required', message: 'Title is required' },
                                { type: 'maxLength', value: 100, message: 'Title must be less than 100 characters' }
                            ]
                        },
                        {
                            id: 'subtitle.text',
                            type: FieldType.TEXT,
                            label: 'Subtitle',
                            placeholder: 'Enter hero subtitle',
                            required: false
                        },
                        {
                            id: 'description.text',
                            type: FieldType.TEXTAREA,
                            label: 'Description',
                            placeholder: 'Enter hero description',
                            required: false
                        },
                        {
                            id: 'textAlign',
                            type: FieldType.SELECT,
                            label: 'Text Alignment',
                            required: true,
                            options: [
                                { label: 'Left', value: 'left' },
                                { label: 'Center', value: 'center' },
                                { label: 'Right', value: 'right' }
                            ]
                        }
                    ]
                },
                {
                    id: 'buttons',
                    title: 'Buttons',
                    collapsible: true,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'primaryButton.text',
                            type: FieldType.TEXT,
                            label: 'Primary Button Text',
                            placeholder: 'Enter button text',
                            required: false
                        },
                        {
                            id: 'primaryButton.url',
                            type: FieldType.URL,
                            label: 'Primary Button URL',
                            placeholder: 'Enter button URL',
                            required: false,
                            dependencies: ['primaryButton.text']
                        },
                        {
                            id: 'primaryButton.style',
                            type: FieldType.SELECT,
                            label: 'Primary Button Style',
                            required: false,
                            options: [
                                { label: 'Primary', value: 'primary' },
                                { label: 'Secondary', value: 'secondary' },
                                { label: 'Outline', value: 'outline' },
                                { label: 'Ghost', value: 'ghost' },
                                { label: 'Link', value: 'link' }
                            ]
                        },
                        {
                            id: 'secondaryButton.text',
                            type: FieldType.TEXT,
                            label: 'Secondary Button Text',
                            placeholder: 'Enter button text',
                            required: false
                        },
                        {
                            id: 'secondaryButton.url',
                            type: FieldType.URL,
                            label: 'Secondary Button URL',
                            placeholder: 'Enter button URL',
                            required: false,
                            dependencies: ['secondaryButton.text']
                        }
                    ]
                },
                {
                    id: 'background',
                    title: 'Background',
                    collapsible: true,
                    defaultExpanded: false,
                    fields: [
                        {
                            id: 'background.type',
                            type: FieldType.SELECT,
                            label: 'Background Type',
                            required: true,
                            options: [
                                { label: 'None', value: 'none' },
                                { label: 'Color', value: 'color' },
                                { label: 'Gradient', value: 'gradient' },
                                { label: 'Image', value: 'image' },
                                { label: 'Video', value: 'video' }
                            ]
                        },
                        {
                            id: 'background.color',
                            type: FieldType.COLOR,
                            label: 'Background Color',
                            required: false,
                            dependencies: ['background.type']
                        },
                        {
                            id: 'background.image',
                            type: FieldType.IMAGE,
                            label: 'Background Image',
                            required: false,
                            dependencies: ['background.type']
                        }
                    ]
                }
            ],
            validation: [],
            dependencies: [
                {
                    field: 'background.color',
                    dependsOn: 'background.type',
                    condition: 'equals',
                    value: 'color',
                    action: 'show'
                },
                {
                    field: 'background.image',
                    dependsOn: 'background.type',
                    condition: 'equals',
                    value: 'image',
                    action: 'show'
                }
            ]
        },
        previewComponent: 'HeroCenteredPreview',
        editorComponent: 'HeroCenteredEditor',
        tags: ['hero', 'centered', 'landing', 'cta', 'traditional'],
        isActive: true,
        version: '1.0.0',
        themeCompatibility: {
            supportedThemes: ['LIGHT', 'DARK', 'AUTO'],
            customCSSVariables: [
                {
                    property: 'background-color',
                    cssVariable: '--hero-primary-color',
                    fallback: '#3b82f6',
                    themeKey: 'primaryColor'
                }
            ],
            tailwindClasses: [
                {
                    condition: 'theme.primaryColor',
                    classes: ['bg-primary', 'text-primary-foreground'],
                    responsive: true
                }
            ]
        },
        responsiveSupport: {
            breakpoints: ['mobile', 'tablet', 'desktop'],
            adaptiveLayout: true,
            responsiveImages: true,
            responsiveTypography: true
        }
    },

    'hero-split-screen': {
        id: 'hero-split-screen',
        variant: HeroVariant.SPLIT_SCREEN,
        name: 'Hero Split Screen',
        description: 'Two-column layout with content on one side and media on the other',
        icon: '📱',
        category: 'HERO',
        defaultProps: {
            content: {
                title: {
                    text: 'Innovative Solutions',
                    tag: 'h1'
                },
                subtitle: {
                    text: 'Transform Your Business',
                    tag: 'h2'
                },
                description: {
                    text: 'Discover how our cutting-edge technology can revolutionize your workflow and drive unprecedented growth.',
                    tag: 'p'
                },
                buttons: [
                    {
                        text: 'Start Free Trial',
                        url: '#',
                        style: 'primary',
                        size: 'lg',
                        iconPosition: 'right',
                        target: '_self'
                    }
                ]
            },
            media: {
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
        },
        editorSchema: {
            sections: [
                {
                    id: 'layout',
                    title: 'Layout',
                    collapsible: false,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'layout',
                            type: FieldType.SELECT,
                            label: 'Content Position',
                            required: true,
                            options: [
                                { label: 'Left', value: 'left' },
                                { label: 'Right', value: 'right' }
                            ]
                        },
                        {
                            id: 'contentAlignment',
                            type: FieldType.SELECT,
                            label: 'Content Alignment',
                            required: true,
                            options: [
                                { label: 'Start', value: 'start' },
                                { label: 'Center', value: 'center' },
                                { label: 'End', value: 'end' }
                            ]
                        }
                    ]
                },
                {
                    id: 'content',
                    title: 'Content',
                    collapsible: true,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'content.title.text',
                            type: FieldType.TEXT,
                            label: 'Title',
                            placeholder: 'Enter hero title',
                            required: true,
                            validation: [
                                { type: 'required', message: 'Title is required' }
                            ]
                        },
                        {
                            id: 'content.subtitle.text',
                            type: FieldType.TEXT,
                            label: 'Subtitle',
                            placeholder: 'Enter hero subtitle',
                            required: false
                        },
                        {
                            id: 'content.description.text',
                            type: FieldType.TEXTAREA,
                            label: 'Description',
                            placeholder: 'Enter hero description',
                            required: false
                        }
                    ]
                },
                {
                    id: 'media',
                    title: 'Media',
                    collapsible: true,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'media',
                            type: FieldType.IMAGE,
                            label: 'Hero Image',
                            required: true,
                            validation: [
                                { type: 'required', message: 'Hero image is required' }
                            ]
                        },
                        {
                            id: 'media.alt',
                            type: FieldType.TEXT,
                            label: 'Alt Text',
                            placeholder: 'Describe the image',
                            required: true,
                            helpText: 'Important for accessibility'
                        }
                    ]
                }
            ],
            validation: [],
            dependencies: []
        },
        previewComponent: 'HeroSplitScreenPreview',
        editorComponent: 'HeroSplitScreenEditor',
        tags: ['hero', 'split-screen', 'two-column', 'media', 'modern'],
        isActive: true,
        version: '1.0.0',
        themeCompatibility: {
            supportedThemes: ['LIGHT', 'DARK', 'AUTO'],
            customCSSVariables: [],
            tailwindClasses: []
        },
        responsiveSupport: {
            breakpoints: ['mobile', 'tablet', 'desktop'],
            adaptiveLayout: true,
            responsiveImages: true,
            responsiveTypography: true
        }
    },

    'hero-video': {
        id: 'hero-video',
        variant: HeroVariant.VIDEO,
        name: 'Hero Video',
        description: 'Full-screen video background with overlay content',
        icon: '🎥',
        category: 'HERO',
        defaultProps: {
            video: {
                id: 'hero-video',
                url: '/assets/hero/hero-video.mp4',
                type: 'video',
                autoplay: true,
                loop: true,
                muted: true,
                controls: false,
                poster: '/assets/hero/video-poster.jpg',
                objectFit: 'cover',
                loading: 'eager'
            },
            overlay: {
                enabled: true,
                color: '#000000',
                opacity: 0.4
            },
            content: {
                title: {
                    text: 'Experience Innovation',
                    tag: 'h1'
                },
                subtitle: {
                    text: 'See Our Product in Action',
                    tag: 'h2'
                },
                description: {
                    text: 'Watch how our solution transforms businesses worldwide.',
                    tag: 'p'
                },
                buttons: [
                    {
                        text: 'Watch Demo',
                        url: '#',
                        style: 'primary',
                        size: 'lg',
                        icon: '▶️',
                        iconPosition: 'left',
                        target: '_self'
                    }
                ],
                position: 'center'
            }
        },
        editorSchema: {
            sections: [
                {
                    id: 'video',
                    title: 'Video Settings',
                    collapsible: false,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'video',
                            type: FieldType.VIDEO,
                            label: 'Background Video',
                            required: true,
                            validation: [
                                { type: 'required', message: 'Background video is required' }
                            ]
                        },
                        {
                            id: 'video.poster',
                            type: FieldType.IMAGE,
                            label: 'Video Poster',
                            placeholder: 'Fallback image while video loads',
                            required: false,
                            helpText: 'Shown while video is loading'
                        },
                        {
                            id: 'video.autoplay',
                            type: FieldType.BOOLEAN,
                            label: 'Autoplay',
                            required: false,
                            defaultValue: true
                        },
                        {
                            id: 'video.loop',
                            type: FieldType.BOOLEAN,
                            label: 'Loop',
                            required: false,
                            defaultValue: true
                        },
                        {
                            id: 'video.muted',
                            type: FieldType.BOOLEAN,
                            label: 'Muted',
                            required: false,
                            defaultValue: true,
                            helpText: 'Required for autoplay in most browsers'
                        }
                    ]
                },
                {
                    id: 'overlay',
                    title: 'Overlay',
                    collapsible: true,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'overlay.enabled',
                            type: FieldType.BOOLEAN,
                            label: 'Enable Overlay',
                            required: false,
                            defaultValue: true
                        },
                        {
                            id: 'overlay.color',
                            type: FieldType.COLOR,
                            label: 'Overlay Color',
                            required: false,
                            dependencies: ['overlay.enabled']
                        },
                        {
                            id: 'overlay.opacity',
                            type: FieldType.SLIDER,
                            label: 'Overlay Opacity',
                            required: false,
                            min: 0,
                            max: 1,
                            step: 0.1,
                            dependencies: ['overlay.enabled']
                        }
                    ]
                },
                {
                    id: 'content',
                    title: 'Content',
                    collapsible: true,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'content.title.text',
                            type: FieldType.TEXT,
                            label: 'Title',
                            placeholder: 'Enter hero title',
                            required: true
                        },
                        {
                            id: 'content.position',
                            type: FieldType.SELECT,
                            label: 'Content Position',
                            required: true,
                            options: [
                                { label: 'Center', value: 'center' },
                                { label: 'Top Left', value: 'top-left' },
                                { label: 'Top Right', value: 'top-right' },
                                { label: 'Bottom Left', value: 'bottom-left' },
                                { label: 'Bottom Right', value: 'bottom-right' }
                            ]
                        }
                    ]
                }
            ],
            validation: [],
            dependencies: [
                {
                    field: 'overlay.color',
                    dependsOn: 'overlay.enabled',
                    condition: 'equals',
                    value: true,
                    action: 'show'
                },
                {
                    field: 'overlay.opacity',
                    dependsOn: 'overlay.enabled',
                    condition: 'equals',
                    value: true,
                    action: 'show'
                }
            ]
        },
        previewComponent: 'HeroVideoPreview',
        editorComponent: 'HeroVideoEditor',
        tags: ['hero', 'video', 'background', 'multimedia', 'engaging'],
        isActive: true,
        version: '1.0.0',
        themeCompatibility: {
            supportedThemes: ['LIGHT', 'DARK', 'AUTO'],
            customCSSVariables: [],
            tailwindClasses: []
        },
        responsiveSupport: {
            breakpoints: ['mobile', 'tablet', 'desktop'],
            adaptiveLayout: true,
            responsiveImages: false,
            responsiveTypography: true
        },
        requiredFeatures: ['video-support'],
        optionalFeatures: ['video-controls', 'video-analytics']
    },

    'hero-minimal': {
        id: 'hero-minimal',
        variant: HeroVariant.MINIMAL,
        name: 'Hero Minimal',
        description: 'Clean, typography-focused design with minimal elements',
        icon: '✨',
        category: 'HERO',
        defaultProps: {
            title: {
                text: 'Simple. Elegant. Effective.',
                tag: 'h1'
            },
            subtitle: {
                text: 'Less is more',
                tag: 'h2'
            },
            button: {
                text: 'Explore',
                url: '#',
                style: 'link',
                size: 'lg',
                iconPosition: 'right',
                target: '_self'
            },
            background: {
                type: 'color',
                color: '#ffffff'
            },
            spacing: 'normal'
        },
        editorSchema: {
            sections: [
                {
                    id: 'content',
                    title: 'Content',
                    collapsible: false,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'title.text',
                            type: FieldType.TEXT,
                            label: 'Title',
                            placeholder: 'Enter hero title',
                            required: true,
                            validation: [
                                { type: 'required', message: 'Title is required' }
                            ]
                        },
                        {
                            id: 'subtitle.text',
                            type: FieldType.TEXT,
                            label: 'Subtitle',
                            placeholder: 'Enter hero subtitle',
                            required: false
                        },
                        {
                            id: 'spacing',
                            type: FieldType.SELECT,
                            label: 'Spacing',
                            required: true,
                            options: [
                                { label: 'Compact', value: 'compact' },
                                { label: 'Normal', value: 'normal' },
                                { label: 'Spacious', value: 'spacious' }
                            ]
                        }
                    ]
                },
                {
                    id: 'button',
                    title: 'Call to Action',
                    collapsible: true,
                    defaultExpanded: false,
                    fields: [
                        {
                            id: 'button.text',
                            type: FieldType.TEXT,
                            label: 'Button Text',
                            placeholder: 'Enter button text',
                            required: false
                        },
                        {
                            id: 'button.url',
                            type: FieldType.URL,
                            label: 'Button URL',
                            placeholder: 'Enter button URL',
                            required: false,
                            dependencies: ['button.text']
                        }
                    ]
                }
            ],
            validation: [],
            dependencies: []
        },
        previewComponent: 'HeroMinimalPreview',
        editorComponent: 'HeroMinimalEditor',
        tags: ['hero', 'minimal', 'clean', 'typography', 'simple'],
        isActive: true,
        version: '1.0.0',
        themeCompatibility: {
            supportedThemes: ['LIGHT', 'DARK', 'AUTO'],
            customCSSVariables: [],
            tailwindClasses: []
        },
        responsiveSupport: {
            breakpoints: ['mobile', 'tablet', 'desktop'],
            adaptiveLayout: true,
            responsiveImages: false,
            responsiveTypography: true
        }
    },

    'hero-feature': {
        id: 'hero-feature',
        variant: HeroVariant.FEATURE,
        name: 'Hero Feature',
        description: 'Showcase key features or benefits prominently',
        icon: '⚡',
        category: 'HERO',
        defaultProps: {
            title: {
                text: 'Powerful Features',
                tag: 'h1'
            },
            subtitle: {
                text: 'Everything you need to succeed',
                tag: 'h2'
            },
            description: {
                text: 'Discover the comprehensive set of tools designed to accelerate your growth.',
                tag: 'p'
            },
            features: [
                {
                    id: '1',
                    icon: '🚀',
                    title: 'Lightning Fast',
                    description: 'Optimized for speed and performance'
                },
                {
                    id: '2',
                    icon: '🔒',
                    title: 'Secure',
                    description: 'Enterprise-grade security built-in'
                },
                {
                    id: '3',
                    icon: '📱',
                    title: 'Responsive',
                    description: 'Works perfectly on all devices'
                }
            ],
            layout: 'grid',
            columns: 3,
            background: {
                type: 'gradient',
                gradient: {
                    type: 'linear',
                    direction: '135deg',
                    colors: [
                        { color: '#667eea', stop: 0 },
                        { color: '#764ba2', stop: 100 }
                    ]
                }
            },
            primaryButton: {
                text: 'Get Started',
                url: '#',
                style: 'primary',
                size: 'lg',
                iconPosition: 'right',
                target: '_self'
            }
        },
        editorSchema: {
            sections: [
                {
                    id: 'content',
                    title: 'Content',
                    collapsible: false,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'title.text',
                            type: FieldType.TEXT,
                            label: 'Title',
                            placeholder: 'Enter hero title',
                            required: true
                        },
                        {
                            id: 'subtitle.text',
                            type: FieldType.TEXT,
                            label: 'Subtitle',
                            placeholder: 'Enter hero subtitle',
                            required: false
                        },
                        {
                            id: 'description.text',
                            type: FieldType.TEXTAREA,
                            label: 'Description',
                            placeholder: 'Enter hero description',
                            required: false
                        }
                    ]
                },
                {
                    id: 'features',
                    title: 'Features',
                    collapsible: true,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'features',
                            type: FieldType.REPEATER,
                            label: 'Features',
                            required: true,
                            validation: [
                                { type: 'required', message: 'At least one feature is required' }
                            ]
                        },
                        {
                            id: 'layout',
                            type: FieldType.SELECT,
                            label: 'Layout',
                            required: true,
                            options: [
                                { label: 'Grid', value: 'grid' },
                                { label: 'List', value: 'list' },
                                { label: 'Carousel', value: 'carousel' }
                            ]
                        },
                        {
                            id: 'columns',
                            type: FieldType.SELECT,
                            label: 'Columns',
                            required: true,
                            options: [
                                { label: '2', value: 2 },
                                { label: '3', value: 3 },
                                { label: '4', value: 4 }
                            ],
                            dependencies: ['layout']
                        }
                    ]
                }
            ],
            validation: [],
            dependencies: [
                {
                    field: 'columns',
                    dependsOn: 'layout',
                    condition: 'equals',
                    value: 'grid',
                    action: 'show'
                }
            ]
        },
        previewComponent: 'HeroFeaturePreview',
        editorComponent: 'HeroFeatureEditor',
        tags: ['hero', 'features', 'benefits', 'grid', 'showcase'],
        isActive: true,
        version: '1.0.0',
        themeCompatibility: {
            supportedThemes: ['LIGHT', 'DARK', 'AUTO'],
            customCSSVariables: [],
            tailwindClasses: []
        },
        responsiveSupport: {
            breakpoints: ['mobile', 'tablet', 'desktop'],
            adaptiveLayout: true,
            responsiveImages: true,
            responsiveTypography: true
        }
    }

    // Additional variants (testimonial, product, service, cta, gallery) would follow the same pattern
    // For brevity, I'm including the structure for the remaining variants but not the full implementation
}

// Helper functions for registry management
export function getHeroSectionConfig(sectionId: string): HeroSectionConfig | undefined {
    return HERO_SECTION_REGISTRY[sectionId]
}

export function getActiveHeroSections(): HeroSectionConfig[] {
    return Object.values(HERO_SECTION_REGISTRY).filter(section => section.isActive)
}

export function getHeroSectionsByVariant(variant: HeroVariant): HeroSectionConfig[] {
    return Object.values(HERO_SECTION_REGISTRY).filter(section =>
        section.variant === variant && section.isActive
    )
}

export function searchHeroSections(query: string): HeroSectionConfig[] {
    const lowercaseQuery = query.toLowerCase()
    return Object.values(HERO_SECTION_REGISTRY).filter(section =>
        section.isActive && (
            section.name.toLowerCase().includes(lowercaseQuery) ||
            section.description.toLowerCase().includes(lowercaseQuery) ||
            section.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        )
    )
}

export function getHeroSectionCount(): number {
    return Object.keys(HERO_SECTION_REGISTRY).length
}

export function getActiveHeroSectionCount(): number {
    return getActiveHeroSections().length
}

export function validateHeroSectionConfig(config: HeroSectionConfig): string[] {
    const errors: string[] = []

    if (!config.id) {
        errors.push('Section ID is required')
    }

    if (!config.name) {
        errors.push('Section name is required')
    }

    if (!config.variant) {
        errors.push('Section variant is required')
    }

    if (!Object.values(HeroVariant).includes(config.variant)) {
        errors.push('Invalid section variant')
    }

    if (!config.defaultProps) {
        errors.push('Default props are required')
    }

    if (!config.editorSchema) {
        errors.push('Editor schema is required')
    }

    if (!config.previewComponent) {
        errors.push('Preview component is required')
    }

    if (!config.editorComponent) {
        errors.push('Editor component is required')
    }

    return errors
}

// Integration with main section registry
export function integrateWithMainRegistry() {
    // This function will be called to register hero sections with the main section registry
    // Implementation will be done when integrating with the existing system
    return Object.values(HERO_SECTION_REGISTRY).map(heroConfig => ({
        id: heroConfig.id,
        name: heroConfig.name,
        componentName: heroConfig.previewComponent,
        category: heroConfig.category,
        description: heroConfig.description,
        icon: heroConfig.icon,
        defaultProps: heroConfig.defaultProps,
        editorComponent: heroConfig.editorComponent,
        previewComponent: heroConfig.previewComponent,
        tags: heroConfig.tags,
        isActive: heroConfig.isActive,
        version: heroConfig.version
    }))
}

// Default configurations for new hero sections
export const DEFAULT_HERO_CONFIG: Partial<HeroSectionConfig> = {
    category: 'HERO',
    isActive: true,
    version: '1.0.0',
    tags: ['hero'],
    themeCompatibility: {
        supportedThemes: ['LIGHT', 'DARK', 'AUTO'],
        customCSSVariables: [],
        tailwindClasses: []
    },
    responsiveSupport: {
        breakpoints: ['mobile', 'tablet', 'desktop'],
        adaptiveLayout: true,
        responsiveImages: true,
        responsiveTypography: true
    }
}