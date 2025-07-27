'use client'

import React from 'react'
import {
    HeroEditorProps,
    HeroFeatureProps,
    FieldType,
    EditorSection,
    FeatureItem
} from '../types'
import { BaseHeroEditor } from './BaseHeroEditor'
import { HeroFeaturePreview } from '../previews/HeroFeaturePreview'
import { Button } from '@/components/ui/button'
import { MediaPicker } from '@/components/ui/MediaPicker'

/**
 * Hero Feature Editor Component
 * 
 * Specialized editor for the feature hero section variant with:
 * - Title, subtitle, and description configuration
 * - Feature list management (add, remove, reorder)
 * - Icon selection and image upload for features
 * - Layout and column configuration
 * - Background configuration
 * - Real-time preview updates
 */
export function HeroFeatureEditor(props: HeroEditorProps<HeroFeatureProps>) {
    // Define editor schema for feature hero
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
                    }
                ]
            },
            {
                id: 'layout',
                title: 'Layout',
                icon: '📐',
                collapsible: true,
                defaultExpanded: true,
                description: 'Configure how features are displayed',
                fields: [
                    {
                        id: 'layout',
                        type: FieldType.SELECT,
                        label: 'Layout Style',
                        required: true,
                        defaultValue: 'grid',
                        options: [
                            { label: 'Grid', value: 'grid', icon: '⊞' },
                            { label: 'List', value: 'list', icon: '☰' },
                            { label: 'Carousel', value: 'carousel', icon: '⟷' }
                        ],
                        helpText: 'How to display the features'
                    },
                    {
                        id: 'columns',
                        type: FieldType.SELECT,
                        label: 'Columns (Grid only)',
                        required: false,
                        defaultValue: 3,
                        options: [
                            { label: '2 Columns', value: 2 },
                            { label: '3 Columns', value: 3 },
                            { label: '4 Columns', value: 4 }
                        ],
                        dependencies: ['layout'],
                        helpText: 'Number of columns for grid layout'
                    }
                ]
            },
            {
                id: 'button',
                title: 'Call-to-Action Button',
                icon: '🔘',
                collapsible: true,
                defaultExpanded: false,
                description: 'Configure your primary action button',
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
                        dependencies: ['primaryButton.text'],
                        validation: [
                            { type: 'pattern', value: '^(https?://|/|#)', message: 'URL must start with http://, https://, /, or #' }
                        ]
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
                    },
                    {
                        id: 'primaryButton.size',
                        type: FieldType.SELECT,
                        label: 'Button Size',
                        required: false,
                        defaultValue: 'lg',
                        options: [
                            { label: 'Small', value: 'sm' },
                            { label: 'Medium', value: 'md' },
                            { label: 'Large', value: 'lg' },
                            { label: 'Extra Large', value: 'xl' }
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
                field: 'columns',
                dependsOn: 'layout',
                condition: 'equals',
                value: 'grid',
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
    }

    // Create a wrapper component that matches the expected interface
    const PreviewWrapper = (previewProps: HeroFeatureProps & { isPreview?: boolean; previewMode?: 'mobile' | 'tablet' | 'desktop' }) => (
        <HeroFeaturePreview {...previewProps} />
    )

    return (
        <BaseHeroEditor
            {...props}
            schema={editorSchema}
            previewComponent={PreviewWrapper}
        >
            {/* Features Management Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Features</h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const newFeature: FeatureItem = {
                                id: `feature-${Date.now()}`,
                                icon: '✨',
                                title: 'New Feature',
                                description: 'Feature description'
                            }
                            const updatedFeatures = [...(props.props.features || []), newFeature]
                            props.onChange?.({ ...props.props, features: updatedFeatures })
                        }}
                    >
                        Add Feature
                    </Button>
                </div>

                <div className="space-y-4">
                    {(props.props.features || []).map((feature, index) => (
                        <FeatureEditor
                            key={feature.id || index}
                            feature={feature}
                            index={index}
                            onUpdate={(updatedFeature) => {
                                const updatedFeatures = [...(props.props.features || [])]
                                updatedFeatures[index] = updatedFeature
                                props.onChange?.({ ...props.props, features: updatedFeatures })
                            }}
                            onDelete={() => {
                                const updatedFeatures = (props.props.features || []).filter((_, i) => i !== index)
                                props.onChange?.({ ...props.props, features: updatedFeatures })
                            }}
                            onMoveUp={index > 0 ? () => {
                                const updatedFeatures = [...(props.props.features || [])]
                                const temp = updatedFeatures[index]
                                updatedFeatures[index] = updatedFeatures[index - 1]
                                updatedFeatures[index - 1] = temp
                                props.onChange?.({ ...props.props, features: updatedFeatures })
                            } : undefined}
                            onMoveDown={index < (props.props.features || []).length - 1 ? () => {
                                const updatedFeatures = [...(props.props.features || [])]
                                const temp = updatedFeatures[index]
                                updatedFeatures[index] = updatedFeatures[index + 1]
                                updatedFeatures[index + 1] = temp
                                props.onChange?.({ ...props.props, features: updatedFeatures })
                            } : undefined}
                        />
                    ))}
                </div>

                {(props.props.features || []).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>No features added yet.</p>
                        <p className="text-sm">Click &quot;Add Feature&quot; to get started.</p>
                    </div>
                )}
            </div>
        </BaseHeroEditor>
    )
}

/**
 * Individual Feature Editor Component
 */
interface FeatureEditorProps {
    feature: FeatureItem
    index: number
    onUpdate: (feature: FeatureItem) => void
    onDelete: () => void
    onMoveUp?: () => void
    onMoveDown?: () => void
}

function FeatureEditor({
    feature,
    index,
    onUpdate,
    onDelete,
    onMoveUp,
    onMoveDown
}: FeatureEditorProps) {
    const [isExpanded, setIsExpanded] = React.useState(false)

    const handleFieldChange = (field: keyof FeatureItem, value: any) => {
        onUpdate({ ...feature, [field]: value })
    }

    return (
        <div className="border rounded-lg p-4 space-y-4">
            {/* Feature Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <span className="text-lg">{feature.icon || '✨'}</span>
                    <div>
                        <h4 className="font-medium text-gray-900">
                            {feature.title || `Feature ${index + 1}`}
                        </h4>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                            {feature.description || 'No description'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Reorder buttons */}
                    {onMoveUp && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onMoveUp}
                            title="Move up"
                        >
                            ↑
                        </Button>
                    )}
                    {onMoveDown && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onMoveDown}
                            title="Move down"
                        >
                            ↓
                        </Button>
                    )}

                    {/* Expand/Collapse */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? '−' : '+'}
                    </Button>

                    {/* Delete */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        className="text-red-600 hover:text-red-700"
                        title="Delete feature"
                    >
                        ×
                    </Button>
                </div>
            </div>

            {/* Feature Fields (Expanded) */}
            {isExpanded && (
                <div className="space-y-4 pt-4 border-t">
                    {/* Icon */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Icon
                        </label>
                        <input
                            type="text"
                            value={feature.icon || ''}
                            onChange={(e) => handleFieldChange('icon', e.target.value)}
                            placeholder="✨ (emoji or icon)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500">
                            Use an emoji or icon character
                        </p>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={feature.title || ''}
                            onChange={(e) => handleFieldChange('title', e.target.value)}
                            placeholder="Feature title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            value={feature.description || ''}
                            onChange={(e) => handleFieldChange('description', e.target.value)}
                            placeholder="Feature description"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Image */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Image (Optional)
                        </label>
                        <MediaPicker
                            value={feature.image ? {
                                id: feature.image.id || 'feature-image',
                                url: feature.image.url,
                                type: 'IMAGE' as const,
                                fileName: feature.image.alt || 'feature-image',
                                fileSize: 0,
                                mimeType: 'image/*'
                            } : undefined}
                            onChange={(media) => {
                                if (media && !Array.isArray(media)) {
                                    handleFieldChange('image', {
                                        id: media.id,
                                        url: media.url,
                                        type: 'image',
                                        alt: feature.title || 'Feature image',
                                        objectFit: 'cover',
                                        loading: 'lazy'
                                    })
                                } else {
                                    handleFieldChange('image', undefined)
                                }
                            }}
                            accept="image/*"
                            type="IMAGE"
                            placeholder="Select feature image"
                        />
                        <p className="text-sm text-gray-500">
                            Optional image to display instead of or alongside the icon
                        </p>
                    </div>

                    {/* Link */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Link (Optional)
                        </label>
                        <input
                            type="url"
                            value={feature.link || ''}
                            onChange={(e) => handleFieldChange('link', e.target.value)}
                            placeholder="https://example.com or /page"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500">
                            Optional link to make the feature clickable
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HeroFeatureEditor