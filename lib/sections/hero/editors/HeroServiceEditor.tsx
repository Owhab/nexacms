'use client'

import React from 'react'
import {
    HeroEditorProps,
    HeroServiceProps,
    FieldType,
    EditorSection,
    ServiceItem,
    TrustBadge,
    MediaConfig
} from '../types'
import { BaseHeroEditor } from './BaseHeroEditor'
import { HeroServicePreview } from '../previews/HeroServicePreview'
import { Button } from '@/components/ui/button'
import { MediaPicker } from '@/components/ui/MediaPicker'
import Image from 'next/image'

/**
 * Hero Service Editor Component
 * 
 * Specialized editor for the service hero section variant with:
 * - Service highlights management (add, remove, reorder)
 * - Trust badges upload and configuration
 * - Contact integration settings
 * - Layout and display options
 * - Value proposition configuration
 * - Real-time preview updates
 */
export function HeroServiceEditor(props: HeroEditorProps<HeroServiceProps>) {
    // Define editor schema for service hero
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
                        label: 'Title',
                        placeholder: 'Professional Services That Drive Results',
                        required: true,
                        validation: [
                            { type: 'required', message: 'Title is required' },
                            { type: 'maxLength', value: 100, message: 'Title must be less than 100 characters' }
                        ],
                        helpText: 'Main headline for your service offering'
                    },
                    {
                        id: 'subtitle.text',
                        type: FieldType.TEXT,
                        label: 'Subtitle',
                        placeholder: 'Expert solutions tailored to your business needs',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 150, message: 'Subtitle must be less than 150 characters' }
                        ],
                        helpText: 'Supporting headline that complements the main title'
                    },
                    {
                        id: 'description.text',
                        type: FieldType.TEXTAREA,
                        label: 'Description',
                        placeholder: 'We provide comprehensive services designed to help your business grow and succeed in today\'s competitive market.',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 500, message: 'Description must be less than 500 characters' }
                        ],
                        helpText: 'Detailed description of your services and value proposition'
                    }
                ]
            },
            {
                id: 'layout',
                title: 'Layout',
                icon: '📐',
                collapsible: true,
                defaultExpanded: true,
                description: 'Configure the layout and display options',
                fields: [
                    {
                        id: 'layout',
                        type: FieldType.SELECT,
                        label: 'Services Layout',
                        required: true,
                        defaultValue: 'grid',
                        options: [
                            { label: 'Grid Layout', value: 'grid', icon: '⊞' },
                            { label: 'List Layout', value: 'list', icon: '☰' }
                        ],
                        helpText: 'How to display your services'
                    },
                    {
                        id: 'showTrustBadges',
                        type: FieldType.BOOLEAN,
                        label: 'Show Trust Badges',
                        required: false,
                        defaultValue: true,
                        helpText: 'Display trust badges and partner logos'
                    }
                ]
            },
            {
                id: 'buttons',
                title: 'Action Buttons',
                icon: '🔘',
                collapsible: true,
                defaultExpanded: true,
                description: 'Configure your call-to-action buttons',
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
                    },
                    {
                        id: 'contactButton.style',
                        type: FieldType.SELECT,
                        label: 'Contact Button Style',
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
                        defaultValue: 'color',
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
    const PreviewWrapper = (previewProps: HeroServiceProps & { isPreview?: boolean; previewMode?: 'mobile' | 'tablet' | 'desktop' }) => (
        <HeroServicePreview {...previewProps} />
    )

    return (
        <BaseHeroEditor
            {...props}
            schema={editorSchema}
            previewComponent={PreviewWrapper}
        >
            {/* Services Management Section */}
            <div className="space-y-6">
                <ServicesEditor
                    services={props.props.services || []}
                    onChange={(updatedServices) => {
                        props.onChange?.({ ...props.props, services: updatedServices })
                    }}
                />

                <TrustBadgesEditor
                    trustBadges={props.props.trustBadges || []}
                    onChange={(updatedTrustBadges) => {
                        props.onChange?.({ ...props.props, trustBadges: updatedTrustBadges })
                    }}
                />
            </div>
        </BaseHeroEditor>
    )
}

/**
 * Services Editor Component
 */
interface ServicesEditorProps {
    services: ServiceItem[]
    onChange: (services: ServiceItem[]) => void
}

function ServicesEditor({ services, onChange }: ServicesEditorProps) {
    const [isExpanded, setIsExpanded] = React.useState(true)

    const handleServiceAdd = () => {
        const newService: ServiceItem = {
            id: `service-${Date.now()}`,
            title: '',
            description: '',
            features: []
        }
        onChange([...services, newService])
    }

    const handleServiceUpdate = (index: number, updatedService: ServiceItem) => {
        const updatedServices = [...services]
        updatedServices[index] = updatedService
        onChange(updatedServices)
    }

    const handleServiceRemove = (index: number) => {
        const updatedServices = services.filter((_, i) => i !== index)
        onChange(updatedServices)
    }

    const handleServiceReorder = (fromIndex: number, toIndex: number) => {
        const updatedServices = [...services]
        const [movedService] = updatedServices.splice(fromIndex, 1)
        updatedServices.splice(toIndex, 0, movedService)
        onChange(updatedServices)
    }

    return (
        <div className="border rounded-lg p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Services</h3>
                <div className="flex items-center space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleServiceAdd}
                    >
                        Add Service
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? '−' : '+'}
                    </Button>
                </div>
            </div>

            {/* Services List */}
            {isExpanded && (
                <div className="space-y-4 pt-4 border-t">
                    {services.length > 0 ? (
                        services.map((service, index) => (
                            <ServiceItemEditor
                                key={service.id || index}
                                service={service}
                                index={index}
                                totalServices={services.length}
                                onUpdate={(updatedService) => handleServiceUpdate(index, updatedService)}
                                onRemove={() => handleServiceRemove(index)}
                                onMoveUp={index > 0 ? () => handleServiceReorder(index, index - 1) : undefined}
                                onMoveDown={index < services.length - 1 ? () => handleServiceReorder(index, index + 1) : undefined}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                            <p>No services added yet.</p>
                            <p className="text-sm">Click &quot;Add Service&quot; to get started.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

/**
 * Service Item Editor Component
 */
interface ServiceItemEditorProps {
    service: ServiceItem
    index: number
    totalServices: number
    onUpdate: (service: ServiceItem) => void
    onRemove: () => void
    onMoveUp?: () => void
    onMoveDown?: () => void
}

function ServiceItemEditor({
    service,
    index,
    totalServices,
    onUpdate,
    onRemove,
    onMoveUp,
    onMoveDown
}: ServiceItemEditorProps) {
    const [isExpanded, setIsExpanded] = React.useState(index === 0)

    const handleFieldChange = (field: keyof ServiceItem, value: any) => {
        onUpdate({ ...service, [field]: value })
    }

    const handleImageAdd = (media: any) => {
        if (media && !Array.isArray(media)) {
            const newImage: MediaConfig = {
                id: media.id,
                url: media.url,
                type: 'image',
                alt: service.title || 'Service image',
                objectFit: 'cover',
                loading: 'lazy'
            }
            handleFieldChange('image', newImage)
        }
    }

    const handleFeatureAdd = () => {
        const updatedFeatures = [...(service.features || []), '']
        handleFieldChange('features', updatedFeatures)
    }

    const handleFeatureChange = (featureIndex: number, value: string) => {
        const updatedFeatures = [...(service.features || [])]
        updatedFeatures[featureIndex] = value
        handleFieldChange('features', updatedFeatures)
    }

    const handleFeatureRemove = (featureIndex: number) => {
        const updatedFeatures = (service.features || []).filter((_, i) => i !== featureIndex)
        handleFieldChange('features', updatedFeatures)
    }

    return (
        <div className="border rounded-lg p-4 space-y-4">
            {/* Service Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">Service {index + 1}</span>
                    {service.title && (
                        <span className="text-sm text-gray-700">- {service.title}</span>
                    )}
                </div>
                <div className="flex items-center space-x-1">
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
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? '−' : '+'}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onRemove}
                        className="text-red-600 hover:text-red-700"
                    >
                        ×
                    </Button>
                </div>
            </div>

            {/* Service Fields */}
            {isExpanded && (
                <div className="space-y-4 pt-4 border-t">
                    {/* Service Title */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Service Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={service.title || ''}
                            onChange={(e) => handleFieldChange('title', e.target.value)}
                            placeholder="Enter service title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Service Description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            value={service.description || ''}
                            onChange={(e) => handleFieldChange('description', e.target.value)}
                            placeholder="Enter service description"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Service Icon */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Icon (Emoji)
                        </label>
                        <input
                            type="text"
                            value={service.icon || ''}
                            onChange={(e) => handleFieldChange('icon', e.target.value)}
                            placeholder="🚀 (Enter an emoji)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500">
                            Enter an emoji to represent this service
                        </p>
                    </div>

                    {/* Service Image */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Service Image (Optional)
                        </label>
                        <div className="flex items-center space-x-4">
                            <MediaPicker
                                value={service.image ? {
                                    id: service.image.id,
                                    url: service.image.url,
                                    type: service.image.type === 'image' ? 'IMAGE' as const : 'VIDEO' as const,
                                    fileName: service.image.alt || 'service-image',
                                    fileSize: 0,
                                    mimeType: 'image/jpeg',
                                    altText: service.image.alt
                                } : undefined}
                                onChange={handleImageAdd}
                                accept="image/*"
                                type="IMAGE"
                                placeholder="Select Image"
                            />
                            {service.image && (
                                <div className="flex items-center space-x-2">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                        <Image
                                            src={service.image.url}
                                            alt={service.image.alt || 'Service image'}
                                            className="w-full h-full object-cover"
                                            width={service.image.width || 48}
                                            height={service.image.height || 48}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleFieldChange('image', undefined)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Service Features */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                                Service Features
                            </label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleFeatureAdd}
                            >
                                Add Feature
                            </Button>
                        </div>

                        {service.features && service.features.length > 0 ? (
                            <div className="space-y-2">
                                {service.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-center space-x-2">
                                        <span className="text-primary">✓</span>
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(featureIndex, e.target.value)}
                                            placeholder="Enter feature description"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleFeatureRemove(featureIndex)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <p>No features added yet.</p>
                                <p className="text-sm">Click &quot;Add Feature&quot; to get started.</p>
                            </div>
                        )}
                    </div>

                    {/* Service Link */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Service Link (Optional)
                        </label>
                        <input
                            type="url"
                            value={service.link || ''}
                            onChange={(e) => handleFieldChange('link', e.target.value)}
                            placeholder="https://example.com/service or /service-page"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500">
                            Optional link to more information about this service
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

/**
 * Trust Badges Editor Component
 */
interface TrustBadgesEditorProps {
    trustBadges: TrustBadge[]
    onChange: (trustBadges: TrustBadge[]) => void
}

function TrustBadgesEditor({ trustBadges, onChange }: TrustBadgesEditorProps) {
    const [isExpanded, setIsExpanded] = React.useState(false)

    const handleBadgeAdd = () => {
        const newBadge: TrustBadge = {
            id: `badge-${Date.now()}`,
            name: '',
            image: {
                id: '',
                url: '',
                type: 'image',
                alt: '',
                objectFit: 'contain',
                loading: 'lazy'
            }
        }
        onChange([...trustBadges, newBadge])
    }

    const handleBadgeUpdate = (index: number, updatedBadge: TrustBadge) => {
        const updatedBadges = [...trustBadges]
        updatedBadges[index] = updatedBadge
        onChange(updatedBadges)
    }

    const handleBadgeRemove = (index: number) => {
        const updatedBadges = trustBadges.filter((_, i) => i !== index)
        onChange(updatedBadges)
    }

    return (
        <div className="border rounded-lg p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Trust Badges</h3>
                <div className="flex items-center space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleBadgeAdd}
                    >
                        Add Badge
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? '−' : '+'}
                    </Button>
                </div>
            </div>

            {/* Trust Badges List */}
            {isExpanded && (
                <div className="space-y-4 pt-4 border-t">
                    {trustBadges.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {trustBadges.map((badge, index) => (
                                <TrustBadgeItemEditor
                                    key={badge.id || index}
                                    badge={badge}
                                    index={index}
                                    onUpdate={(updatedBadge) => handleBadgeUpdate(index, updatedBadge)}
                                    onRemove={() => handleBadgeRemove(index)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                            <p>No trust badges added yet.</p>
                            <p className="text-sm">Click &quot;Add Badge&quot; to get started.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

/**
 * Trust Badge Item Editor Component
 */
interface TrustBadgeItemEditorProps {
    badge: TrustBadge
    index: number
    onUpdate: (badge: TrustBadge) => void
    onRemove: () => void
}

function TrustBadgeItemEditor({ badge, index, onUpdate, onRemove }: TrustBadgeItemEditorProps) {
    const handleFieldChange = (field: keyof TrustBadge, value: any) => {
        onUpdate({ ...badge, [field]: value })
    }

    const handleImageAdd = (media: any) => {
        if (media && !Array.isArray(media)) {
            const newImage: MediaConfig = {
                id: media.id,
                url: media.url,
                type: 'image',
                alt: badge.name || 'Trust badge',
                objectFit: 'contain',
                loading: 'lazy'
            }
            handleFieldChange('image', newImage)
        }
    }

    return (
        <div className="border rounded-lg p-4 space-y-4">
            {/* Badge Header */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Badge {index + 1}</span>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="text-red-600 hover:text-red-700"
                >
                    ×
                </Button>
            </div>

            {/* Badge Fields */}
            <div className="space-y-4">
                {/* Badge Name */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Badge Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={badge.name || ''}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        placeholder="Company Name or Badge Title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Badge Image */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Badge Image <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-4">
                        <MediaPicker
                            value={badge.image ? {
                                id: badge.image.id,
                                url: badge.image.url,
                                type: badge.image.type === 'image' ? 'IMAGE' as const : 'VIDEO' as const,
                                fileName: badge.image.alt || 'badge-image',
                                fileSize: 0,
                                mimeType: 'image/jpeg',
                                altText: badge.image.alt
                            } : undefined}
                            onChange={handleImageAdd}
                            accept="image/*"
                            type="IMAGE"
                            placeholder="Select Badge Image"
                        />
                        {badge.image?.url && (
                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                <Image
                                    src={badge.image.url}
                                    alt={badge.image.alt || 'Trust badge'}
                                    className="max-w-full max-h-full object-contain"
                                    width={badge.image.width || 64}
                                    height={badge.image.height || 48}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Badge Link */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Badge Link (Optional)
                    </label>
                    <input
                        type="url"
                        value={badge.link || ''}
                        onChange={(e) => handleFieldChange('link', e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500">
                        Optional link when users click on the badge
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HeroServiceEditor