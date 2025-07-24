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
    },

    'hero-testimonial': {
        id: 'hero-testimonial',
        variant: HeroVariant.TESTIMONIAL,
        name: 'Hero Testimonial',
        description: 'Social proof integration with customer testimonials and ratings',
        icon: '💬',
        category: 'HERO',
        defaultProps: {
            title: {
                text: 'What Our Customers Say',
                tag: 'h1'
            },
            subtitle: {
                text: 'Trusted by thousands of businesses worldwide',
                tag: 'h2'
            },
            testimonials: [
                {
                    id: 'testimonial-1',
                    quote: 'This product has completely transformed our business operations. The results exceeded our expectations.',
                    author: 'Sarah Johnson',
                    company: 'TechCorp Inc.',
                    role: 'CEO',
                    rating: 5,
                    avatar: {
                        id: 'avatar-1',
                        url: '/assets/testimonials/sarah-johnson.jpg',
                        type: 'image',
                        alt: 'Sarah Johnson avatar',
                        objectFit: 'cover',
                        loading: 'lazy'
                    }
                },
                {
                    id: 'testimonial-2',
                    quote: 'Outstanding service and incredible results. I would highly recommend this to anyone.',
                    author: 'Michael Chen',
                    company: 'Design Studio',
                    role: 'Creative Director',
                    rating: 5
                },
                {
                    id: 'testimonial-3',
                    quote: 'The best investment we have made for our company this year. Fantastic support team.',
                    author: 'Emily Rodriguez',
                    company: 'StartupXYZ',
                    role: 'Founder',
                    rating: 4
                }
            ],
            layout: 'single',
            autoRotate: false,
            rotationInterval: 5000,
            showRatings: true,
            background: {
                type: 'gradient',
                gradient: {
                    type: 'linear',
                    direction: '135deg',
                    colors: [
                        { color: '#667eea', stop: 0 },
                        { color: '#764ba2', stop: 100 }
                    ]
                },
                overlay: {
                    enabled: false,
                    color: '#000000',
                    opacity: 0.4
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
                            required: false,
                            validation: [
                                { type: 'maxLength', value: 150, message: 'Subtitle must be less than 150 characters' }
                            ]
                        }
                    ]
                },
                {
                    id: 'layout',
                    title: 'Layout & Display',
                    collapsible: true,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'layout',
                            type: FieldType.SELECT,
                            label: 'Layout Style',
                            required: true,
                            defaultValue: 'single',
                            options: [
                                { label: 'Single', value: 'single', icon: '⊙' },
                                { label: 'Carousel', value: 'carousel', icon: '⟷' },
                                { label: 'Grid', value: 'grid', icon: '⊞' }
                            ]
                        },
                        {
                            id: 'showRatings',
                            type: FieldType.BOOLEAN,
                            label: 'Show Ratings',
                            required: false,
                            defaultValue: true
                        },
                        {
                            id: 'autoRotate',
                            type: FieldType.BOOLEAN,
                            label: 'Auto-rotate Testimonials',
                            required: false,
                            defaultValue: false,
                            dependencies: ['layout']
                        },
                        {
                            id: 'rotationInterval',
                            type: FieldType.NUMBER,
                            label: 'Rotation Interval (seconds)',
                            required: false,
                            defaultValue: 5,
                            min: 2,
                            max: 30,
                            dependencies: ['autoRotate']
                        }
                    ]
                },
                {
                    id: 'button',
                    title: 'Call-to-Action Button',
                    collapsible: true,
                    defaultExpanded: false,
                    fields: [
                        {
                            id: 'primaryButton.text',
                            type: FieldType.TEXT,
                            label: 'Button Text',
                            placeholder: 'Get Started',
                            required: false,
                            validation: [
                                { type: 'maxLength', value: 30, message: 'Button text must be less than 30 characters' }
                            ]
                        },
                        {
                            id: 'primaryButton.url',
                            type: FieldType.URL,
                            label: 'Button URL',
                            placeholder: 'https://example.com or /page',
                            required: false,
                            dependencies: ['primaryButton.text']
                        },
                        {
                            id: 'primaryButton.style',
                            type: FieldType.SELECT,
                            label: 'Button Style',
                            required: false,
                            defaultValue: 'primary',
                            options: [
                                { label: 'Primary', value: 'primary' },
                                { label: 'Secondary', value: 'secondary' },
                                { label: 'Outline', value: 'outline' },
                                { label: 'Ghost', value: 'ghost' },
                                { label: 'Link', value: 'link' }
                            ]
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
                            defaultValue: 'gradient',
                            options: [
                                { label: 'None', value: 'none', icon: '⚪' },
                                { label: 'Solid Color', value: 'color', icon: '🎨' },
                                { label: 'Gradient', value: 'gradient', icon: '🌈' },
                                { label: 'Image', value: 'image', icon: '🖼️' },
                                { label: 'Video', value: 'video', icon: '🎥' }
                            ]
                        },
                        {
                            id: 'background.color',
                            type: FieldType.COLOR,
                            label: 'Background Color',
                            required: false,
                            defaultValue: '#3b82f6',
                            dependencies: ['background.type']
                        },
                        {
                            id: 'background.image',
                            type: FieldType.IMAGE,
                            label: 'Background Image',
                            required: false,
                            dependencies: ['background.type']
                        },
                        {
                            id: 'background.overlay.enabled',
                            type: FieldType.BOOLEAN,
                            label: 'Enable Overlay',
                            required: false,
                            defaultValue: false
                        },
                        {
                            id: 'background.overlay.color',
                            type: FieldType.COLOR,
                            label: 'Overlay Color',
                            required: false,
                            defaultValue: '#000000',
                            dependencies: ['background.overlay.enabled']
                        },
                        {
                            id: 'background.overlay.opacity',
                            type: FieldType.SLIDER,
                            label: 'Overlay Opacity',
                            required: false,
                            defaultValue: 0.4,
                            min: 0,
                            max: 1,
                            step: 0.1,
                            dependencies: ['background.overlay.enabled']
                        }
                    ]
                }
            ],
            validation: [],
            dependencies: [
                {
                    field: 'autoRotate',
                    dependsOn: 'layout',
                    condition: 'not-equals',
                    value: 'grid',
                    action: 'show'
                },
                {
                    field: 'rotationInterval',
                    dependsOn: 'autoRotate',
                    condition: 'equals',
                    value: true,
                    action: 'show'
                },
                {
                    field: 'primaryButton.url',
                    dependsOn: 'primaryButton.text',
                    condition: 'not-equals',
                    value: '',
                    action: 'show'
                },
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
                },
                {
                    field: 'background.overlay.color',
                    dependsOn: 'background.overlay.enabled',
                    condition: 'equals',
                    value: true,
                    action: 'show'
                },
                {
                    field: 'background.overlay.opacity',
                    dependsOn: 'background.overlay.enabled',
                    condition: 'equals',
                    value: true,
                    action: 'show'
                }
            ]
        },
        previewComponent: 'HeroTestimonialPreview',
        editorComponent: 'HeroTestimonialEditor',
        tags: ['hero', 'testimonial', 'social-proof', 'reviews', 'customers'],
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
        },
        requiredFeatures: ['testimonial-management'],
        optionalFeatures: ['testimonial-rotation', 'rating-display']
    },

    'hero-service': {
        id: 'hero-service',
        variant: HeroVariant.SERVICE,
        name: 'Hero Service',
        description: 'Service-oriented layout with trust indicators and value proposition',
        icon: '🏢',
        category: 'HERO',
        defaultProps: {
            title: {
                text: 'Professional Services',
                tag: 'h1'
            },
            subtitle: {
                text: 'Expert solutions tailored to your business needs',
                tag: 'h2'
            },
            description: {
                text: 'We provide comprehensive services designed to help your business grow and succeed in today\'s competitive market.',
                tag: 'p'
            },
            services: [
                {
                    id: 'service-1',
                    title: 'Consulting',
                    description: 'Strategic business consulting to drive growth',
                    icon: '💼',
                    features: ['Expert analysis', 'Custom strategies', 'Implementation support']
                },
                {
                    id: 'service-2',
                    title: 'Development',
                    description: 'Custom software development solutions',
                    icon: '💻',
                    features: ['Web applications', 'Mobile apps', 'API integration']
                },
                {
                    id: 'service-3',
                    title: 'Support',
                    description: '24/7 technical support and maintenance',
                    icon: '🛠️',
                    features: ['Round-the-clock support', 'Proactive monitoring', 'Quick resolution']
                }
            ],
            trustBadges: [
                {
                    id: 'badge-1',
                    name: 'ISO Certified',
                    image: {
                        id: 'iso-badge',
                        url: '/assets/badges/iso-certified.png',
                        type: 'image',
                        alt: 'ISO Certified badge',
                        objectFit: 'contain',
                        loading: 'lazy'
                    }
                },
                {
                    id: 'badge-2',
                    name: 'Industry Leader',
                    image: {
                        id: 'leader-badge',
                        url: '/assets/badges/industry-leader.png',
                        type: 'image',
                        alt: 'Industry Leader badge',
                        objectFit: 'contain',
                        loading: 'lazy'
                    }
                }
            ],
            layout: 'grid',
            showTrustBadges: true,
            background: {
                type: 'color',
                color: '#ffffff'
            },
            primaryButton: {
                text: 'Get Started',
                url: '#',
                style: 'primary',
                size: 'lg',
                iconPosition: 'right',
                target: '_self'
            },
            contactButton: {
                text: 'Contact Us',
                url: '#contact',
                style: 'outline',
                size: 'lg',
                iconPosition: 'left',
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
                            placeholder: 'Professional Services That Drive Results',
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
                            placeholder: 'Expert solutions tailored to your business needs',
                            required: false,
                            validation: [
                                { type: 'maxLength', value: 150, message: 'Subtitle must be less than 150 characters' }
                            ]
                        },
                        {
                            id: 'description.text',
                            type: FieldType.TEXTAREA,
                            label: 'Description',
                            placeholder: 'We provide comprehensive services designed to help your business grow and succeed in today\'s competitive market.',
                            required: false,
                            validation: [
                                { type: 'maxLength', value: 500, message: 'Description must be less than 500 characters' }
                            ]
                        }
                    ]
                },
                {
                    id: 'layout',
                    title: 'Layout',
                    collapsible: true,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'layout',
                            type: FieldType.SELECT,
                            label: 'Services Layout',
                            required: true,
                            defaultValue: 'grid',
                            options: [
                                { label: 'Grid Layout', value: 'grid' },
                                { label: 'List Layout', value: 'list' }
                            ]
                        },
                        {
                            id: 'showTrustBadges',
                            type: FieldType.BOOLEAN,
                            label: 'Show Trust Badges',
                            required: false,
                            defaultValue: true
                        }
                    ]
                },
                {
                    id: 'buttons',
                    title: 'Action Buttons',
                    collapsible: true,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'primaryButton.text',
                            type: FieldType.TEXT,
                            label: 'Primary Button Text',
                            placeholder: 'Get Started',
                            required: false,
                            validation: [
                                { type: 'maxLength', value: 30, message: 'Button text must be less than 30 characters' }
                            ]
                        },
                        {
                            id: 'primaryButton.url',
                            type: FieldType.URL,
                            label: 'Primary Button URL',
                            placeholder: 'https://example.com/services or /services',
                            required: false,
                            dependencies: ['primaryButton.text']
                        },
                        {
                            id: 'contactButton.text',
                            type: FieldType.TEXT,
                            label: 'Contact Button Text',
                            placeholder: 'Contact Us',
                            required: false,
                            validation: [
                                { type: 'maxLength', value: 30, message: 'Button text must be less than 30 characters' }
                            ]
                        },
                        {
                            id: 'contactButton.url',
                            type: FieldType.URL,
                            label: 'Contact Button URL',
                            placeholder: 'https://example.com/contact or /contact',
                            required: false,
                            dependencies: ['contactButton.text']
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
                            defaultValue: 'color',
                            options: [
                                { label: 'None', value: 'none' },
                                { label: 'Solid Color', value: 'color' },
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
                            defaultValue: '#ffffff',
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
                    field: 'primaryButton.url',
                    dependsOn: 'primaryButton.text',
                    condition: 'not-equals',
                    value: '',
                    action: 'show'
                },
                {
                    field: 'contactButton.url',
                    dependsOn: 'contactButton.text',
                    condition: 'not-equals',
                    value: '',
                    action: 'show'
                },
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
        previewComponent: 'HeroServicePreview',
        editorComponent: 'HeroServiceEditor',
        tags: ['hero', 'service', 'business', 'trust', 'professional', 'b2b'],
        isActive: true,
        version: '1.0.0',
        themeCompatibility: {
            supportedThemes: ['LIGHT', 'DARK', 'AUTO'],
            customCSSVariables: [
                {
                    property: 'background-color',
                    cssVariable: '--hero-service-bg',
                    fallback: '#ffffff',
                    themeKey: 'backgroundColor'
                },
                {
                    property: 'color',
                    cssVariable: '--hero-service-text',
                    fallback: '#1f2937',
                    themeKey: 'textColor'
                }
            ],
            tailwindClasses: [
                {
                    condition: 'theme.primaryColor',
                    classes: ['text-primary', 'border-primary'],
                    responsive: true
                }
            ]
        },
        responsiveSupport: {
            breakpoints: ['mobile', 'tablet', 'desktop'],
            adaptiveLayout: true,
            responsiveImages: true,
            responsiveTypography: true
        },
        requiredFeatures: ['media-upload'],
        optionalFeatures: ['trust-badges', 'service-management']
    },

    'hero-product': {
        id: 'hero-product',
        variant: HeroVariant.PRODUCT,
        name: 'Hero Product',
        description: 'Product showcase with gallery functionality and e-commerce features',
        icon: '🛍️',
        category: 'HERO',
        defaultProps: {
            product: {
                id: 'product-1',
                name: 'Amazing Product',
                description: 'Discover our flagship product that will transform your experience with innovative features and exceptional quality.',
                price: '99.99',
                originalPrice: '149.99',
                currency: '$',
                badge: 'Best Seller',
                images: [
                    {
                        id: 'product-image-1',
                        url: '/assets/hero/product-main.jpg',
                        type: 'image',
                        alt: 'Amazing Product - Main View',
                        objectFit: 'cover',
                        loading: 'eager'
                    },
                    {
                        id: 'product-image-2',
                        url: '/assets/hero/product-side.jpg',
                        type: 'image',
                        alt: 'Amazing Product - Side View',
                        objectFit: 'cover',
                        loading: 'lazy'
                    },
                    {
                        id: 'product-image-3',
                        url: '/assets/hero/product-detail.jpg',
                        type: 'image',
                        alt: 'Amazing Product - Detail View',
                        objectFit: 'cover',
                        loading: 'lazy'
                    }
                ],
                features: [
                    'Premium quality materials',
                    'Advanced technology integration',
                    'Eco-friendly design',
                    '2-year warranty included',
                    'Free shipping worldwide'
                ],
                link: '/products/amazing-product'
            },
            layout: 'left',
            showGallery: true,
            showFeatures: true,
            showPricing: true,
            background: {
                type: 'color',
                color: '#ffffff',
                overlay: {
                    enabled: false,
                    color: '#000000',
                    opacity: 0.4
                }
            },
            primaryButton: {
                text: 'Buy Now',
                url: '/checkout',
                style: 'primary',
                size: 'lg',
                iconPosition: 'right',
                target: '_self'
            },
            secondaryButton: {
                text: 'Learn More',
                url: '/products/amazing-product',
                style: 'outline',
                size: 'lg',
                iconPosition: 'left',
                target: '_self'
            }
        },
        editorSchema: {
            sections: [
                {
                    id: 'layout',
                    title: 'Layout & Display',
                    collapsible: false,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'layout',
                            type: FieldType.SELECT,
                            label: 'Layout Style',
                            required: true,
                            defaultValue: 'left',
                            options: [
                                { label: 'Content Left, Gallery Right', value: 'left' },
                                { label: 'Content Right, Gallery Left', value: 'right' },
                                { label: 'Centered', value: 'center' }
                            ]
                        },
                        {
                            id: 'showGallery',
                            type: FieldType.BOOLEAN,
                            label: 'Show Image Gallery',
                            required: false,
                            defaultValue: true
                        },
                        {
                            id: 'showFeatures',
                            type: FieldType.BOOLEAN,
                            label: 'Show Features List',
                            required: false,
                            defaultValue: true
                        },
                        {
                            id: 'showPricing',
                            type: FieldType.BOOLEAN,
                            label: 'Show Pricing',
                            required: false,
                            defaultValue: true
                        }
                    ]
                },
                {
                    id: 'buttons',
                    title: 'Action Buttons',
                    collapsible: true,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'primaryButton.text',
                            type: FieldType.TEXT,
                            label: 'Primary Button Text',
                            placeholder: 'Buy Now',
                            required: false,
                            validation: [
                                { type: 'maxLength', value: 30, message: 'Button text must be less than 30 characters' }
                            ]
                        },
                        {
                            id: 'primaryButton.url',
                            type: FieldType.URL,
                            label: 'Primary Button URL',
                            placeholder: 'https://example.com/buy or /checkout',
                            required: false,
                            dependencies: ['primaryButton.text']
                        },
                        {
                            id: 'primaryButton.style',
                            type: FieldType.SELECT,
                            label: 'Primary Button Style',
                            required: false,
                            defaultValue: 'primary',
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
                            placeholder: 'Learn More',
                            required: false
                        },
                        {
                            id: 'secondaryButton.url',
                            type: FieldType.URL,
                            label: 'Secondary Button URL',
                            placeholder: 'https://example.com or /page',
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
                            defaultValue: 'color',
                            options: [
                                { label: 'None', value: 'none' },
                                { label: 'Solid Color', value: 'color' },
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
                            defaultValue: '#ffffff',
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
                    field: 'primaryButton.url',
                    dependsOn: 'primaryButton.text',
                    condition: 'not-equals',
                    value: '',
                    action: 'show'
                },
                {
                    field: 'secondaryButton.url',
                    dependsOn: 'secondaryButton.text',
                    condition: 'not-equals',
                    value: '',
                    action: 'show'
                },
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
        previewComponent: 'HeroProductPreview',
        editorComponent: 'HeroProductEditor',
        tags: ['hero', 'product', 'e-commerce', 'gallery', 'showcase'],
        isActive: true,
        version: '1.0.0',
        themeCompatibility: {
            supportedThemes: ['LIGHT', 'DARK', 'AUTO'],
            customCSSVariables: [
                {
                    property: 'color',
                    cssVariable: '--hero-primary-color',
                    fallback: '#3b82f6',
                    themeKey: 'primaryColor'
                }
            ],
            tailwindClasses: [
                {
                    condition: 'theme.primaryColor',
                    classes: ['text-primary', 'border-primary'],
                    responsive: true
                }
            ]
        },
        responsiveSupport: {
            breakpoints: ['mobile', 'tablet', 'desktop'],
            adaptiveLayout: true,
            responsiveImages: true,
            responsiveTypography: true
        },
        requiredFeatures: ['media-gallery'],
        optionalFeatures: ['e-commerce-integration', 'product-analytics']
    },

    'hero-gallery': {
        id: 'hero-gallery',
        variant: HeroVariant.GALLERY,
        name: 'Hero Gallery',
        description: 'Visual storytelling through image collections with lightbox and carousel functionality',
        icon: '🖼️',
        category: 'HERO',
        defaultProps: {
            title: {
                text: 'Our Photo Gallery',
                tag: 'h1'
            },
            subtitle: {
                text: 'Explore our collection of stunning images showcasing the beauty of nature and urban landscapes.',
                tag: 'p'
            },
            gallery: [
                {
                    id: 'sample-1',
                    image: {
                        id: 'sample-image-1',
                        url: '/assets/hero/gallery-1.jpg',
                        type: 'image',
                        alt: 'Beautiful mountain landscape',
                        objectFit: 'cover',
                        loading: 'lazy'
                    },
                    caption: 'Stunning mountain vista at sunrise'
                },
                {
                    id: 'sample-2',
                    image: {
                        id: 'sample-image-2',
                        url: '/assets/hero/gallery-2.jpg',
                        type: 'image',
                        alt: 'Forest path through tall trees',
                        objectFit: 'cover',
                        loading: 'lazy'
                    },
                    caption: 'Peaceful forest trail'
                },
                {
                    id: 'sample-3',
                    image: {
                        id: 'sample-image-3',
                        url: '/assets/hero/gallery-3.jpg',
                        type: 'image',
                        alt: 'Ocean waves on sandy beach',
                        objectFit: 'cover',
                        loading: 'lazy'
                    },
                    caption: 'Serene ocean coastline'
                }
            ],
            layout: 'grid',
            columns: 3,
            showCaptions: true,
            lightbox: true,
            autoplay: false,
            autoplayInterval: 5000,
            background: {
                type: 'none'
            },
            primaryButton: {
                text: 'View All Photos',
                url: '#gallery',
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
                            placeholder: 'Enter your gallery title',
                            required: false,
                            validation: [
                                { type: 'maxLength', value: 100, message: 'Title must be less than 100 characters' }
                            ]
                        },
                        {
                            id: 'subtitle.text',
                            type: FieldType.TEXTAREA,
                            label: 'Subtitle',
                            placeholder: 'Enter a description for your gallery',
                            required: false,
                            validation: [
                                { type: 'maxLength', value: 300, message: 'Subtitle must be less than 300 characters' }
                            ]
                        }
                    ]
                },
                {
                    id: 'layout',
                    title: 'Layout & Display',
                    collapsible: true,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'layout',
                            type: FieldType.SELECT,
                            label: 'Gallery Layout',
                            required: true,
                            defaultValue: 'grid',
                            options: [
                                { label: 'Grid', value: 'grid' },
                                { label: 'Masonry', value: 'masonry' },
                                { label: 'Carousel', value: 'carousel' }
                            ]
                        },
                        {
                            id: 'columns',
                            type: FieldType.SELECT,
                            label: 'Columns',
                            required: true,
                            defaultValue: 3,
                            options: [
                                { label: '2 Columns', value: 2 },
                                { label: '3 Columns', value: 3 },
                                { label: '4 Columns', value: 4 },
                                { label: '5 Columns', value: 5 }
                            ]
                        },
                        {
                            id: 'showCaptions',
                            type: FieldType.BOOLEAN,
                            label: 'Show Captions',
                            required: false,
                            defaultValue: true
                        },
                        {
                            id: 'lightbox',
                            type: FieldType.BOOLEAN,
                            label: 'Enable Lightbox',
                            required: false,
                            defaultValue: true
                        }
                    ]
                },
                {
                    id: 'carousel',
                    title: 'Carousel Settings',
                    collapsible: true,
                    defaultExpanded: false,
                    fields: [
                        {
                            id: 'autoplay',
                            type: FieldType.BOOLEAN,
                            label: 'Auto-advance',
                            required: false,
                            defaultValue: false
                        },
                        {
                            id: 'autoplayInterval',
                            type: FieldType.NUMBER,
                            label: 'Auto-advance Interval (ms)',
                            required: false,
                            defaultValue: 5000,
                            min: 1000,
                            max: 30000,
                            step: 1000
                        }
                    ]
                },
                {
                    id: 'cta',
                    title: 'Call-to-Action',
                    collapsible: true,
                    defaultExpanded: false,
                    fields: [
                        {
                            id: 'primaryButton.text',
                            type: FieldType.TEXT,
                            label: 'Button Text',
                            placeholder: 'View All Photos',
                            required: false
                        },
                        {
                            id: 'primaryButton.url',
                            type: FieldType.URL,
                            label: 'Button URL',
                            placeholder: 'https://example.com or /gallery',
                            required: false,
                            dependencies: ['primaryButton.text']
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
                            defaultValue: 'none',
                            options: [
                                { label: 'None', value: 'none' },
                                { label: 'Solid Color', value: 'color' },
                                { label: 'Gradient', value: 'gradient' },
                                { label: 'Image', value: 'image' }
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
                    field: 'columns',
                    dependsOn: 'layout',
                    condition: 'not-equals',
                    value: 'carousel',
                    action: 'show'
                },
                {
                    field: 'autoplayInterval',
                    dependsOn: 'autoplay',
                    condition: 'equals',
                    value: true,
                    action: 'show'
                },
                {
                    field: 'primaryButton.url',
                    dependsOn: 'primaryButton.text',
                    condition: 'not-equals',
                    value: '',
                    action: 'show'
                },
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
        previewComponent: 'HeroGalleryPreview',
        editorComponent: 'HeroGalleryEditor',
        tags: ['hero', 'gallery', 'images', 'lightbox', 'carousel', 'visual', 'portfolio'],
        isActive: true,
        version: '1.0.0',
        themeCompatibility: {
            supportedThemes: ['LIGHT', 'DARK', 'AUTO'],
            customCSSVariables: [
                {
                    property: 'background-color',
                    cssVariable: '--hero-gallery-bg',
                    fallback: 'transparent',
                    themeKey: 'backgroundColor'
                }
            ],
            tailwindClasses: [
                {
                    condition: 'layout.grid',
                    classes: ['grid', 'gap-4'],
                    responsive: true
                },
                {
                    condition: 'layout.masonry',
                    classes: ['columns-1', 'md:columns-2', 'lg:columns-3'],
                    responsive: true
                }
            ]
        },
        responsiveSupport: {
            breakpoints: ['mobile', 'tablet', 'desktop'],
            adaptiveLayout: true,
            responsiveImages: true,
            responsiveTypography: true
        },
        requiredFeatures: ['image-gallery', 'lightbox'],
        optionalFeatures: ['image-lazy-loading', 'image-optimization', 'carousel-autoplay']
    },

    'hero-cta': {
        id: 'hero-cta',
        variant: HeroVariant.CTA,
        name: 'Hero CTA',
        description: 'Conversion-focused hero section with prominent call-to-action elements and urgency indicators',
        icon: '🚀',
        category: 'HERO',
        defaultProps: {
            title: {
                text: 'Transform Your Business Today',
                tag: 'h1'
            },
            subtitle: {
                text: 'Join thousands of successful companies',
                tag: 'h2'
            },
            description: {
                text: 'Get the tools and insights you need to grow your business faster than ever before.',
                tag: 'p'
            },
            primaryButton: {
                text: 'Start Free Trial',
                url: '#signup',
                style: 'primary',
                size: 'xl',
                iconPosition: 'right',
                target: '_self',
                ariaLabel: 'Start your free trial now'
            },
            secondaryButton: {
                text: 'Watch Demo',
                url: '#demo',
                style: 'outline',
                size: 'lg',
                iconPosition: 'left',
                target: '_self',
                ariaLabel: 'Watch product demo'
            },
            urgencyText: {
                text: 'Limited Time: 50% Off First Month!',
                tag: 'span'
            },
            benefits: [
                'No setup fees or hidden costs',
                '24/7 customer support included',
                'Cancel anytime, no questions asked',
                'Results guaranteed in 30 days'
            ],
            background: {
                type: 'gradient',
                gradient: {
                    type: 'linear',
                    direction: '135deg',
                    colors: [
                        { color: '#667eea', stop: 0 },
                        { color: '#764ba2', stop: 100 }
                    ]
                },
                overlay: {
                    enabled: true,
                    color: '#000000',
                    opacity: 0.3
                }
            },
            layout: 'center',
            showBenefits: true
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
                            label: 'Headline',
                            placeholder: 'Enter your compelling headline',
                            required: true,
                            validation: [
                                { type: 'required', message: 'Headline is required' },
                                { type: 'maxLength', value: 80, message: 'Headline should be under 80 characters for better impact' }
                            ]
                        },
                        {
                            id: 'subtitle.text',
                            type: FieldType.TEXT,
                            label: 'Subtitle',
                            placeholder: 'Enter a supporting subtitle',
                            required: false,
                            validation: [
                                { type: 'maxLength', value: 120, message: 'Subtitle should be under 120 characters' }
                            ]
                        },
                        {
                            id: 'description.text',
                            type: FieldType.TEXTAREA,
                            label: 'Description',
                            placeholder: 'Explain the value and benefits',
                            required: false,
                            validation: [
                                { type: 'maxLength', value: 300, message: 'Keep description concise for better conversion' }
                            ]
                        },
                        {
                            id: 'urgencyText.text',
                            type: FieldType.TEXT,
                            label: 'Urgency Text',
                            placeholder: 'Limited Time Offer - 50% Off!',
                            required: false,
                            validation: [
                                { type: 'maxLength', value: 60, message: 'Keep urgency text short and punchy' }
                            ]
                        },
                        {
                            id: 'layout',
                            type: FieldType.SELECT,
                            label: 'Layout Style',
                            required: true,
                            defaultValue: 'center',
                            options: [
                                { label: 'Centered', value: 'center' },
                                { label: 'Split Layout', value: 'split' }
                            ]
                        }
                    ]
                },
                {
                    id: 'cta-buttons',
                    title: 'Call-to-Action Buttons',
                    collapsible: true,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'primaryButton.text',
                            type: FieldType.TEXT,
                            label: 'Primary CTA Text',
                            placeholder: 'Start Free Trial',
                            required: true,
                            validation: [
                                { type: 'required', message: 'Primary CTA is required' },
                                { type: 'maxLength', value: 25, message: 'Keep CTA text short and actionable' }
                            ]
                        },
                        {
                            id: 'primaryButton.url',
                            type: FieldType.URL,
                            label: 'Primary CTA URL',
                            placeholder: '/signup or https://example.com/signup',
                            required: true,
                            validation: [
                                { type: 'required', message: 'Primary CTA URL is required' }
                            ]
                        },
                        {
                            id: 'secondaryButton.text',
                            type: FieldType.TEXT,
                            label: 'Secondary CTA Text',
                            placeholder: 'Learn More',
                            required: false,
                            validation: [
                                { type: 'maxLength', value: 25, message: 'Keep secondary CTA text short' }
                            ]
                        },
                        {
                            id: 'secondaryButton.url',
                            type: FieldType.URL,
                            label: 'Secondary CTA URL',
                            placeholder: '/demo or https://example.com/demo',
                            required: false,
                            dependencies: ['secondaryButton.text']
                        }
                    ]
                },
                {
                    id: 'benefits',
                    title: 'Benefits & Social Proof',
                    collapsible: true,
                    defaultExpanded: true,
                    fields: [
                        {
                            id: 'showBenefits',
                            type: FieldType.BOOLEAN,
                            label: 'Show Benefits List',
                            required: false,
                            defaultValue: true
                        },
                        {
                            id: 'benefits',
                            type: FieldType.REPEATER,
                            label: 'Benefits',
                            placeholder: 'Add benefit',
                            required: false,
                            dependencies: ['showBenefits']
                        }
                    ]
                },
                {
                    id: 'background',
                    title: 'Background & Design',
                    collapsible: true,
                    defaultExpanded: false,
                    fields: [
                        {
                            id: 'background.type',
                            type: FieldType.SELECT,
                            label: 'Background Type',
                            required: true,
                            defaultValue: 'gradient',
                            options: [
                                { label: 'Gradient', value: 'gradient' },
                                { label: 'Solid Color', value: 'color' },
                                { label: 'Image', value: 'image' },
                                { label: 'Video', value: 'video' }
                            ]
                        },
                        {
                            id: 'background.color',
                            type: FieldType.COLOR,
                            label: 'Background Color',
                            required: false,
                            defaultValue: '#3b82f6',
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
                    field: 'secondaryButton.url',
                    dependsOn: 'secondaryButton.text',
                    condition: 'not-equals',
                    value: '',
                    action: 'show'
                },
                {
                    field: 'benefits',
                    dependsOn: 'showBenefits',
                    condition: 'equals',
                    value: true,
                    action: 'show'
                },
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
        previewComponent: 'HeroCTAPreview',
        editorComponent: 'HeroCTAEditor',
        tags: ['hero', 'cta', 'conversion', 'landing', 'marketing', 'urgency'],
        isActive: true,
        version: '1.0.0',
        themeCompatibility: {
            supportedThemes: ['LIGHT', 'DARK', 'AUTO'],
            customCSSVariables: [
                {
                    property: 'background-color',
                    cssVariable: '--hero-cta-primary-color',
                    fallback: '#667eea',
                    themeKey: 'primaryColor'
                },
                {
                    property: 'color',
                    cssVariable: '--hero-cta-text-color',
                    fallback: '#ffffff',
                    themeKey: 'textColor'
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
        },
        requiredFeatures: ['conversion-tracking'],
        optionalFeatures: ['ab-testing', 'analytics-integration', 'form-integration']
    }
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