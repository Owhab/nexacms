'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TagForm {
    name: string
    slug: string
    color: string
}

export default function NewTagPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<TagForm>({
        name: '',
        slug: '',
        color: '#64748b'
    })

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData(prev => {
            const updated = { ...prev, [name]: value }

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
            const response = await fetch('/api/admin/blog/tags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to create tag')
            }

            router.push('/admin/blog')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create tag')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create New Tag</h1>
                <p className="text-gray-600">Add a new tag to label your blog posts.</p>
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
                                maxLength={50}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="JavaScript, React, Tutorial, etc."
                            />
                            <p className="text-xs text-gray-500 mt-1">{formData.name.length}/50 characters</p>
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
                                maxLength={50}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="javascript, react, tutorial, etc."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Used in URLs. Should be lowercase and contain only letters, numbers, and hyphens. {formData.slug.length}/50 characters
                            </p>
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
                                    placeholder="#64748b"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Color used for tag badges and highlights.</p>
                        </div>

                        {/* Preview */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                            <div className="flex items-center space-x-2">
                                <span
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                                    style={{
                                        backgroundColor: formData.color + '20',
                                        color: formData.color
                                    }}
                                >
                                    #{formData.name || 'tag-name'}
                                </span>
                                <span className="text-gray-500">← This is how the tag will appear</span>
                            </div>
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
                        {loading ? 'Creating...' : 'Create Tag'}
                    </button>
                </div>
            </form>
        </div>
    )
}