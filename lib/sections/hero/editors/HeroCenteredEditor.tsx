'use client'

import React from 'react'
import {
    HeroEditorProps,
    HeroCenteredProps,
    FieldType,
    EditorSection
} from '../types'
import { BaseHeroEditor } from './BaseHeroEditor'
import { HeroCenteredPreview } from '../previews/HeroCenteredPreview'

/**
 * Hero Centered Editor Component
 * 
 * Specialized editor for the centered hero section variant with:
 * - Title, subtitle, and description configuration
 * - Primary and secondary button settings
 * - Background configuration (color, gradient, image)
 * - Text alignment options
 * - Real-time preview updates
 */
export function HeroCenteredEditor(props: HeroEditorProps<HeroCenteredProps>) {
    // Define editor schema for centered hero
    const editorSchema = {
        sections: [
            {
                id: 'content',
                title: 'Content',
                icon: '📝',
                collapsible: false,
                defaultExpanded: true,
                description: 'Configure the main content of your hero section',
                fields: [
                    {
                        id: 'title.text',
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
                        id: 'subtitle.text',
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
                        id: 'description.text',
                        type: FieldType.TEXTAREA,
                        label: 'Description',
                        placeholder: 'Enter a detailed description',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 500, message: 'Description must be less than 500 characters' }
                        ],
                        helpText: 'Additional details about your offering'
                    },
                    {
                        id: 'textAlign',
                        type: FieldType.SELECT,
                        label: 'Text Alignment',
                        required: true,
                        defaultValue: 'center',
                        options: [
                            { label: 'Left', value: 'left', icon: '⬅️' },
                            { label: 'Center', value: 'center', icon: '↔️' },
                            { label: 'Right', value: 'right', icon: '➡️' }
                        ],
                        helpText: 'How to align the text content'
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
                        placeholder: 'https://example.com or /page',
                        required: false,
                        dependencies: ['primaryButton.text'],
                        validation: [
                            { type: 'pattern', value: '^(https?://|/|#)', message: 'URL must start with http://, https://, /, or #' }
                        ]
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
                        id: 'primaryButton.size',
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
                        id: 'secondaryButton.text',
                        type: FieldType.TEXT,
                        label: 'Secondary Button Text',
                        placeholder: 'Learn More',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 30, message: 'Button text must be less than 30 characters' }
                        ]
                    },
                    {
                        id: 'secondaryButton.url',
                        type: FieldType.URL,
                        label: 'Secondary Button URL',
                        placeholder: 'https://example.com or /page',
                        required: false,
                        dependencies: ['secondaryButton.text'],
                        validation: [
                            { type: 'pattern', value: '^(https?://|/|#)', message: 'URL must start with http://, https://, /, or #' }
                        ]
                    },
                    {
                        id: 'secondaryButton.style',
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
                    },
                    {
                        id: 'background.overlay.enabled',
                        type: FieldType.BOOLEAN,
                        label: 'Enable Overlay',
                        required: false,
                        defaultValue: false,
                        helpText: 'Add a color overlay on top of background'
                    },
                    {
                        id: 'background.overlay.color',
                        type: FieldType.COLOR,
                        label: 'Overlay Color',
                        required: false,
                        defaultValue: '#000000',
                        dependencies: ['background.overlay.enabled'],
                        helpText: 'Color of the overlay'
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
                        dependencies: ['background.overlay.enabled'],
                        helpText: 'Transparency of the overlay (0 = transparent, 1 = opaque)'
                    }
                ]
            }
        ] as EditorSection[],
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
    }

    // Create a wrapper component that matches the expected interface
    const PreviewWrapper = ({ props: previewProps }: { props: HeroCenteredProps }) => (
        <HeroCenteredPreview {...previewProps} />
    )

    return (
        <BaseHeroEditor
            {...props}
            schema={editorSchema}
            previewComponent={PreviewWrapper}
        />
    )
}

export default HeroCenteredEditor