'use client'

import React, { useState, useCallback } from 'react'
import {
    HeroEditorProps,
    HeroGalleryProps,
    FieldType,
    EditorSection,
    GalleryItem
} from '../types'
import { BaseHeroEditor } from './BaseHeroEditor'
import { HeroGalleryPreview } from '../previews/HeroGalleryPreview'
import { MediaPicker } from '@/components/ui/MediaPicker'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

/**
 * Hero Gallery Editor Component
 * 
 * Specialized editor for the gallery hero section variant with:
 * - Image collection management with drag-and-drop reordering
 * - Gallery layout and display settings
 * - Caption editing for individual images
 * - Lightbox and carousel configuration
 * - Real-time preview updates
 */
export function HeroGalleryEditor(props: HeroEditorProps<HeroGalleryProps>) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

    // Handle gallery item reordering
    const handleReorderGallery = useCallback((fromIndex: number, toIndex: number) => {
        const currentGallery = props.props.gallery || []
        const newGallery = [...currentGallery]
        const [movedItem] = newGallery.splice(fromIndex, 1)
        newGallery.splice(toIndex, 0, movedItem)

        props.onChange?.({
            ...props.props,
            gallery: newGallery
        })
    }, [props])

    // Handle adding new gallery item
    const handleAddGalleryItem = useCallback(() => {
        const currentGallery = props.props.gallery || []
        const newItem: GalleryItem = {
            id: `gallery-item-${Date.now()}`,
            image: {
                id: '',
                url: '',
                type: 'image',
                alt: '',
                objectFit: 'cover',
                loading: 'lazy'
            },
            caption: ''
        }

        props.onChange?.({
            ...props.props,
            gallery: [...currentGallery, newItem]
        })
    }, [props])

    // Handle removing gallery item
    const handleRemoveGalleryItem = useCallback((index: number) => {
        const currentGallery = props.props.gallery || []
        const newGallery = currentGallery.filter((_, i) => i !== index)

        props.onChange?.({
            ...props.props,
            gallery: newGallery
        })
    }, [props])

    // Handle updating gallery item
    const handleUpdateGalleryItem = useCallback((index: number, updates: Partial<GalleryItem>) => {
        const currentGallery = props.props.gallery || []
        const newGallery = currentGallery.map((item, i) => 
            i === index ? { ...item, ...updates } : item
        )

        props.onChange?.({
            ...props.props,
            gallery: newGallery
        })
    }, [props])

    // Define editor schema for gallery hero
    const editorSchema = {
        sections: [
            {
                id: 'content',
                title: 'Content',
                icon: '📝',
                collapsible: false,
                defaultExpanded: true,
                description: 'Configure the header content of your gallery hero section',
                fields: [
                    {
                        id: 'title.text',
                        type: FieldType.TEXT,
                        label: 'Title',
                        placeholder: 'Enter your gallery title',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 100, message: 'Title must be less than 100 characters' }
                        ],
                        helpText: 'Main headline for your gallery section'
                    },
                    {
                        id: 'subtitle.text',
                        type: FieldType.TEXTAREA,
                        label: 'Subtitle',
                        placeholder: 'Enter a description for your gallery',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 300, message: 'Subtitle must be less than 300 characters' }
                        ],
                        helpText: 'Supporting text to describe your gallery'
                    }
                ]
            },
            {
                id: 'gallery',
                title: 'Gallery Images',
                icon: '🖼️',
                collapsible: false,
                defaultExpanded: true,
                description: 'Manage your image collection',
                fields: [] // Custom gallery management UI below
            },
            {
                id: 'layout',
                title: 'Layout & Display',
                icon: '📐',
                collapsible: true,
                defaultExpanded: true,
                description: 'Configure how your gallery is displayed',
                fields: [
                    {
                        id: 'layout',
                        type: FieldType.SELECT,
                        label: 'Gallery Layout',
                        required: true,
                        defaultValue: 'grid',
                        options: [
                            { label: 'Grid', value: 'grid', icon: '⊞' },
                            { label: 'Masonry', value: 'masonry', icon: '⊟' },
                            { label: 'Carousel', value: 'carousel', icon: '⊡' }
                        ],
                        helpText: 'Choose how images are arranged'
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
                        ],
                        dependencies: ['layout'],
                        helpText: 'Number of columns for grid layout'
                    },
                    {
                        id: 'showCaptions',
                        type: FieldType.BOOLEAN,
                        label: 'Show Captions',
                        required: false,
                        defaultValue: true,
                        helpText: 'Display image captions below each image'
                    },
                    {
                        id: 'lightbox',
                        type: FieldType.BOOLEAN,
                        label: 'Enable Lightbox',
                        required: false,
                        defaultValue: true,
                        helpText: 'Allow clicking images to view in full-screen lightbox'
                    }
                ]
            },
            {
                id: 'carousel',
                title: 'Carousel Settings',
                icon: '🎠',
                collapsible: true,
                defaultExpanded: false,
                description: 'Configure carousel behavior (when carousel layout is selected)',
                fields: [
                    {
                        id: 'autoplay',
                        type: FieldType.BOOLEAN,
                        label: 'Auto-advance',
                        required: false,
                        defaultValue: false,
                        helpText: 'Automatically advance to next image'
                    },
                    {
                        id: 'autoplayInterval',
                        type: FieldType.NUMBER,
                        label: 'Auto-advance Interval (ms)',
                        required: false,
                        defaultValue: 5000,
                        min: 1000,
                        max: 30000,
                        step: 1000,
                        dependencies: ['autoplay'],
                        helpText: 'Time between automatic image changes'
                    }
                ]
            },
            {
                id: 'cta',
                title: 'Call-to-Action',
                icon: '🔘',
                collapsible: true,
                defaultExpanded: false,
                description: 'Add a call-to-action button below the gallery',
                fields: [
                    {
                        id: 'primaryButton.text',
                        type: FieldType.TEXT,
                        label: 'Button Text',
                        placeholder: 'View All Photos',
                        required: false,
                        validation: [
                            { type: 'maxLength', value: 30, message: 'Button text must be less than 30 characters' }
                        ]
                    },
                    {
                        id: 'primaryButton.url',
                        type: FieldType.URL,
                        label: 'Button URL',
                        placeholder: 'https://example.com or /gallery',
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
                            { label: 'Ghost', value: 'ghost' }
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
                        defaultValue: 'none',
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
                        defaultValue: '#f8fafc',
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
    }

    // Create a wrapper component that matches the expected interface
    const PreviewWrapper = ({ props: previewProps }: { props: HeroGalleryProps }) => (
        <HeroGalleryPreview {...previewProps} />
    )

    // Custom gallery management UI
    const GalleryManagement = () => {
        const gallery = props.props.gallery || []

        return (
            <div className="space-y-4">
                {/* Add Image Button */}
                <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700">Gallery Images ({gallery.length})</h4>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddGalleryItem}
                    >
                        Add Image
                    </Button>
                </div>

                {/* Gallery Items */}
                {gallery.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        <p>No images added yet</p>
                        <p className="text-sm">Click &quot;Add Image&quot; to get started</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {gallery.map((item, index) => (
                            <div
                                key={item.id || index}
                                className="border rounded-lg p-4 bg-gray-50"
                                draggable
                                onDragStart={() => setDraggedIndex(index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    if (draggedIndex !== null && draggedIndex !== index) {
                                        handleReorderGallery(draggedIndex, index)
                                    }
                                    setDraggedIndex(null)
                                }}
                            >
                                <div className="flex items-start space-x-4">
                                    {/* Drag Handle */}
                                    <div className="flex-shrink-0 cursor-move text-gray-400 hover:text-gray-600 mt-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                        </svg>
                                    </div>

                                    {/* Image Preview */}
                                    <div className="flex-shrink-0">
                                        {item.image.url ? (
                                            <Image
                                                src={item.image.url}
                                                alt={item.image.alt || ''}
                                                className="w-16 h-16 object-cover rounded border"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Image Settings */}
                                    <div className="flex-1 space-y-3">
                                        {/* Image Picker */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Image
                                            </label>
                                            <MediaPicker
                                                value={item.image.url ? {
                                                    id: item.image.id || 'image',
                                                    url: item.image.url,
                                                    type: 'IMAGE' as const,
                                                    fileName: 'image',
                                                    fileSize: 0,
                                                    mimeType: 'image/*'
                                                } : undefined}
                                                onChange={(media) => {
                                                    if (media && !Array.isArray(media)) {
                                                        handleUpdateGalleryItem(index, {
                                                            image: {
                                                                ...item.image,
                                                                id: media.id,
                                                                url: media.url
                                                            }
                                                        })
                                                    }
                                                }}
                                                accept="image/*"
                                                type="IMAGE"
                                                placeholder="Select image"
                                            />
                                        </div>

                                        {/* Alt Text */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Alt Text
                                            </label>
                                            <input
                                                type="text"
                                                value={item.image.alt || ''}
                                                onChange={(e) => handleUpdateGalleryItem(index, {
                                                    image: { ...item.image, alt: e.target.value }
                                                })}
                                                placeholder="Describe this image"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Caption */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Caption
                                            </label>
                                            <input
                                                type="text"
                                                value={item.caption || ''}
                                                onChange={(e) => handleUpdateGalleryItem(index, {
                                                    caption: e.target.value
                                                })}
                                                placeholder="Optional caption for this image"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <div className="flex-shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveGalleryItem(index)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                            aria-label="Remove image"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Gallery Tips */}
                <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                    <p><strong>Tips:</strong></p>
                    <ul className="mt-1 space-y-1">
                        <li>• Drag and drop to reorder images</li>
                        <li>• Add alt text for accessibility</li>
                        <li>• Use captions to provide context</li>
                        <li>• Recommended image size: 1200x800px or larger</li>
                    </ul>
                </div>
            </div>
        )
    }

    return (
        <BaseHeroEditor
            {...props}
            schema={editorSchema}
            previewComponent={PreviewWrapper}
        >
            {/* Custom Gallery Management UI */}
            <div className="space-y-6">
                <GalleryManagement />
            </div>
        </BaseHeroEditor>
    )
}

export default HeroGalleryEditor