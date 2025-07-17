'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MediaPicker } from '@/components/ui/MediaPicker'

interface ImageTextSectionProps {
    image?: string
    imageAlt?: string
    title?: string
    content?: string
    layout?: 'left' | 'right'
    imageWidth?: string
}

interface ImageTextSectionEditorProps extends ImageTextSectionProps {
    props: ImageTextSectionProps
    onSave: (props: ImageTextSectionProps) => void
    onCancel: () => void
}

// Preview Component
export function ImageTextSectionPreview({
    image = '',
    imageAlt = '',
    title = 'Your Title Here',
    content = '<p>Your content here...</p>',
    layout = 'left',
    imageWidth = '50%'
}: ImageTextSectionProps) {
    const isImageLeft = layout === 'left'

    return (
        <div className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className={`flex flex-col ${isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                    {/* Image */}
                    <div className="flex-shrink-0" style={{ width: imageWidth }}>
                        {image ? (
                            <img
                                src={image}
                                alt={imageAlt || title}
                                className="w-full h-auto rounded-lg shadow-lg"
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500">No image selected</span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            {title}
                        </h2>
                        <div
                            className="prose prose-lg max-w-none text-gray-600"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

// Editor Component
export function ImageTextSectionEditor({ props, onSave, onCancel }: ImageTextSectionEditorProps) {
    const [formData, setFormData] = useState<ImageTextSectionProps>({
        image: props.image || '',
        imageAlt: props.imageAlt || '',
        title: props.title || 'Your Title Here',
        content: props.content || '<p>Your content here...</p>',
        layout: props.layout || 'left',
        imageWidth: props.imageWidth || '50%'
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        onSave(formData)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter section title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Layout
                    </label>
                    <select
                        name="layout"
                        value={formData.layout}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="left">Image Left</option>
                        <option value="right">Image Right</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Alt Text
                    </label>
                    <input
                        type="text"
                        name="imageAlt"
                        value={formData.imageAlt}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe the image for accessibility"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Width
                    </label>
                    <select
                        name="imageWidth"
                        value={formData.imageWidth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="30%">30%</option>
                        <option value="40%">40%</option>
                        <option value="50%">50%</option>
                        <option value="60%">60%</option>
                        <option value="70%">70%</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                </label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your content (HTML supported)"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                </label>
                <MediaPicker
                    value={formData.image ? {
                        id: 'section-image',
                        url: formData.image,
                        type: 'IMAGE' as const,
                        fileName: 'section-image',
                        fileSize: 0,
                        mimeType: 'image/*',
                        altText: formData.imageAlt
                    } : undefined}
                    onChange={(media) => {
                        if (media && !Array.isArray(media)) {
                            setFormData(prev => ({
                                ...prev,
                                image: media.url,
                                imageAlt: media.altText || prev.imageAlt
                            }))
                        } else {
                            setFormData(prev => ({ ...prev, image: '' }))
                        }
                    }}
                    accept="image/*"
                    category="content"
                    type="IMAGE"
                    placeholder="Upload or select an image"
                />
            </div>

            {/* Preview */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                </label>
                <div className="border rounded-lg overflow-hidden">
                    <ImageTextSectionPreview {...formData} />
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={handleSave}>
                    Save Changes
                </Button>
            </div>
        </div>
    )
}

// Main component that handles both modes
export default function ImageTextSection(props: ImageTextSectionProps | ImageTextSectionEditorProps) {
    if ('onSave' in props) {
        return <ImageTextSectionEditor {...props} />
    }
    return <ImageTextSectionPreview {...props} />
}