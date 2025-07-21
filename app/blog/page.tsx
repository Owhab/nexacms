import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteNavigation } from '@/components/public/SiteNavigation'
import { SiteFooter } from '@/components/public/SiteFooter'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt?: string
    featuredImage?: string
    publishedAt: Date
    readingTime?: number
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

async function getBlogPosts(): Promise<BlogPost[]> {
    try {
        const posts = await prisma.blogPost.findMany({
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
            }
        })

        return posts as BlogPost[]
    } catch (error) {
        console.error('Error fetching blog posts:', error)
        return []
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

export default async function BlogPage() {
    const posts = await getBlogPosts()

    if (posts.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <SiteNavigation />
                <div className="bg-gray-50 py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
                            <p className="text-gray-600">No blog posts available yet.</p>
                        </div>
                    </div>
                </div>
                <SiteFooter />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <SiteNavigation />
            <div className="bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
                        <p className="text-xl text-gray-600">
                            Insights, tutorials, and thoughts on web development
                        </p>
                    </div>

                    {/* Blog Posts */}
                    <div className="space-y-8">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {post.featuredImage && (
                                    <div className="aspect-w-16 aspect-h-9">
                                        <img
                                            src={post.featuredImage}
                                            alt={post.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                )}

                                <div className="p-6">
                                    {/* Category */}
                                    {post.category && (
                                        <div className="mb-3">
                                            <Link
                                                href={`/blog/category/${post.category.slug}`}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                                                style={{
                                                    backgroundColor: post.category.color + '20',
                                                    color: post.category.color || '#3b82f6'
                                                }}
                                            >
                                                {post.category.name}
                                            </Link>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="hover:text-blue-600 transition-colors"
                                        >
                                            {post.title}
                                        </Link>
                                    </h2>

                                    {/* Excerpt */}
                                    {post.excerpt && (
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    )}

                                    {/* Tags */}
                                    {post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.map((postTag) => (
                                                <Link
                                                    key={postTag.tag.slug}
                                                    href={`/blog/tag/${postTag.tag.slug}`}
                                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                                                    style={{
                                                        backgroundColor: postTag.tag.color + '20' || '#f3f4f6',
                                                        color: postTag.tag.color || '#6b7280'
                                                    }}
                                                >
                                                    #{postTag.tag.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* Meta */}
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                {post.author.avatar && (
                                                    <img
                                                        src={post.author.avatar}
                                                        alt={post.author.name}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                )}
                                                <span>By {post.author.name}</span>
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

                                        <div className="flex items-center space-x-4">
                                            <span>{post._count.comments} comments</span>
                                        </div>
                                    </div>

                                    {/* Read More */}
                                    <div className="mt-4">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Read more
                                            <svg
                                                className="ml-1 w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Pagination would go here */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-500">More posts coming soon...</p>
                    </div>
                </div>
            </div>
            <SiteFooter />
        </div>
    )
}