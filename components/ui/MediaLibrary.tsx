'use client'

import { useState, useEffect } from 'react'
import { Button } from './button'
import { SearchIcon, ImageIcon, VideoIcon, FileIcon, TrashIcon } from 'lucide-react'
import { MediaItem } from '@/lib/types/media'

interface MediaLibraryProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (media: MediaItem) => void
    category?: string
    type?: 'IMAGE' | 'VIDEO' | 'DOCUMENT'
    multiple?: boolean
}

export function MediaLibrary({
    isOpen,
    onClose,
    onSelect,
    category,
    type,
    multiple = false
}: MediaLibraryProps) {
    const [media, setMedia] = useState<MediaItem[]>([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        if (isOpen) {
            fetchMedia()
        }
    }, [isOpen, search, page, category, type])

    const fetchMedia = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '12'
            })

            if (search) params.append('search', search)
            if (category) params.append('category', category)
            if (type) params.append('type', type)

            const response = await fetch(`/api/media?${params}`)
            if (response.ok) {
                const data = await response.json()
                setMedia(data.media)
                setTotalPages(data.pagination.pages)
            }
        } catch (error) {
            console.error('Error fetching media:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelect = (mediaItem: MediaItem) => {
        if (multiple) {
            const newSelected = new Set(selectedItems)
            if (newSelected.has(mediaItem.id)) {
                newSelected.delete(mediaItem.id)
            } else {
                newSelected.add(mediaItem.id)
            }
            setSelectedItems(newSelected)
        } else {
            onSelect(mediaItem)
            onClose()
        }
    }

    const handleSelectMultiple = () => {
        const selectedMedia = media.filter(item => selectedItems.has(item.id))
        selectedMedia.forEach(onSelect)
        onClose()
    }

    const handleDelete = async (mediaId: string) => {
        if (!confirm('Are you sure you want to delete this media item?')) return

        try {
            const response = await fetch(`/api/media?id=${mediaId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setMedia(prev => prev.filter(item => item.id !== mediaId))
            } else {
                alert('Failed to delete media item')
            }
        } catch (error) {
            console.error('Error deleting media:', error)
            alert('Failed to delete media item')
        }
    }

    const getMediaIcon = (mediaType: string) => {
        if (mediaType === 'IMAGE') return <ImageIcon className="h-6 w-6" />
        if (mediaType === 'VIDEO') return <VideoIcon className="h-6 w-6" />
        return <FileIcon className="h-6 w-6" />
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">Media Library</h2>
                    <div className="flex items-center space-x-4">
                        {multiple && selectedItems.size > 0 && (
                            <Button onClick={handleSelectMultiple}>
                                Select {selectedItems.size} items
                            </Button>
                        )}
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>

                {/* Search */}
                <div className="p-6 border-b">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search media..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Media Grid */}
                <div className="flex-1 overflow-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : media.length === 0 ? (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            <div className="text-center">
                                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No media found</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {media.map((item) => (
                                <div
                                    key={item.id}
                                    className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${selectedItems.has(item.id) ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                    onClick={() => handleSelect(item)}
                                >
                                    {/* Delete button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(item.id)
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity z-10"
                                    >
                                        <TrashIcon className="h-3 w-3" />
                                    </button>

                                    {/* Media preview */}
                                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                        {item.type === 'IMAGE' ? (
                                            <img
                                                src={item.url}
                                                alt={item.altText || item.fileName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-gray-400">
                                                {getMediaIcon(item.type)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Media info */}
                                    <div className="p-2">
                                        <p className="text-xs font-medium text-gray-900 truncate">
                                            {item.fileName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(item.fileSize)}
                                        </p>
                                    </div>

                                    {/* Selection indicator */}
                                    {multiple && (
                                        <div className="absolute top-2 left-2">
                                            <div className={`w-4 h-4 rounded border-2 ${selectedItems.has(item.id)
                                                ? 'bg-blue-500 border-blue-500'
                                                : 'bg-white border-gray-300'
                                                }`}>
                                                {selectedItems.has(item.id) && (
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 p-6 border-t">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}