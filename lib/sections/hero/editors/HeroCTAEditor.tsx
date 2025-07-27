'use client'

import React from 'react'
import {
    HeroEditorProps,
    HeroCTAProps,
    FieldType,
    EditorSection
} from '../types'
import { BaseHeroEditor } from './BaseHeroEditor'
import { HeroCTAPreview } from '../previews/HeroCTAPreview'

/**
 * Hero CTA Editor Component
 * 
 * Specialized editor for the CTA hero section variant with:
 * - Title, subtitle, and description configuration
 * - Primary and secondary button settings with emphasis on conversion
 * - Urgency text configuration for creating urgency
 * - Benefits list management for social proof
 * - Layout options (center vs split)
 * - Background configuration optimized for conversion
 * - A/B testing support for CTA variations
 */
export function HeroCTAEditor(props: HeroEditorProps<HeroCTAProps>) {
    // Define editor schema for CTA hero
    const editorSchema = {
        sections: [
            {
                id: 'content',
                title: 'Content',
                icon: '📝',
                collapsible: false,
                defaultExpanded: true,
                description: 'Configure the main content and messaging',
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
                        ],
                        helpText: 'Make it compelling and action-oriented (e.g., "Get Results in 30 Days")'
                    },
                    {
                        id: 'subtitle.text',
                        type: FieldType.TEXT,
                        label: 'Subtitle',
                        placeholder: 'Enter a supporting subtitle',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 120, message: 'Subtitle should be under 120 characters' }
                        ],
                        helpText: 'Reinforce your value proposition'
                    },
                    {
                        id: 'description.text',
                        type: FieldType.TEXTAREA,
                        label: 'Description',
                        placeholder: 'Explain the value and benefits',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 300, message: 'Keep description concise for better conversion' }
                        ],
                        helpText: 'Focus on benefits, not features'
                    },
                    {
                        id: 'urgencyText.text',
                        type: FieldType.TEXT,
                        label: 'Urgency Text',
                        placeholder: 'Limited Time Offer - 50% Off!',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 60, message: 'Keep urgency text short and punchy' }
                        ],
                        helpText: 'Create urgency to drive immediate action (optional)'
                    },
                    {
                        id: 'layout',
                        type: FieldType.SELECT,
                        label: 'Layout Style',
                        required: true,
                        defaultValue: 'center',
                        options: [
                            { label: 'Centered', value: 'center', icon: '🎯' },
                            { label: 'Split Layout', value: 'split', icon: '📱' }
                        ],
                        helpText: 'Choose between centered focus or split layout with benefits sidebar'
                    }
                ]
            },
            {
                id: 'cta-buttons',
                title: 'Call-to-Action Buttons',
                icon: '🚀',
                collapsible: true,
                defaultExpanded: true,
                description: 'Configure your conversion-focused buttons',
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
                        ],
                        helpText: 'Use action words like "Get", "Start", "Join", "Download"'
                    },
                    {
                        id: 'primaryButton.url',
                        type: FieldType.URL,
                        label: 'Primary CTA URL',
                        placeholder: '/signup or https://example.com/signup',
                        required: true,
                        validation: [
                            { type: 'required', message: 'Primary CTA URL is required' },
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
                            { label: 'Primary (Recommended)', value: 'primary' },
                            { label: 'Secondary', value: 'secondary' }
                        ],
                        helpText: 'Primary style is recommended for maximum conversion'
                    },
                    {
                        id: 'primaryButton.size',
                        type: FieldType.SELECT,
                        label: 'Primary Button Size',
                        required: false,
                        defaultValue: 'xl',
                        options: [
                            { label: 'Large', value: 'lg' },
                            { label: 'Extra Large (Recommended)', value: 'xl' }
                        ],
                        helpText: 'Larger buttons typically convert better'
                    },
                    {
                        id: 'secondaryButton.text',
                        type: FieldType.TEXT,
                        label: 'Secondary CTA Text',
                        placeholder: 'Learn More',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 25, message: 'Keep secondary CTA text short' }
                        ],
                        helpText: 'Optional secondary action (e.g., "Watch Demo", "Learn More")'
                    },
                    {
                        id: 'secondaryButton.url',
                        type: FieldType.URL,
                        label: 'Secondary CTA URL',
                        placeholder: '/demo or https://example.com/demo',
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
                            { label: 'Outline (Recommended)', value: 'outline' },
                            { label: 'Ghost', value: 'ghost' },
                            { label: 'Link', value: 'link' }
                        ]
                    }
                ]
            },
            {
                id: 'benefits',
                title: 'Benefits & Social Proof',
                icon: '✅',
                collapsible: true,
                defaultExpanded: true,
                description: 'Add benefits to increase conversion',
                fields: [
                    {
                        id: 'showBenefits',
                        type: FieldType.BOOLEAN,
                        label: 'Show Benefits List',
                        required: false,
                        defaultValue: true,
                        helpText: 'Display key benefits to reinforce value proposition'
                    },
                    {
                        id: 'benefits',
                        type: FieldType.REPEATER,
                        label: 'Benefits',
                        placeholder: 'Add benefit',
                        required: false,
                        dependencies: ['showBenefits'],
                        helpText: 'List 3-5 key benefits. Focus on outcomes, not features.',
                        validation: [
                            { type: 'maxLength', value: 80, message: 'Each benefit should be under 80 characters' }
                        ]
                    }
                ]
            },
            {
                id: 'background',
                title: 'Background & Design',
                icon: '🎨',
                collapsible: true,
                defaultExpanded: false,
                description: 'Configure the visual design for maximum impact',
                fields: [
                    {
                        id: 'background.type',
                        type: FieldType.SELECT,
                        label: 'Background Type',
                        required: true,
                        defaultValue: 'gradient',
                        options: [
                            { label: 'Gradient (Recommended)', value: 'gradient', icon: '🌈' },
                            { label: 'Solid Color', value: 'color', icon: '🎨' },
                            { label: 'Image', value: 'image', icon: '🖼️' },
                            { label: 'Video', value: 'video', icon: '🎥' }
                        ],
                        helpText: 'Gradients often perform well for CTA sections'
                    },
                    {
                        id: 'background.color',
                        type: FieldType.COLOR,
                        label: 'Background Color',
                        required: false,
                        defaultValue: '#3b82f6',
                        dependencies: ['background.type'],
                        helpText: 'Choose a color that contrasts well with your CTA button'
                    },
                    {
                        id: 'background.image',
                        type: FieldType.IMAGE,
                        label: 'Background Image',
                        required: false,
                        dependencies: ['background.type'],
                        helpText: 'Use high-quality images that support your message'
                    },
                    {
                        id: 'background.overlay.enabled',
                        type: FieldType.BOOLEAN,
                        label: 'Enable Overlay',
                        required: false,
                        defaultValue: true,
                        dependencies: ['background.type'],
                        helpText: 'Overlay improves text readability'
                    },
                    {
                        id: 'background.overlay.color',
                        type: FieldType.COLOR,
                        label: 'Overlay Color',
                        required: false,
                        defaultValue: '#000000',
                        dependencies: ['background.overlay.enabled'],
                        helpText: 'Dark overlays usually work best'
                    },
                    {
                        id: 'background.overlay.opacity',
                        type: FieldType.SLIDER,
                        label: 'Overlay Opacity',
                        required: false,
                        defaultValue: 0.5,
                        min: 0,
                        max: 1,
                        step: 0.1,
                        dependencies: ['background.overlay.enabled'],
                        helpText: 'Balance between readability and visual appeal'
                    }
                ]
            },
            {
                id: 'ab-testing',
                title: 'A/B Testing',
                icon: '🧪',
                collapsible: true,
                defaultExpanded: false,
                description: 'Configure A/B testing for optimization',
                fields: [
                    {
                        id: 'abTesting.enabled',
                        type: FieldType.BOOLEAN,
                        label: 'Enable A/B Testing',
                        required: false,
                        defaultValue: false,
                        helpText: 'Test different variations to optimize conversion'
                    },
                    {
                        id: 'abTesting.variant',
                        type: FieldType.SELECT,
                        label: 'Current Variant',
                        required: false,
                        defaultValue: 'A',
                        dependencies: ['abTesting.enabled'],
                        options: [
                            { label: 'Variant A', value: 'A' },
                            { label: 'Variant B', value: 'B' }
                        ],
                        helpText: 'Switch between variants to test different approaches'
                    },
                    {
                        id: 'abTesting.trackingId',
                        type: FieldType.TEXT,
                        label: 'Tracking ID',
                        placeholder: 'hero-cta-test-1',
                        required: false,
                        dependencies: ['abTesting.enabled'],
                        helpText: 'Unique identifier for tracking this test'
                    }
                ]
            }
        ] as EditorSection[],
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
            },
            {
                field: 'background.overlay.enabled',
                dependsOn: 'background.type',
                condition: 'not-equals',
                value: 'color',
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
            },
            {
                field: 'abTesting.variant',
                dependsOn: 'abTesting.enabled',
                condition: 'equals',
                value: true,
                action: 'show'
            },
            {
                field: 'abTesting.trackingId',
                dependsOn: 'abTesting.enabled',
                condition: 'equals',
                value: true,
                action: 'show'
            }
        ]
    }

    // Create a wrapper component that matches the expected interface
    const PreviewWrapper = (previewProps: HeroCTAProps & { isPreview?: boolean; previewMode?: 'mobile' | 'tablet' | 'desktop' }) => (
        <HeroCTAPreview {...previewProps} />
    )

    return (
        <BaseHeroEditor
            {...props}
            schema={editorSchema}
            previewComponent={PreviewWrapper}
        />
    )
}

export default HeroCTAEditor