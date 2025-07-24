'use client'

import React from 'react'
import {
    HeroEditorProps,
    HeroVideoProps,
    FieldType,
    EditorSection
} from '../types'
import { BaseHeroEditor } from './BaseHeroEditor'
import { HeroVideoPreview } from '../previews/HeroVideoPreview'

/**
 * Hero Video Editor Component
 * 
 * Specialized editor for the video hero section variant with:
 * - Video upload and configuration
 * - Fallback image/poster settings
 * - Video playback controls (autoplay, loop, muted)
 * - Overlay configuration (color, opacity)
 * - Content positioning and styling
 * - Performance optimization settings
 * - Real-time preview updates
 */
export function HeroVideoEditor(props: HeroEditorProps<HeroVideoProps>) {
    // Define editor schema for video hero
    const editorSchema = {
        sections: [
            {
                id: 'video',
                title: 'Video Settings',
                icon: '🎥',
                collapsible: false,
                defaultExpanded: true,
                description: 'Configure your background video and playback settings',
                fields: [
                    {
                        id: 'video.url',
                        type: FieldType.VIDEO,
                        label: 'Background Video',
                        placeholder: 'Upload or select a video file',
                        required: true,
                        validation: [
                            { type: 'required', message: 'Background video is required' }
                        ],
                        helpText: 'MP4 format recommended for best compatibility. Keep file size under 50MB for optimal performance.'
                    },
                    {
                        id: 'video.poster',
                        type: FieldType.IMAGE,
                        label: 'Video Poster (Fallback Image)',
                        placeholder: 'Upload a poster image',
                        required: false,
                        helpText: 'Shown while video is loading or if video fails to load. Should match video dimensions.'
                    },
                    {
                        id: 'video.autoplay',
                        type: FieldType.BOOLEAN,
                        label: 'Autoplay Video',
                        required: false,
                        defaultValue: true,
                        helpText: 'Video will start playing automatically when page loads. Note: Most browsers require muted videos for autoplay.'
                    },
                    {
                        id: 'video.loop',
                        type: FieldType.BOOLEAN,
                        label: 'Loop Video',
                        required: false,
                        defaultValue: true,
                        helpText: 'Video will restart automatically when it reaches the end.'
                    },
                    {
                        id: 'video.muted',
                        type: FieldType.BOOLEAN,
                        label: 'Mute Video',
                        required: false,
                        defaultValue: true,
                        helpText: 'Video will play without sound. Required for autoplay in most browsers.'
                    },
                    {
                        id: 'video.controls',
                        type: FieldType.BOOLEAN,
                        label: 'Show Video Controls',
                        required: false,
                        defaultValue: false,
                        helpText: 'Display custom play/pause and mute/unmute controls over the video.'
                    },
                    {
                        id: 'video.objectFit',
                        type: FieldType.SELECT,
                        label: 'Video Fit',
                        required: false,
                        defaultValue: 'cover',
                        options: [
                            { label: 'Cover (Fill)', value: 'cover', icon: '📐' },
                            { label: 'Contain (Fit)', value: 'contain', icon: '🔲' },
                            { label: 'Fill (Stretch)', value: 'fill', icon: '↔️' },
                            { label: 'None', value: 'none', icon: '⚪' }
                        ],
                        helpText: 'How the video should be sized within the container.'
                    }
                ]
            },
            {
                id: 'overlay',
                title: 'Video Overlay',
                icon: '🎨',
                collapsible: true,
                defaultExpanded: true,
                description: 'Add a color overlay to improve text readability',
                fields: [
                    {
                        id: 'overlay.enabled',
                        type: FieldType.BOOLEAN,
                        label: 'Enable Overlay',
                        required: false,
                        defaultValue: true,
                        helpText: 'Add a semi-transparent color overlay to make text more readable.'
                    },
                    {
                        id: 'overlay.color',
                        type: FieldType.COLOR,
                        label: 'Overlay Color',
                        required: false,
                        defaultValue: '#000000',
                        dependencies: ['overlay.enabled'],
                        helpText: 'Color of the overlay. Dark colors work best for text readability.'
                    },
                    {
                        id: 'overlay.opacity',
                        type: FieldType.SLIDER,
                        label: 'Overlay Opacity',
                        required: false,
                        defaultValue: 0.4,
                        min: 0,
                        max: 1,
                        step: 0.1,
                        dependencies: ['overlay.enabled'],
                        helpText: 'Transparency of the overlay. 0 = transparent, 1 = completely opaque.'
                    }
                ]
            },
            {
                id: 'content',
                title: 'Content',
                icon: '📝',
                collapsible: true,
                defaultExpanded: true,
                description: 'Configure the text and buttons displayed over the video',
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
                        helpText: 'Main headline displayed over the video'
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
                            { type: 'maxLength', value: 300, message: 'Description must be less than 300 characters' }
                        ],
                        helpText: 'Additional details about your offering. Keep it concise for video backgrounds.'
                    },
                    {
                        id: 'content.position',
                        type: FieldType.SELECT,
                        label: 'Content Position',
                        required: true,
                        defaultValue: 'center',
                        options: [
                            { label: 'Center', value: 'center', icon: '⊙' },
                            { label: 'Top Left', value: 'top-left', icon: '↖️' },
                            { label: 'Top Right', value: 'top-right', icon: '↗️' },
                            { label: 'Bottom Left', value: 'bottom-left', icon: '↙️' },
                            { label: 'Bottom Right', value: 'bottom-right', icon: '↘️' }
                        ],
                        helpText: 'Where to position the content over the video'
                    }
                ]
            },
            {
                id: 'buttons',
                title: 'Call-to-Action Buttons',
                icon: '🔘',
                collapsible: true,
                defaultExpanded: false,
                description: 'Configure action buttons displayed over the video',
                fields: [
                    {
                        id: 'content.buttons.0.text',
                        type: FieldType.TEXT,
                        label: 'Primary Button Text',
                        placeholder: 'Watch Demo',
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
                            { label: 'Ghost', value: 'ghost' }
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
                        id: 'content.buttons.0.icon',
                        type: FieldType.TEXT,
                        label: 'Primary Button Icon',
                        placeholder: '▶️ (emoji or icon)',
                        required: false,
                        helpText: 'Optional icon to display with the button text'
                    },
                    {
                        id: 'content.buttons.0.iconPosition',
                        type: FieldType.SELECT,
                        label: 'Icon Position',
                        required: false,
                        defaultValue: 'left',
                        options: [
                            { label: 'Left', value: 'left' },
                            { label: 'Right', value: 'right' }
                        ],
                        dependencies: ['content.buttons.0.icon']
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
                            { label: 'Ghost', value: 'ghost' }
                        ]
                    }
                ]
            },
            {
                id: 'performance',
                title: 'Performance & Accessibility',
                icon: '⚡',
                collapsible: true,
                defaultExpanded: false,
                description: 'Optimize video performance and accessibility',
                fields: [
                    {
                        id: 'video.loading',
                        type: FieldType.SELECT,
                        label: 'Video Loading',
                        required: false,
                        defaultValue: 'eager',
                        options: [
                            { label: 'Eager (Load immediately)', value: 'eager' },
                            { label: 'Lazy (Load when needed)', value: 'lazy' }
                        ],
                        helpText: 'When to start loading the video. Eager is recommended for hero videos.'
                    },
                    {
                        id: 'video.alt',
                        type: FieldType.TEXT,
                        label: 'Video Description',
                        placeholder: 'Describe what happens in the video',
                        required: false,
                        helpText: 'Accessibility description for screen readers'
                    }
                ]
            }
        ] as EditorSection[],
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
            },
            {
                field: 'content.buttons.0.url',
                dependsOn: 'content.buttons.0.text',
                condition: 'not-equals',
                value: '',
                action: 'show'
            },
            {
                field: 'content.buttons.0.iconPosition',
                dependsOn: 'content.buttons.0.icon',
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
            }
        ]
    }

    // Create a wrapper component that matches the expected interface
    const PreviewWrapper = ({ props: previewProps }: { props: HeroVideoProps }) => (
        <HeroVideoPreview {...previewProps} />
    )

    return (
        <BaseHeroEditor
            {...props}
            schema={editorSchema}
            previewComponent={PreviewWrapper}
        />
    )
}

export default HeroVideoEditor