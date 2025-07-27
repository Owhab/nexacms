'use client'

import React from 'react'
import {
    HeroEditorProps,
    HeroMinimalProps,
    FieldType,
    EditorSection
} from '../types'
import { BaseHeroEditor } from './BaseHeroEditor'
import { HeroMinimalPreview } from '../previews/HeroMinimalPreview'

/**
 * Hero Minimal Editor Component
 * 
 * Specialized editor for the minimal hero section variant with:
 * - Typography-focused configuration
 * - Minimal design options
 * - Spacing controls
 * - Single CTA button
 * - Clean background options
 * - Real-time preview updates
 */
export function HeroMinimalEditor(props: HeroEditorProps<HeroMinimalProps>) {
    // Define editor schema for minimal hero
    const editorSchema = {
        sections: [
            {
                id: 'content',
                title: 'Content',
                icon: '✏️',
                collapsible: false,
                defaultExpanded: true,
                description: 'Configure the minimal content of your hero section',
                fields: [
                    {
                        id: 'title.text',
                        type: FieldType.TEXT,
                        label: 'Title',
                        placeholder: 'Enter your main headline',
                        required: true,
                        validation: [
                            { type: 'required', message: 'Title is required' },
                            { type: 'maxLength', value: 80, message: 'Title should be concise (max 80 characters)' }
                        ],
                        helpText: 'Keep it simple and impactful - this is the main focus'
                    },
                    {
                        id: 'subtitle.text',
                        type: FieldType.TEXT,
                        label: 'Subtitle',
                        placeholder: 'Enter a brief supporting message',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 120, message: 'Subtitle should be brief (max 120 characters)' }
                        ],
                        helpText: 'Optional supporting text - keep it minimal'
                    },
                    {
                        id: 'spacing',
                        type: FieldType.SELECT,
                        label: 'Content Spacing',
                        required: true,
                        defaultValue: 'normal',
                        options: [
                            { label: 'Compact', value: 'compact', icon: '📏' },
                            { label: 'Normal', value: 'normal', icon: '📐' },
                            { label: 'Spacious', value: 'spacious', icon: '📏' }
                        ],
                        helpText: 'Control the whitespace and breathing room'
                    }
                ]
            },
            {
                id: 'cta',
                title: 'Call-to-Action',
                icon: '🎯',
                collapsible: true,
                defaultExpanded: true,
                description: 'Configure your single action button',
                fields: [
                    {
                        id: 'button.text',
                        type: FieldType.TEXT,
                        label: 'Button Text',
                        placeholder: 'Get Started',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 25, message: 'Button text should be concise (max 25 characters)' }
                        ],
                        helpText: 'Keep it short and action-oriented'
                    },
                    {
                        id: 'button.url',
                        type: FieldType.URL,
                        label: 'Button URL',
                        placeholder: 'https://example.com or /page',
                        required: false,
                        dependencies: ['button.text'],
                        validation: [
                            { type: 'pattern', value: '^(https?://|/|#)', message: 'URL must start with http://, https://, /, or #' }
                        ]
                    },
                    {
                        id: 'button.style',
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
                        ],
                        helpText: 'Choose a style that complements the minimal design'
                    },
                    {
                        id: 'button.size',
                        type: FieldType.SELECT,
                        label: 'Button Size',
                        required: false,
                        defaultValue: 'md',
                        options: [
                            { label: 'Small', value: 'sm' },
                            { label: 'Medium', value: 'md' },
                            { label: 'Large', value: 'lg' }
                        ],
                        helpText: 'Medium size works best for minimal design'
                    }
                ]
            },
            {
                id: 'background',
                title: 'Background',
                icon: '🎨',
                collapsible: true,
                defaultExpanded: false,
                description: 'Configure minimal background options',
                fields: [
                    {
                        id: 'background.type',
                        type: FieldType.SELECT,
                        label: 'Background Type',
                        required: true,
                        defaultValue: 'none',
                        options: [
                            { label: 'None (Clean)', value: 'none', icon: '⚪' },
                            { label: 'Subtle Color', value: 'color', icon: '🎨' },
                            { label: 'Soft Gradient', value: 'gradient', icon: '🌈' },
                            { label: 'Minimal Image', value: 'image', icon: '🖼️' }
                        ],
                        helpText: 'Keep it minimal - less is more'
                    },
                    {
                        id: 'background.color',
                        type: FieldType.COLOR,
                        label: 'Background Color',
                        required: false,
                        defaultValue: '#f8fafc',
                        dependencies: ['background.type'],
                        helpText: 'Choose a subtle, light color'
                    },
                    {
                        id: 'background.image',
                        type: FieldType.IMAGE,
                        label: 'Background Image',
                        required: false,
                        dependencies: ['background.type'],
                        helpText: 'Use a subtle, low-contrast image'
                    },
                    {
                        id: 'background.overlay.enabled',
                        type: FieldType.BOOLEAN,
                        label: 'Enable Overlay',
                        required: false,
                        defaultValue: true,
                        dependencies: ['background.type'],
                        helpText: 'Recommended for better text readability'
                    },
                    {
                        id: 'background.overlay.color',
                        type: FieldType.COLOR,
                        label: 'Overlay Color',
                        required: false,
                        defaultValue: '#ffffff',
                        dependencies: ['background.overlay.enabled'],
                        helpText: 'Light overlay for minimal aesthetic'
                    },
                    {
                        id: 'background.overlay.opacity',
                        type: FieldType.SLIDER,
                        label: 'Overlay Opacity',
                        required: false,
                        defaultValue: 0.8,
                        min: 0,
                        max: 1,
                        step: 0.1,
                        dependencies: ['background.overlay.enabled'],
                        helpText: 'High opacity maintains minimal look'
                    }
                ]
            }
        ] as EditorSection[],
        validation: [],
        dependencies: [
            {
                field: 'button.url',
                dependsOn: 'button.text',
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
                field: 'background.overlay.enabled',
                dependsOn: 'background.type',
                condition: 'not-equals',
                value: 'none',
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
    const PreviewWrapper = (previewProps: HeroMinimalProps & { isPreview?: boolean; previewMode?: 'mobile' | 'tablet' | 'desktop' }) => (
        <HeroMinimalPreview {...previewProps} />
    )

    return (
        <BaseHeroEditor
            {...props}
            schema={editorSchema}
            previewComponent={PreviewWrapper}
        />
    )
}

export default HeroMinimalEditor