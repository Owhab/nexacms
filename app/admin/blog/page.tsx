'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt?: string
    status: string
    author: {
        id: string
        name: string
        email: string
    }
    category?: {
        id: string
        name: string
    }
    tags: Array<{
        id: string
        name: string
    }>
    commentCount: number
    createdAt: string
    updatedAt: string
    publishedAt?: string
}

interface BlogCategory {
    id: string
    name: string
    slug: string
    postCount: number
}

interface BlogTag {
    id: string
    name: string
    slug: string
    postCount: number
}

export default function BlogManagementPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [categories, setCategories] = useState<BlogCategory[]>([])
    const [tags, setTags] = useState<BlogTag[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'posts' | 'categories' | 'tags'>('posts')
    const router = useRouter()

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)

            if (activeTab === 'posts') {
                const response = await fetch('/api/admin/blog/posts')
                if (!response.ok) throw new Error('Failed to fetch posts')
                const data = await response.json()
                setPosts(data.posts)
            } else if (activeTab === 'categories') {
                const response = await fetch('/api/admin/blog/categories')
                if (!response.ok) throw new Error('Failed to fetch categories')
                const data = await response.json()
                setCategories(data.categories)
            } else if (activeTab === 'tags') {
                const response = await fetch('/api/admin/blog/tags')
                if (!response.ok) throw new Error('Failed to fetch tags')
                const data = await response.json()
                setTags(data.tags)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab])


    const handleDeletePost = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return

        try {
            const response = await fetch(`/api/admin/blog/posts/${postId}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Failed to delete post')

            setPosts(posts.filter(post => post.id !== postId))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete post')
        }
    }

    const handleDeleteCategory = async (categoryId: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return

        try {
            const response = await fetch(`/api/admin/blog/categories/${categoryId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to delete category')
            }

            setCategories(categories.filter(category => category.id !== categoryId))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete category')
        }
    }

    const handleDeleteTag = async (tagId: string) => {
        if (!confirm('Are you sure you want to delete this tag?')) return

        try {
            const response = await fetch(`/api/admin/blog/tags/${tagId}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Failed to delete tag')

            setTags(tags.filter(tag => tag.id !== tagId))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete tag')
        }
    }

    const getStatusBadge = (status: string) => {
        const colors = {
            DRAFT: 'bg-gray-100 text-gray-800',
            PUBLISHED: 'bg-green-100 text-green-800',
            SCHEDULED: 'bg-blue-100 text-blue-800',
            ARCHIVED: 'bg-red-100 text-red-800'
        }

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        )
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Management</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { key: 'posts', label: 'Posts', count: posts.length },
                            { key: 'categories', label: 'Categories', count: categories.length },
                            { key: 'tags', label: 'Tags', count: tags.length }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Posts Tab */}
            {activeTab === 'posts' && (
                <div>
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Blog Posts</h2>
                        <button
                            onClick={() => router.push('/admin/blog/posts/new')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            New Post
                        </button>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {posts.map((post) => (
                                <li key={post.id}>
                                    <div className="px-4 py-4 flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
                                                {getStatusBadge(post.status)}
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600">{post.excerpt}</p>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                                                <span>By {post.author.name}</span>
                                                {post.category && <span>in {post.category.name}</span>}
                                                <span>{post.commentCount} comments</span>
                                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            {post.tags.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {post.tags.map((tag) => (
                                                        <span
                                                            key={tag.id}
                                                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => router.push(`/admin/blog/posts/${post.id}/edit`)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeletePost(post.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <div>
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Categories</h2>
                        <button
                            onClick={() => router.push('/admin/blog/categories/new')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            New Category
                        </button>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <div className="px-4 py-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                                            <p className="text-sm text-gray-600">Slug: {category.slug}</p>
                                            <p className="text-sm text-gray-500">{category.postCount} posts</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => router.push(`/admin/blog/categories/${category.id}/edit`)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="text-red-600 hover:text-red-800"
                                                disabled={category.postCount > 0}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Tags Tab */}
            {activeTab === 'tags' && (
                <div>
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Tags</h2>
                        <button
                            onClick={() => router.push('/admin/blog/tags/new')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            New Tag
                        </button>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {tags.map((tag) => (
                                <li key={tag.id}>
                                    <div className="px-4 py-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{tag.name}</h3>
                                            <p className="text-sm text-gray-600">Slug: {tag.slug}</p>
                                            <p className="text-sm text-gray-500">{tag.postCount} posts</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => router.push(`/admin/blog/tags/${tag.id}/edit`)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTag(tag.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}