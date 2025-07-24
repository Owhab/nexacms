import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Suspense } from 'react'
import { SiteNavigation } from '@/components/public/SiteNavigation'
import { SiteFooter } from '@/components/public/SiteFooter'
import Image from 'next/image'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt?: string
    featuredImage?: string
    publishedAt: Date
    readingTime?: number
    viewCount: number
    author: {
        name: string
        avatar?: string
    }
    category?: {
        name: string
        slug: string
        color?: string
    }
    tags: Array<{
        tag: {
            name: string
            slug: string
            color?: string
        }
    }>
    _count: {
        comments: number
    }
}

interface BlogCategory {
    id: string
    name: string
    slug: string
    color?: string
    _count: {
        posts: number
    }
}

interface BlogTag {
    id: string
    name: string
    slug: string
    color?: string
    _count: {
        posts: number
    }
}

async function getBlogData() {
    try {
        const [posts, categories, tags] = await Promise.all([
            // Get published posts
            prisma.blogPost.findMany({
                where: {
                    status: 'PUBLISHED'
                },
                include: {
                    author: {
                        select: {
                            name: true,
                            avatar: true
                        }
                    },
                    category: {
                        select: {
                            name: true,
                            slug: true,
                            color: true
                        }
                    },
                    tags: {
                        include: {
                            tag: {
                                select: {
                                    name: true,
                                    slug: true,
                                    color: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            comments: {
                                where: {
                                    status: 'APPROVED'
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    publishedAt: 'desc'
                },
                take: 12 // Limit to 12 posts for better performance
            }),

            // Get categories with post counts
            prisma.blogCategory.findMany({
                where: {
                    isActive: true,
                    posts: {
                        some: {
                            status: 'PUBLISHED'
                        }
                    }
                },
                include: {
                    _count: {
                        select: {
                            posts: {
                                where: {
                                    status: 'PUBLISHED'
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            }),

            // Get popular tags
            prisma.blogTag.findMany({
                where: {
                    posts: {
                        some: {
                            post: {
                                status: 'PUBLISHED'
                            }
                        }
                    }
                },
                include: {
                    _count: {
                        select: {
                            posts: {
                                where: {
                                    post: {
                                        status: 'PUBLISHED'
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    posts: {
                        _count: 'desc'
                    }
                },
                take: 20
            })
        ])

        return {
            posts: posts as BlogPost[],
            categories: categories as BlogCategory[],
            tags: tags as BlogTag[]
        }
    } catch (error) {
        console.error('Error fetching blog data:', error)
        return {
            posts: [],
            categories: [],
            tags: []
        }
    }
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date))
}

function getReadingTimeText(minutes?: number): string {
    if (!minutes) return ''
    return `${minutes} min read`
}

function BlogPostCard({ post }: { post: BlogPost }) {
    return (
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
            {post.featuredImage && (
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                    <Image
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                </div>
            )}

            <div className="p-6">
                {/* Category */}
                {post.category && (
                    <div className="mb-3">
                        <Link
                            href={`/blogs/category/${post.category.slug}`}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                            style={{
                                backgroundColor: (post.category.color || '#3b82f6') + '20',
                                color: post.category.color || '#3b82f6'
                            }}
                        >
                            {post.category.name}
                        </Link>
                    </div>
                )}

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link
                        href={`/blogs/${post.slug}`}
                        className="hover:text-blue-600 transition-colors"
                    >
                        {post.title}
                    </Link>
                </h2>

                {/* Excerpt */}
                {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                        {post.excerpt}
                    </p>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((postTag) => (
                            <Link
                                key={postTag.tag.slug}
                                href={`/blogs/tag/${postTag.tag.slug}`}
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium hover:opacity-80 transition-opacity"
                                style={{
                                    backgroundColor: (postTag.tag.color || '#6b7280') + '20',
                                    color: postTag.tag.color || '#6b7280'
                                }}
                            >
                                #{postTag.tag.name}
                            </Link>
                        ))}
                        {post.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                        )}
                    </div>
                )}

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                            {post.author.avatar && (
                                <Image
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    className="w-4 h-4 rounded-full"
                                />
                            )}
                            <span>{post.author.name}</span>
                        </div>
                        <span>•</span>
                        <span>{formatDate(post.publishedAt)}</span>
                        {post.readingTime && (
                            <>
                                <span>•</span>
                                <span>{getReadingTimeText(post.readingTime)}</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center space-x-3">
                        <span>{post._count.comments} comments</span>
                        <span>•</span>
                        <span>{post.viewCount} views</span>
                    </div>
                </div>
            </div>
        </article>
    )
}

function BlogSidebar({ categories, tags }: { categories: BlogCategory[], tags: BlogTag[] }) {
    return (
        <aside className="space-y-8">
            {/* Categories */}
            {categories.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/blogs/category/${category.slug}`}
                                className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: category.color || '#3b82f6' }}
                                    />
                                    <span className="text-sm text-gray-700">{category.name}</span>
                                </div>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {category._count.posts}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Popular Tags */}
            {tags.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Link
                                key={tag.id}
                                href={`/blogs/tag/${tag.slug}`}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                                style={{
                                    backgroundColor: (tag.color || '#6b7280') + '20',
                                    color: tag.color || '#6b7280'
                                }}
                            >
                                #{tag.name}
                                <span className="ml-1 text-xs opacity-70">({tag._count.posts})</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Get the latest posts delivered right to your inbox.
                </p>
                <div className="space-y-2">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                        Subscribe
                    </button>
                </div>
            </div>
        </aside>
    )
}

function BlogsContent() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-12 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-lg p-6">
                                            <div className="h-48 bg-gray-200 rounded mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg p-6">
                                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                    <div className="space-y-2">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="h-4 bg-gray-200 rounded"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <BlogsPageContent />
        </Suspense>
    )
}

async function BlogsPageContent() {
    const { posts, categories, tags } = await getBlogData()

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Our Blog
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover insights, tutorials, and stories from our team. Stay updated with the latest trends and best practices.
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="max-w-md mx-auto">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No blog posts</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                We&apos;re working on some great content. Check back soon!
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {posts.map((post) => (
                                    <BlogPostCard key={post.id} post={post} />
                                ))}
                            </div>

                            {/* Load More Button */}
                            <div className="mt-12 text-center">
                                <button className="bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium">
                                    Load More Posts
                                </button>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <BlogSidebar categories={categories} tags={tags} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function BlogsPage() {
    return (
        <div className="min-h-screen bg-white">
            <SiteNavigation />
            <BlogsContent />
            <SiteFooter />
        </div>
    )
}