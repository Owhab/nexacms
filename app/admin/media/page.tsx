'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MediaUpload } from '@/components/ui/MediaUpload'
import { MediaLibrary } from '@/components/ui/MediaLibrary'
import { MediaItem } from '@/lib/types/media'
import {
    ImageIcon,
    VideoIcon,
    FileIcon,
    UploadIcon,
    SearchIcon,
    FilterIcon,
    GridIcon,
    ListIcon
} from 'lucide-react'

export default function MediaPage() {
    const [media, setMedia] = useState<MediaItem[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [showUpload, setShowUpload] = useState(false)

    useEffect(() => {
        fetchMedia()
    }, [search, categoryFilter, typeFilter, page])

    const fetchMedia = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20'
            })

            if (search) params.append('search', search)
            if (categoryFilter) params.append('category', categoryFilter)
            if (typeFilter) params.append('type', typeFilter)

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

    const handleUpload = (newMedia: MediaItem) => {
        setMedia(prev => [newMedia, ...prev])
        setShowUpload(false)
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

    const getMediaIcon = (type: string) => {
        if (type === 'IMAGE') return <ImageIcon className="h-5 w-5" />
        if (type === 'VIDEO') return <VideoIcon className="h-5 w-5" />
        return <FileIcon className="h-5 w-5" />
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
                        <p className="text-gray-600">Manage your images, videos, and documents</p>
                    </div>
                    <Button onClick={() => setShowUpload(true)}>
                        <UploadIcon className="mr-2 h-4 w-4" />
                        Upload Media
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search media..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        <option value="general">General</option>
                        <option value="branding">Branding</option>
                        <option value="hero">Hero</option>
                        <option value="content">Content</option>
                        <option value="gallery">Gallery</option>
                    </select>

                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Types</option>
                        <option value="IMAGE">Images</option>
                        <option value="VIDEO">Videos</option>
                        <option value="DOCUMENT">Documents</option>
                    </select>

                    {/* View Mode */}
                    <div className="flex border border-gray-300 rounded-md">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <GridIcon className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <ListIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : media.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        <div className="text-center">
                            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium mb-2">No media found</p>
                            <p className="text-sm">Upload some files to get started</p>
                            <Button className="mt-4" onClick={() => setShowUpload(true)}>
                                <UploadIcon className="mr-2 h-4 w-4" />
                                Upload Media
                            </Button>
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {media.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
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
                                <div className="p-3">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {item.fileName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(item.fileSize)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {item.createdAt ? formatDate(item.createdAt) : 'Unknown date'}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="px-3 pb-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(item.id)}
                                        className="w-full text-red-600 hover:text-red-700"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        File
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Size
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {media.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {item.type === 'IMAGE' ? (
                                                        <img
                                                            src={item.url}
                                                            alt={item.altText || item.fileName}
                                                            className="h-10 w-10 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                                                            {getMediaIcon(item.type)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.fileName}
                                                    </div>
                                                    {item.altText && (
                                                        <div className="text-sm text-gray-500">
                                                            {item.altText}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatFileSize(item.fileSize)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.createdAt ? formatDate(item.createdAt) : 'Unknown date'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-8">
                        <Button
                            variant="outline"
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
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold">Upload Media</h2>
                            <Button variant="outline" onClick={() => setShowUpload(false)}>
                                Close
                            </Button>
                        </div>
                        <div className="p-6">
                            <MediaUpload
                                onUpload={handleUpload}
                                multiple={true}
                                placeholder="Upload images, videos, or documents"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}