'use client'

import { useState } from 'react'
import { Button } from './button'
import { MediaUpload } from './MediaUpload'
import { MediaLibrary } from './MediaLibrary'
import { ImageIcon, UploadIcon, FolderIcon } from 'lucide-react'
import { MediaItem } from '@/lib/types/media'

interface MediaPickerProps {
    value?: MediaItem | MediaItem[]
    onChange: (media: MediaItem | MediaItem[]) => void
    accept?: string
    category?: string
    type?: 'IMAGE' | 'VIDEO' | 'DOCUMENT'
    multiple?: boolean
    maxSize?: number
    placeholder?: string
    className?: string
}

export function MediaPicker({
    value,
    onChange,
    accept = "image/*,video/*,.pdf,.doc,.docx",
    category = "general",
    type,
    multiple = false,
    maxSize = 10 * 1024 * 1024,
    placeholder = "Select or upload media",
    className = ""
}: MediaPickerProps) {
    const [showLibrary, setShowLibrary] = useState(false)
    const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload')

    const handleUpload = (media: MediaItem) => {
        if (multiple) {
            const currentValue = Array.isArray(value) ? value : (value ? [value] : [])
            onChange([...currentValue, media])
        } else {
            onChange(media)
        }
    }

    const handleLibrarySelect = (media: MediaItem) => {
        if (multiple) {
            const currentValue = Array.isArray(value) ? value : (value ? [value] : [])
            onChange([...currentValue, media])
        } else {
            onChange(media)
        }
    }

    const handleRemove = (mediaId: string) => {
        if (multiple && Array.isArray(value)) {
            onChange(value.filter(item => item.id !== mediaId))
        } else {
            onChange(multiple ? [] : null as any)
        }
    }

    const hasValue = multiple
        ? (Array.isArray(value) && value.length > 0)
        : Boolean(value)

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'upload'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <UploadIcon className="h-4 w-4" />
                    <span>Upload New</span>
                </button>
                <button
                    onClick={() => setActiveTab('library')}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'library'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <FolderIcon className="h-4 w-4" />
                    <span>Media Library</span>
                </button>
            </div>

            {/* Content */}
            {activeTab === 'upload' ? (
                <MediaUpload
                    onUpload={handleUpload}
                    onRemove={handleRemove}
                    accept={accept}
                    category={category}
                    maxSize={maxSize}
                    multiple={multiple}
                    value={value}
                    placeholder={placeholder}
                />
            ) : (
                <div className="space-y-4">
                    <Button
                        onClick={() => setShowLibrary(true)}
                        variant="outline"
                        className="w-full"
                    >
                        <FolderIcon className="mr-2 h-4 w-4" />
                        Browse Media Library
                    </Button>

                    {hasValue && (
                        <MediaUpload
                            onUpload={() => { }} // Not used in library mode
                            onRemove={handleRemove}
                            accept={accept}
                            category={category}
                            maxSize={maxSize}
                            multiple={multiple}
                            value={value}
                            placeholder=""
                        />
                    )}
                </div>
            )}

            {/* Media Library Modal */}
            <MediaLibrary
                isOpen={showLibrary}
                onClose={() => setShowLibrary(false)}
                onSelect={handleLibrarySelect}
                category={category}
                type={type}
                multiple={multiple}
            />
        </div>
    )
}