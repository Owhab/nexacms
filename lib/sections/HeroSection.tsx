'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MediaPicker } from '@/components/ui/MediaPicker'

interface HeroSectionProps {
    title?: string
    subtitle?: string
    buttonText?: string
    buttonLink?: string
    backgroundImage?: string
    textAlign?: 'left' | 'center' | 'right'
}

interface HeroSectionEditorProps extends HeroSectionProps {
    props: HeroSectionProps
    onSave: (props: HeroSectionProps) => void
    onCancel: () => void
}

// Preview Component
export function HeroSectionPreview({
    title = 'Welcome to Your Website',
    subtitle = 'Build amazing experiences with our platform',
    buttonText = 'Get Started',
    buttonLink = '#',
    backgroundImage = '',
    textAlign = 'center'
}: HeroSectionProps) {
    return (
        <div
            className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            style={{
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {backgroundImage && (
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            )}

            <div className={`relative z-10 max-w-4xl mx-auto px-4 text-${textAlign}`}>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    {title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-blue-100">
                    {subtitle}
                </p>
                {buttonText && (
                    <a
                        href={buttonLink}
                        className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                    >
                        {buttonText}
                    </a>
                )}
            </div>
        </div>
    )
}

// Editor Component
export function HeroSectionEditor({ props, onSave, onCancel }: HeroSectionEditorProps) {
    const [formData, setFormData] = useState<HeroSectionProps>({
        title: props.title || 'Welcome to Your Website',
        subtitle: props.subtitle || 'Build amazing experiences with our platform',
        buttonText: props.buttonText || 'Get Started',
        buttonLink: props.buttonLink || '#',
        backgroundImage: props.backgroundImage || '',
        textAlign: props.textAlign || 'center'
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
                        placeholder="Enter hero title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Alignment
                    </label>
                    <select
                        name="textAlign"
                        value={formData.textAlign}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                </label>
                <textarea
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter hero subtitle"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                    </label>
                    <input
                        type="text"
                        name="buttonText"
                        value={formData.buttonText}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter button text"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Link
                    </label>
                    <input
                        type="url"
                        name="buttonLink"
                        value={formData.buttonLink}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter button URL"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image
                </label>
                <MediaPicker
                    value={formData.backgroundImage ? {
                        id: 'hero-bg',
                        url: formData.backgroundImage,
                        type: 'IMAGE' as const,
                        fileName: 'background',
                        fileSize: 0,
                        mimeType: 'image/*'
                    } : undefined}
                    onChange={(media) => {
                        if (media && !Array.isArray(media)) {
                            setFormData(prev => ({ ...prev, backgroundImage: media.url }))
                        } else {
                            setFormData(prev => ({ ...prev, backgroundImage: '' }))
                        }
                    }}
                    accept="image/*"
                    category="hero"
                    type="IMAGE"
                    placeholder="Upload or select background image"
                />
            </div>

            {/* Preview */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                </label>
                <div className="border rounded-lg overflow-hidden">
                    <HeroSectionPreview {...formData} />
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
export default function HeroSection(props: HeroSectionProps | HeroSectionEditorProps) {
    if ('onSave' in props) {
        return <HeroSectionEditor {...props} />
    }
    return <HeroSectionPreview {...props} />
}