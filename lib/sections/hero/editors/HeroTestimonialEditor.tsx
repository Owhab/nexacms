'use client'

import React from 'react'
import {
    HeroEditorProps,
    HeroTestimonialProps,
    FieldType,
    EditorSection,
    TestimonialItem
} from '../types'
import { BaseHeroEditor } from './BaseHeroEditor'
import { HeroTestimonialPreview } from '../previews/HeroTestimonialPreview'
import { Button } from '@/components/ui/button'
import { MediaPicker } from '@/components/ui/MediaPicker'
import Image from 'next/image'

/**
 * Hero Testimonial Editor Component
 * 
 * Specialized editor for the testimonial hero section variant with:
 * - Title and subtitle configuration
 * - Testimonial management (add, remove, reorder)
 * - Customer photo upload and rating settings
 * - Layout and rotation configuration
 * - Background configuration
 * - Real-time preview updates
 */
export function HeroTestimonialEditor(props: HeroEditorProps<HeroTestimonialProps>) {
    // Define editor schema for testimonial hero
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
                    }
                ]
            },
            {
                id: 'layout',
                title: 'Layout & Display',
                icon: '📐',
                collapsible: true,
                defaultExpanded: true,
                description: 'Configure how testimonials are displayed',
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
                        ],
                        helpText: 'How to display the testimonials'
                    },
                    {
                        id: 'showRatings',
                        type: FieldType.BOOLEAN,
                        label: 'Show Ratings',
                        required: false,
                        defaultValue: true,
                        helpText: 'Display star ratings for testimonials'
                    },
                    {
                        id: 'autoRotate',
                        type: FieldType.BOOLEAN,
                        label: 'Auto-rotate Testimonials',
                        required: false,
                        defaultValue: false,
                        dependencies: ['layout'],
                        helpText: 'Automatically cycle through testimonials (single/carousel only)'
                    },
                    {
                        id: 'rotationInterval',
                        type: FieldType.NUMBER,
                        label: 'Rotation Interval (seconds)',
                        required: false,
                        defaultValue: 5,
                        min: 2,
                        max: 30,
                        dependencies: ['autoRotate'],
                        helpText: 'How long to show each testimonial before rotating'
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
    }

    // Create a wrapper component that matches the expected interface
    const PreviewWrapper = (previewProps: HeroTestimonialProps & { isPreview?: boolean; previewMode?: 'mobile' | 'tablet' | 'desktop' }) => (
        <HeroTestimonialPreview {...previewProps} />
    )

    return (
        <BaseHeroEditor
            {...props}
            schema={editorSchema}
            previewComponent={PreviewWrapper}
        >
            {/* Testimonials Management Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Testimonials</h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const newTestimonial: TestimonialItem = {
                                id: `testimonial-${Date.now()}`,
                                quote: 'This product has transformed our business. Highly recommended!',
                                author: 'John Doe',
                                company: 'Example Corp',
                                role: 'CEO',
                                rating: 5
                            }
                            const updatedTestimonials = [...(props.props.testimonials || []), newTestimonial]
                            props.onChange?.({ ...props.props, testimonials: updatedTestimonials })
                        }}
                    >
                        Add Testimonial
                    </Button>
                </div>

                <div className="space-y-4">
                    {(props.props.testimonials || []).map((testimonial, index) => (
                        <TestimonialEditor
                            key={testimonial.id || index}
                            testimonial={testimonial}
                            index={index}
                            onUpdate={(updatedTestimonial) => {
                                const updatedTestimonials = [...(props.props.testimonials || [])]
                                updatedTestimonials[index] = updatedTestimonial
                                props.onChange?.({ ...props.props, testimonials: updatedTestimonials })
                            }}
                            onDelete={() => {
                                const updatedTestimonials = (props.props.testimonials || []).filter((_, i) => i !== index)
                                props.onChange?.({ ...props.props, testimonials: updatedTestimonials })
                            }}
                            onMoveUp={index > 0 ? () => {
                                const updatedTestimonials = [...(props.props.testimonials || [])]
                                const temp = updatedTestimonials[index]
                                updatedTestimonials[index] = updatedTestimonials[index - 1]
                                updatedTestimonials[index - 1] = temp
                                props.onChange?.({ ...props.props, testimonials: updatedTestimonials })
                            } : undefined}
                            onMoveDown={index < (props.props.testimonials || []).length - 1 ? () => {
                                const updatedTestimonials = [...(props.props.testimonials || [])]
                                const temp = updatedTestimonials[index]
                                updatedTestimonials[index] = updatedTestimonials[index + 1]
                                updatedTestimonials[index + 1] = temp
                                props.onChange?.({ ...props.props, testimonials: updatedTestimonials })
                            } : undefined}
                        />
                    ))}
                </div>

                {(props.props.testimonials || []).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>No testimonials added yet.</p>
                        <p className="text-sm">Click &quot;Add Testimonial&quot; to get started.</p>
                    </div>
                )}
            </div>
        </BaseHeroEditor>
    )
}

/**
 * Individual Testimonial Editor Component
 */
interface TestimonialEditorProps {
    testimonial: TestimonialItem
    index: number
    onUpdate: (testimonial: TestimonialItem) => void
    onDelete: () => void
    onMoveUp?: () => void
    onMoveDown?: () => void
}

function TestimonialEditor({
    testimonial,
    index,
    onUpdate,
    onDelete,
    onMoveUp,
    onMoveDown
}: TestimonialEditorProps) {
    const [isExpanded, setIsExpanded] = React.useState(false)

    const handleFieldChange = (field: keyof TestimonialItem, value: any) => {
        onUpdate({ ...testimonial, [field]: value })
    }

    return (
        <div className="border rounded-lg p-4 space-y-4">
            {/* Testimonial Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        {testimonial.avatar ? (
                            <Image
                                src={testimonial.avatar.url}
                                alt={testimonial.avatar.alt || `${testimonial.author} avatar`}
                                className="w-10 h-10 rounded-full object-cover"
                                width={testimonial.avatar.width || 40}
                                height={testimonial.avatar.height || 40}
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-500 text-sm">👤</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900">
                            {testimonial.author || `Testimonial ${index + 1}`}
                        </h4>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                            {testimonial.quote ? `"${testimonial.quote.substring(0, 50)}..."` : 'No quote'}
                        </p>
                        {testimonial.rating && (
                            <div className="flex items-center space-x-1 mt-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <span
                                        key={i}
                                        className={`text-sm ${
                                            i < testimonial.rating!
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        )}
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
                        title="Delete testimonial"
                    >
                        ×
                    </Button>
                </div>
            </div>

            {/* Testimonial Fields (Expanded) */}
            {isExpanded && (
                <div className="space-y-4 pt-4 border-t">
                    {/* Quote */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Quote <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={testimonial.quote || ''}
                            onChange={(e) => handleFieldChange('quote', e.target.value)}
                            placeholder="Enter the testimonial quote"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <p className="text-sm text-gray-500">
                            The main testimonial text from the customer
                        </p>
                    </div>

                    {/* Author */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Author Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={testimonial.author || ''}
                            onChange={(e) => handleFieldChange('author', e.target.value)}
                            placeholder="Customer name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Company
                        </label>
                        <input
                            type="text"
                            value={testimonial.company || ''}
                            onChange={(e) => handleFieldChange('company', e.target.value)}
                            placeholder="Company name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Role/Title
                        </label>
                        <input
                            type="text"
                            value={testimonial.role || ''}
                            onChange={(e) => handleFieldChange('role', e.target.value)}
                            placeholder="Job title or role"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Rating */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Rating (1-5 stars)
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="1"
                                value={testimonial.rating || 5}
                                onChange={(e) => handleFieldChange('rating', parseInt(e.target.value))}
                                className="flex-1"
                            />
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <span
                                        key={i}
                                        className={`text-lg cursor-pointer ${
                                            i < (testimonial.rating || 5)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                        onClick={() => handleFieldChange('rating', i + 1)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="text-sm text-gray-500 min-w-[2rem]">
                                {testimonial.rating || 5}/5
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">
                            Star rating for this testimonial
                        </p>
                    </div>

                    {/* Avatar */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Customer Photo
                        </label>
                        <MediaPicker
                            value={testimonial.avatar ? {
                                id: testimonial.avatar.id || 'testimonial-avatar',
                                url: testimonial.avatar.url,
                                type: 'IMAGE' as const,
                                fileName: testimonial.avatar.alt || 'testimonial-avatar',
                                fileSize: 0,
                                mimeType: 'image/*'
                            } : undefined}
                            onChange={(media) => {
                                if (media && !Array.isArray(media)) {
                                    handleFieldChange('avatar', {
                                        id: media.id,
                                        url: media.url,
                                        type: 'image',
                                        alt: `${testimonial.author} avatar`,
                                        objectFit: 'cover',
                                        loading: 'lazy'
                                    })
                                } else {
                                    handleFieldChange('avatar', undefined)
                                }
                            }}
                            accept="image/*"
                            type="IMAGE"
                            placeholder="Select customer photo"
                        />
                        <p className="text-sm text-gray-500">
                            Optional photo of the customer giving the testimonial
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HeroTestimonialEditor