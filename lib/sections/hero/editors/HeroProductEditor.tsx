'use client'

import React from 'react'
import {
    HeroEditorProps,
    HeroProductProps,
    FieldType,
    EditorSection,
    ProductItem,
    MediaConfig
} from '../types'
import { BaseHeroEditor } from './BaseHeroEditor'
import { HeroProductPreview } from '../previews/HeroProductPreview'
import { Button } from '@/components/ui/button'
import { MediaPicker } from '@/components/ui/MediaPicker'
import Image from 'next/image'

/**
 * Hero Product Editor Component
 * 
 * Specialized editor for the product hero section variant with:
 * - Product information configuration (name, description, pricing)
 * - Image gallery management (add, remove, reorder)
 * - Feature list management
 * - Layout and display options
 * - E-commerce specific features
 * - Real-time preview updates
 */
export function HeroProductEditor(props: HeroEditorProps<HeroProductProps>) {
    // Define editor schema for product hero
    const editorSchema = {
        sections: [
            {
                id: 'layout',
                title: 'Layout',
                icon: '📐',
                collapsible: false,
                defaultExpanded: true,
                description: 'Configure the layout and display options',
                fields: [
                    {
                        id: 'layout',
                        type: FieldType.SELECT,
                        label: 'Layout Style',
                        required: true,
                        defaultValue: 'left',
                        options: [
                            { label: 'Content Left, Gallery Right', value: 'left', icon: '⬅️' },
                            { label: 'Content Right, Gallery Left', value: 'right', icon: '➡️' },
                            { label: 'Centered', value: 'center', icon: '⬆️' }
                        ],
                        helpText: 'How to arrange the product content and gallery'
                    },
                    {
                        id: 'showGallery',
                        type: FieldType.BOOLEAN,
                        label: 'Show Image Gallery',
                        required: false,
                        defaultValue: true,
                        helpText: 'Display product images in a gallery'
                    },
                    {
                        id: 'showFeatures',
                        type: FieldType.BOOLEAN,
                        label: 'Show Features List',
                        required: false,
                        defaultValue: true,
                        helpText: 'Display product features as a bulleted list'
                    },
                    {
                        id: 'showPricing',
                        type: FieldType.BOOLEAN,
                        label: 'Show Pricing',
                        required: false,
                        defaultValue: true,
                        helpText: 'Display product price and original price'
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
                        dependencies: ['secondaryButton.text']
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
    const PreviewWrapper = ({ props: previewProps }: { props: HeroProductProps }) => (
        <HeroProductPreview {...previewProps} />
    )

    return (
        <BaseHeroEditor
            {...props}
            schema={editorSchema}
            previewComponent={PreviewWrapper}
        >
            {/* Product Information Section */}
            <div className="space-y-6">
                <ProductInfoEditor
                    product={props.props.product}
                    onChange={(updatedProduct) => {
                        props.onChange?.({ ...props.props, product: updatedProduct })
                    }}
                />
            </div>
        </BaseHeroEditor>
    )
}

/**
 * Product Information Editor Component
 */
interface ProductInfoEditorProps {
    product?: ProductItem
    onChange: (product: ProductItem) => void
}

function ProductInfoEditor({ product, onChange }: ProductInfoEditorProps) {
    const [isExpanded, setIsExpanded] = React.useState(true)

    const currentProduct: ProductItem = product || {
        id: 'product-1',
        name: '',
        description: '',
        images: [],
        features: []
    }

    const handleFieldChange = (field: keyof ProductItem, value: any) => {
        onChange({ ...currentProduct, [field]: value })
    }

    const handleImageAdd = (media: any) => {
        if (media && !Array.isArray(media)) {
            const newImage: MediaConfig = {
                id: media.id,
                url: media.url,
                type: 'image',
                alt: currentProduct.name || 'Product image',
                objectFit: 'cover',
                loading: 'lazy'
            }
            const updatedImages = [...(currentProduct.images || []), newImage]
            handleFieldChange('images', updatedImages)
        }
    }

    const handleImageRemove = (index: number) => {
        const updatedImages = (currentProduct.images || []).filter((_, i) => i !== index)
        handleFieldChange('images', updatedImages)
    }

    const handleImageReorder = (fromIndex: number, toIndex: number) => {
        const updatedImages = [...(currentProduct.images || [])]
        const [movedImage] = updatedImages.splice(fromIndex, 1)
        updatedImages.splice(toIndex, 0, movedImage)
        handleFieldChange('images', updatedImages)
    }

    const handleFeatureAdd = () => {
        const updatedFeatures = [...(currentProduct.features || []), '']
        handleFieldChange('features', updatedFeatures)
    }

    const handleFeatureChange = (index: number, value: string) => {
        const updatedFeatures = [...(currentProduct.features || [])]
        updatedFeatures[index] = value
        handleFieldChange('features', updatedFeatures)
    }

    const handleFeatureRemove = (index: number) => {
        const updatedFeatures = (currentProduct.features || []).filter((_, i) => i !== index)
        handleFieldChange('features', updatedFeatures)
    }

    return (
        <div className="border rounded-lg p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Product Information</h3>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? '−' : '+'}
                </Button>
            </div>

            {/* Product Fields */}
            {isExpanded && (
                <div className="space-y-4 pt-4 border-t">
                    {/* Product Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={currentProduct.name || ''}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            placeholder="Enter product name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Product Description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            value={currentProduct.description || ''}
                            onChange={(e) => handleFieldChange('description', e.target.value)}
                            placeholder="Enter product description"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Badge */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Badge (Optional)
                        </label>
                        <input
                            type="text"
                            value={currentProduct.badge || ''}
                            onChange={(e) => handleFieldChange('badge', e.target.value)}
                            placeholder="New, Sale, Featured, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500">
                            Optional badge to display above the product name
                        </p>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Currency
                            </label>
                            <input
                                type="text"
                                value={currentProduct.currency || '$'}
                                onChange={(e) => handleFieldChange('currency', e.target.value)}
                                placeholder="$"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Price
                            </label>
                            <input
                                type="text"
                                value={currentProduct.price || ''}
                                onChange={(e) => handleFieldChange('price', e.target.value)}
                                placeholder="99.99"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Original Price (Optional)
                            </label>
                            <input
                                type="text"
                                value={currentProduct.originalPrice || ''}
                                onChange={(e) => handleFieldChange('originalPrice', e.target.value)}
                                placeholder="149.99"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                                Product Images
                            </label>
                            <MediaPicker
                                value={undefined}
                                onChange={handleImageAdd}
                                accept="image/*"
                                type="IMAGE"
                                placeholder="Add Image"
                            />
                        </div>

                        {currentProduct.images && currentProduct.images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {currentProduct.images.map((image, index) => (
                                    <div key={image.id || index} className="relative group">
                                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                            <Image
                                                src={image.url}
                                                alt={image.alt || `Product image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleImageRemove(index)}
                                                className="bg-red-600 text-white hover:bg-red-700 w-6 h-6 p-0"
                                            >
                                                ×
                                            </Button>
                                        </div>
                                        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleImageReorder(index, index - 1)}
                                                    className="bg-white/80 hover:bg-white text-gray-700 w-6 h-6 p-0"
                                                    title="Move left"
                                                >
                                                    ←
                                                </Button>
                                            )}
                                            {index < currentProduct.images.length - 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleImageReorder(index, index + 1)}
                                                    className="bg-white/80 hover:bg-white text-gray-700 w-6 h-6 p-0"
                                                    title="Move right"
                                                >
                                                    →
                                                </Button>
                                            )}
                                        </div>
                                        <div className="absolute top-2 left-2 bg-black/50 text-white px-1 py-0.5 rounded text-xs">
                                            {index + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                                <p>No images added yet.</p>
                                <p className="text-sm">Click &quot;Add Image&quot; to get started.</p>
                            </div>
                        )}
                    </div>

                    {/* Product Features */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                                Product Features
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

                        {currentProduct.features && currentProduct.features.length > 0 ? (
                            <div className="space-y-2">
                                {currentProduct.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <span className="text-primary">✓</span>
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                                            placeholder="Enter feature description"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleFeatureRemove(index)}
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

                    {/* Product Link */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Product Link (Optional)
                        </label>
                        <input
                            type="url"
                            value={currentProduct.link || ''}
                            onChange={(e) => handleFieldChange('link', e.target.value)}
                            placeholder="https://example.com/product or /product-page"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500">
                            Optional link to the full product page
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HeroProductEditor