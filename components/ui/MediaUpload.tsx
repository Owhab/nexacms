'use client'

import { useState, useRef } from 'react'
import { Button } from './button'
import { UploadIcon, ImageIcon, VideoIcon, FileIcon, XIcon } from 'lucide-react'
import { MediaItem } from '@/lib/types/media'

interface MediaUploadProps {
    onUpload: (media: MediaItem) => void
    onRemove?: (mediaId: string) => void
    accept?: string
    category?: string
    maxSize?: number
    multiple?: boolean
    value?: MediaItem | MediaItem[]
    placeholder?: string
    className?: string
}

export function MediaUpload({
    onUpload,
    onRemove,
    accept = "image/*,video/*,.pdf,.doc,.docx",
    category = "general",
    maxSize = 10 * 1024 * 1024, // 10MB
    multiple = false,
    value,
    placeholder = "Click to upload or drag and drop",
    className = ""
}: MediaUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (files: FileList) => {
        if (!files.length) return

        setUploading(true)

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i]

                if (file.size > maxSize) {
                    alert(`File ${file.name} is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`)
                    continue
                }

                const formData = new FormData()
                formData.append('file', file)
                formData.append('category', category)
                formData.append('altText', file.name)

                const response = await fetch('/api/media/upload', {
                    method: 'POST',
                    body: formData
                })

                if (response.ok) {
                    const data = await response.json()
                    onUpload(data.media)
                } else {
                    const error = await response.json()
                    alert(`Failed to upload ${file.name}: ${error.error}`)
                }

                if (!multiple) break
            }
        } catch (error) {
            console.error('Upload error:', error)
            alert('Upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        handleFileSelect(e.dataTransfer.files)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
    }

    const getMediaIcon = (type: string) => {
        if (type === 'IMAGE') return <ImageIcon className="h-8 w-8" />
        if (type === 'VIDEO') return <VideoIcon className="h-8 w-8" />
        return <FileIcon className="h-8 w-8" />
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const mediaItems = Array.isArray(value) ? value : (value ? [value] : [])

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                    } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                />

                <div className="flex flex-col items-center space-y-2">
                    <UploadIcon className={`h-12 w-12 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {uploading ? 'Uploading...' : placeholder}
                        </p>
                        <p className="text-xs text-gray-500">
                            Max size: {Math.round(maxSize / 1024 / 1024)}MB
                        </p>
                    </div>
                    <Button type="button" variant="outline" size="sm" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Choose Files'}
                    </Button>
                </div>
            </div>

            {/* Uploaded Media Preview */}
            {mediaItems.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mediaItems.map((media) => (
                        <div key={media.id} className="relative border rounded-lg p-4 bg-white">
                            {onRemove && (
                                <button
                                    onClick={() => onRemove(media.id)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <XIcon className="h-4 w-4" />
                                </button>
                            )}

                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 text-gray-400">
                                    {getMediaIcon(media.type)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {media.fileName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(media.fileSize)}
                                    </p>
                                    {media.altText && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            {media.altText}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {media.type === 'IMAGE' && (
                                <div className="mt-3">
                                    <img
                                        src={media.url}
                                        alt={media.altText || media.fileName}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}