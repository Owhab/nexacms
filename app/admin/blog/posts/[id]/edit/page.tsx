'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'

interface BlogCategory {
    id: string
    name: string
    slug: string
}

interface BlogTag {
    id: string
    name: string
    slug: string
}

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt?: string
    content: string
    featuredImage?: string
    status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    categoryId?: string
    readingTime?: number
    publishedAt?: string
    tags: Array<{
        id: string
        name: string
    }>
}

interface BlogPostForm {
    title: string
    slug: string
    excerpt: string
    content: string
    featuredImage: string
    status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'
    seoTitle: string
    seoDescription: string
    seoKeywords: string
    categoryId: string
    tags: string[]
    publishedAt: string
    readingTime: number
}

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [post, setPost] = useState<BlogPost | null>(null)
    const [categories, setCategories] = useState<BlogCategory[]>([])
    const [tags, setTags] = useState<BlogTag[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<BlogPostForm>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        status: 'DRAFT',
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
        categoryId: '',
        tags: [],
        publishedAt: '',
        readingTime: 0
    })

    const fetchData = async () => {
        try {
            setLoading(true)

            const [postRes, categoriesRes, tagsRes] = await Promise.all([
                fetch(`/api/admin/blog/posts/${params.id}`),
                fetch('/api/admin/blog/categories'),
                fetch('/api/admin/blog/tags')
            ])

            if (!postRes.ok) {
                if (postRes.status === 404) {
                    notFound()
                }
                throw new Error('Failed to fetch post')
            }

            const postData = await postRes.json()
            const post = postData.post

            setPost(post)
            setFormData({
                title: post.title || '',
                slug: post.slug || '',
                excerpt: post.excerpt || '',
                content: post.content || '',
                featuredImage: post.featuredImage || '',
                status: post.status || 'DRAFT',
                seoTitle: post.seoTitle || '',
                seoDescription: post.seoDescription || '',
                seoKeywords: post.seoKeywords || '',
                categoryId: post.categoryId || '',
                tags: post.tags.map((tag: any) => tag.id) || [],
                publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
                readingTime: post.readingTime || 0
            })

            if (categoriesRes.ok) {
                const categoriesData = await categoriesRes.json()
                setCategories(categoriesData.categories)
            }

            if (tagsRes.ok) {
                const tagsData = await tagsRes.json()
                setTags(tagsData.tags)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load post')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id])


    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        setFormData(prev => {
            const updated = { ...prev, [name]: value }

            // Auto-generate slug when title changes (only if slug hasn't been manually edited)
            if (name === 'title' && post && prev.slug === post.slug) {
                updated.slug = generateSlug(value)
            }

            return updated
        })
    }

    const handleTagChange = (tagId: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            tags: checked
                ? [...prev.tags, tagId]
                : prev.tags.filter(id => id !== tagId)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            const submitData = {
                ...formData,
                categoryId: formData.categoryId || null,
                publishedAt: formData.publishedAt || null,
                readingTime: formData.readingTime || null
            }

            const response = await fetch(`/api/admin/blog/posts/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to update post')
            }

            router.push('/admin/blog')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update post')
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
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
                    <p className="text-gray-600 mb-4">The blog post you&apos;re looking for doesn&apos;t exist.</p>
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
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
                <p className="text-gray-600">Update the details of your blog post.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                            Excerpt
                        </label>
                        <textarea
                            id="excerpt"
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Brief description of the post..."
                        />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                            Content *
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            required
                            rows={12}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Write your blog post content here..."
                        />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
                            Featured Image URL
                        </label>
                        <input
                            type="url"
                            id="featuredImage"
                            name="featuredImage"
                            value={formData.featuredImage}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                </div>

                {/* Publishing Options */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-lg font-semibold mb-4">Publishing Options</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="SCHEDULED">Scheduled</option>
                                <option value="ARCHIVED">Archived</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">No Category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="readingTime" className="block text-sm font-medium text-gray-700 mb-1">
                                Reading Time (minutes)
                            </label>
                            <input
                                type="number"
                                id="readingTime"
                                name="readingTime"
                                value={formData.readingTime}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {formData.status === 'SCHEDULED' && (
                        <div className="mt-4">
                            <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 mb-1">
                                Publish Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                id="publishedAt"
                                name="publishedAt"
                                value={formData.publishedAt}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-lg font-semibold mb-4">Tags</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {tags.map(tag => (
                                <label key={tag.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.tags.includes(tag.id)}
                                        onChange={(e) => handleTagChange(tag.id, e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{tag.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* SEO */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                SEO Title
                            </label>
                            <input
                                type="text"
                                id="seoTitle"
                                name="seoTitle"
                                value={formData.seoTitle}
                                onChange={handleInputChange}
                                maxLength={60}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Optimized title for search engines"
                            />
                            <p className="text-xs text-gray-500 mt-1">{formData.seoTitle.length}/60 characters</p>
                        </div>

                        <div>
                            <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                SEO Description
                            </label>
                            <textarea
                                id="seoDescription"
                                name="seoDescription"
                                value={formData.seoDescription}
                                onChange={handleInputChange}
                                maxLength={160}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Brief description for search engine results"
                            />
                            <p className="text-xs text-gray-500 mt-1">{formData.seoDescription.length}/160 characters</p>
                        </div>

                        <div>
                            <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 mb-1">
                                SEO Keywords
                            </label>
                            <input
                                type="text"
                                id="seoKeywords"
                                name="seoKeywords"
                                value={formData.seoKeywords}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="keyword1, keyword2, keyword3"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/blog')}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : 'Update Post'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}