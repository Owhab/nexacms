'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CategoryForm {
    name: string
    slug: string
    description: string
    color: string
    isActive: boolean
}

export default function NewCategoryPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<CategoryForm>({
        name: '',
        slug: '',
        description: '',
        color: '#3b82f6',
        isActive: true
    })

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target

        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
            }

            // Auto-generate slug when name changes
            if (name === 'name' && !prev.slug) {
                updated.slug = generateSlug(value)
            }

            return updated
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/admin/blog/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to create category')
            }

            router.push('/admin/blog')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create category')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create New Category</h1>
                <p className="text-gray-600">Add a new category to organize your blog posts.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Technology, Design, etc."
                            />
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                                Slug *
                            </label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="technology, design, etc."
                            />
                            <p className="text-xs text-gray-500 mt-1">Used in URLs. Should be lowercase and contain only letters, numbers, and hyphens.</p>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Brief description of this category..."
                            />
                        </div>

                        <div>
                            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                                Color
                            </label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="color"
                                    id="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    name="color"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="#3b82f6"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Color used for category badges and highlights.</p>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                                Active (visible to users)
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/blog')}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating...' : 'Create Category'}
                    </button>
                </div>
            </form>
        </div>
    )
}