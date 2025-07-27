'use client'

import React from 'react'
import {
    HeroEditorProps,
    HeroSplitScreenProps,
    FieldType,
    EditorSection
} from '../types'
import { BaseHeroEditor } from './BaseHeroEditor'
import { HeroSplitScreenPreview } from '../previews/HeroSplitScreenPreview'

/**
 * Hero Split Screen Editor Component
 * 
 * Specialized editor for the split screen hero section variant with:
 * - Layout configuration (content position and alignment)
 * - Content configuration (title, subtitle, description, buttons)
 * - Media configuration (image/video upload and settings)
 * - Background configuration
 * - Real-time preview updates
 */
export function HeroSplitScreenEditor(props: HeroEditorProps<HeroSplitScreenProps>) {
    // Define editor schema for split screen hero
    const editorSchema = {
        sections: [
            {
                id: 'layout',
                title: 'Layout',
                icon: '📐',
                collapsible: false,
                defaultExpanded: true,
                description: 'Configure the layout and positioning of content and media',
                fields: [
                    {
                        id: 'layout',
                        type: FieldType.SELECT,
                        label: 'Content Position',
                        required: true,
                        defaultValue: 'left',
                        options: [
                            { label: 'Left (Content | Media)', value: 'left', icon: '⬅️' },
                            { label: 'Right (Media | Content)', value: 'right', icon: '➡️' }
                        ],
                        helpText: 'Choose which side the content appears on'
                    },
                    {
                        id: 'contentAlignment',
                        type: FieldType.SELECT,
                        label: 'Content Alignment',
                        required: true,
                        defaultValue: 'center',
                        options: [
                            { label: 'Top', value: 'start', icon: '⬆️' },
                            { label: 'Center', value: 'center', icon: '↔️' },
                            { label: 'Bottom', value: 'end', icon: '⬇️' }
                        ],
                        helpText: 'Vertical alignment of content within its container'
                    },
                    {
                        id: 'mediaAlignment',
                        type: FieldType.SELECT,
                        label: 'Media Alignment',
                        required: true,
                        defaultValue: 'center',
                        options: [
                            { label: 'Top', value: 'start', icon: '⬆️' },
                            { label: 'Center', value: 'center', icon: '↔️' },
                            { label: 'Bottom', value: 'end', icon: '⬇️' }
                        ],
                        helpText: 'Vertical alignment of media within its container'
                    }
                ]
            },
            {
                id: 'content',
                title: 'Content',
                icon: '📝',
                collapsible: true,
                defaultExpanded: true,
                description: 'Configure the text content and messaging',
                fields: [
                    {
                        id: 'content.title.text',
                        type: FieldType.TEXT,
                        label: 'Title',
                        placeholder: 'Enter your main headline',
                        required: true,
                        validation: [
                            { type: 'required', message: 'Title is required' },
                            { type: 'maxLength', value: 100, message: 'Title must be less than 100 characters' }
                        ],
                        helpText: 'This will be displayed as the main headline (H1)'
                    },
                    {
                        id: 'content.subtitle.text',
                        type: FieldType.TEXT,
                        label: 'Subtitle',
                        placeholder: 'Enter a supporting subtitle',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 150, message: 'Subtitle must be less than 150 characters' }
                        ],
                        helpText: 'Optional subtitle to support your main headline'
                    },
                    {
                        id: 'content.description.text',
                        type: FieldType.TEXTAREA,
                        label: 'Description',
                        placeholder: 'Enter a detailed description',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 500, message: 'Description must be less than 500 characters' }
                        ],
                        helpText: 'Additional details about your offering'
                    }
                ]
            },
            {
                id: 'buttons',
                title: 'Call-to-Action Buttons',
                icon: '🔘',
                collapsible: true,
                defaultExpanded: true,
                description: 'Configure your action buttons',
                fields: [
                    {
                        id: 'content.buttons.0.text',
                        type: FieldType.TEXT,
                        label: 'Primary Button Text',
                        placeholder: 'Get Started',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 30, message: 'Button text must be less than 30 characters' }
                        ]
                    },
                    {
                        id: 'content.buttons.0.url',
                        type: FieldType.URL,
                        label: 'Primary Button URL',
                        placeholder: 'https://example.com or /page',
                        required: false,
                        dependencies: ['content.buttons.0.text'],
                        validation: [
                            { type: 'pattern', value: '^(https?://|/|#)', message: 'URL must start with http://, https://, /, or #' }
                        ]
                    },
                    {
                        id: 'content.buttons.0.style',
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
                        id: 'content.buttons.0.size',
                        type: FieldType.SELECT,
                        label: 'Primary Button Size',
                        required: false,
                        defaultValue: 'lg',
                        options: [
                            { label: 'Small', value: 'sm' },
                            { label: 'Medium', value: 'md' },
                            { label: 'Large', value: 'lg' },
                            { label: 'Extra Large', value: 'xl' }
                        ]
                    },
                    {
                        id: 'content.buttons.1.text',
                        type: FieldType.TEXT,
                        label: 'Secondary Button Text',
                        placeholder: 'Learn More',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 30, message: 'Button text must be less than 30 characters' }
                        ]
                    },
                    {
                        id: 'content.buttons.1.url',
                        type: FieldType.URL,
                        label: 'Secondary Button URL',
                        placeholder: 'https://example.com or /page',
                        required: false,
                        dependencies: ['content.buttons.1.text'],
                        validation: [
                            { type: 'pattern', value: '^(https?://|/|#)', message: 'URL must start with http://, https://, /, or #' }
                        ]
                    },
                    {
                        id: 'content.buttons.1.style',
                        type: FieldType.SELECT,
                        label: 'Secondary Button Style',
                        required: false,
                        defaultValue: 'outline',
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
                id: 'media',
                title: 'Media',
                icon: '🖼️',
                collapsible: true,
                defaultExpanded: true,
                description: 'Configure the image or video content',
                fields: [
                    {
                        id: 'media.type',
                        type: FieldType.SELECT,
                        label: 'Media Type',
                        required: true,
                        defaultValue: 'image',
                        options: [
                            { label: 'Image', value: 'image', icon: '🖼️' },
                            { label: 'Video', value: 'video', icon: '🎥' }
                        ],
                        helpText: 'Choose between image or video content'
                    },
                    {
                        id: 'media',
                        type: FieldType.IMAGE,
                        label: 'Hero Image',
                        required: true,
                        dependencies: ['media.type'],
                        validation: [
                            { type: 'required', message: 'Hero image is required' }
                        ],
                        helpText: 'Upload the main image for your hero section'
                    },
                    {
                        id: 'media.alt',
                        type: FieldType.TEXT,
                        label: 'Alt Text',
                        placeholder: 'Describe the image for accessibility',
                        required: true,
                        validation: [
                            { type: 'required', message: 'Alt text is required for accessibility' },
                            { type: 'maxLength', value: 200, message: 'Alt text must be less than 200 characters' }
                        ],
                        helpText: 'Important for accessibility and SEO'
                    },
                    {
                        id: 'media.objectFit',
                        type: FieldType.SELECT,
                        label: 'Image Fit',
                        required: false,
                        defaultValue: 'cover',
                        options: [
                            { label: 'Cover (Fill container)', value: 'cover' },
                            { label: 'Contain (Fit within)', value: 'contain' },
                            { label: 'Fill (Stretch)', value: 'fill' },
                            { label: 'None (Original size)', value: 'none' },
                            { label: 'Scale Down', value: 'scale-down' }
                        ],
                        helpText: 'How the image should fit within its container'
                    }
                ]
            },
            {
                id: 'background',
                title: 'Background',
                icon: '🎨',
                collapsible: true,
                defaultExpanded: false,
                description: 'Configure the background appearance',
                fields: [
                    {
                        id: 'background.type',
                        type: FieldType.SELECT,
                        label: 'Background Type',
                        required: true,
                        defaultValue: 'color',
                        options: [
                            { label: 'None', value: 'none', icon: '⚪' },
                            { label: 'Solid Color', value: 'color', icon: '🎨' },
                            { label: 'Gradient', value: 'gradient', icon: '🌈' },
                            { label: 'Image', value: 'image', icon: '🖼️' }
                        ]
                    },
                    {
                        id: 'background.color',
                        type: FieldType.COLOR,
                        label: 'Background Color',
                        required: false,
                        defaultValue: '#ffffff',
                        dependencies: ['background.type'],
                        helpText: 'Choose a solid background color'
                    },
                    {
                        id: 'background.image',
                        type: FieldType.IMAGE,
                        label: 'Background Image',
                        required: false,
                        dependencies: ['background.type'],
                        helpText: 'Upload an image for the background'
                    }
                ]
            }
        ] as EditorSection[],
        validation: [],
        dependencies: [
            {
                field: 'content.buttons.0.url',
                dependsOn: 'content.buttons.0.text',
                condition: 'not-equals',
                value: '',
                action: 'show'
            },
            {
                field: 'content.buttons.1.url',
                dependsOn: 'content.buttons.1.text',
                condition: 'not-equals',
                value: '',
                action: 'show'
            },
            {
                field: 'media',
                dependsOn: 'media.type',
                condition: 'equals',
                value: 'image',
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
    }

    // Create a wrapper component that matches the expected interface
    const PreviewWrapper = (previewProps: HeroSplitScreenProps & { isPreview?: boolean; previewMode?: 'mobile' | 'tablet' | 'desktop' }) => (
        <HeroSplitScreenPreview {...previewProps} />
    )

    return (
        <BaseHeroEditor
            {...props}
            schema={editorSchema}
            previewComponent={PreviewWrapper}
        />
    )
}

export default HeroSplitScreenEditor