'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'

interface BlogCategory {
    id: string
    name: string
    slug: string
    description?: string
    color?: string
    isActive: boolean
}

interface CategoryForm {
    name: string
    slug: string
    description: string
    color: string
    isActive: boolean
}

export default function EditCategoryPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [category, setCategory] = useState<BlogCategory | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<CategoryForm>({
        name: '',
        slug: '',
        description: '',
        color: '#3b82f6',
        isActive: true
    })

const fetchCategory = async () => {
        try {
            setLoading(true)

            const response = await fetch(`/api/admin/blog/categories/${params.id}`)

            if (!response.ok) {
                if (response.status === 404) {
                    notFound()
                }
                throw new Error('Failed to fetch category')
            }

            const data = await response.json()
            const category = data.category

            setCategory(category)
            setFormData({
                name: category.name || '',
                slug: category.slug || '',
                description: category.description || '',
                color: category.color || '#3b82f6',
                isActive: category.isActive ?? true
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load category')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id])


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

            // Auto-generate slug when name changes (only if slug hasn't been manually edited)
            if (name === 'name' && category && prev.slug === category.slug) {
                updated.slug = generateSlug(value)
            }

            return updated
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            const response = await fetch(`/api/admin/blog/categories/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to update category')
            }

            router.push('/admin/blog')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update category')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (!category) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
                    <p className="text-gray-600 mb-4">The category you&apos;re looking for doesn&apos;t exist.</p>
                    <button
                        onClick={() => router.push('/admin/blog')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Back to Blog
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
                <p className="text-gray-600">Update the category details.</p>
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
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Update Category'}
                    </button>
                </div>
            </form>
        </div>
    )
}