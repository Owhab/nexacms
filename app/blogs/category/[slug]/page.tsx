import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
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
    viewCount: number
    author: {
        name: string
        avatar?: string
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
    description?: string
    color?: string
    posts: BlogPost[]
    _count: {
        posts: number
    }
}

async function getCategoryWithPosts(slug: string): Promise<BlogCategory | null> {
    try {
        const category = await prisma.blogCategory.findUnique({
            where: {
                slug,
                isActive: true
            },
            include: {
                posts: {
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
                },
                _count: {
                    select: {
                        posts: {
                            where: {
                                status: 'PUBLISHED'
                            }
                        }
                    }
                }
            }
        })

        return category as BlogCategory | null
    } catch (error) {
        console.error('Error fetching category:', error)
        return null
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const category = await getCategoryWithPosts(params.slug)

    if (!category) {
        return {
            title: 'Category Not Found'
        }
    }

    return {
        title: `${category.name} - Blog Category`,
        description: category.description || `Browse all posts in the ${category.name} category`,
        openGraph: {
            title: `${category.name} - Blog Category`,
            description: category.description || `Browse all posts in the ${category.name} category`,
            type: 'website'
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
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                </div>
            )}

            <div className="p-6">
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
                                <img
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

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const category = await getCategoryWithPosts(params.slug)

    if (!category) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-white">
            <SiteNavigation />
            <div className="bg-gray-50 py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <ol className="flex items-center space-x-2 text-sm text-gray-500">
                            <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
                            <li>/</li>
                            <li><Link href="/blogs" className="hover:text-gray-700">Blog</Link></li>
                            <li>/</li>
                            <li className="text-gray-900">{category.name}</li>
                        </ol>
                    </nav>

                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="mb-4">
                            <span
                                className="inline-flex items-center px-6 py-3 rounded-full text-lg font-medium"
                                style={{
                                    backgroundColor: (category.color || '#3b82f6') + '20',
                                    color: category.color || '#3b82f6'
                                }}
                            >
                                {category.name}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {category.name} Posts
                        </h1>

                        {category.description && (
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
                                {category.description}
                            </p>
                        )}

                        <p className="text-gray-500">
                            {category._count.posts} {category._count.posts === 1 ? 'post' : 'posts'} in this category
                        </p>
                    </div>

                    {category.posts.length === 0 ? (
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
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    There are no published posts in this category yet.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/blogs"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Browse All Posts
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Posts Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {category.posts.map((post) => (
                                    <BlogPostCard key={post.id} post={post} />
                                ))}
                            </div>

                            {/* Back to Blog */}
                            <div className="text-center">
                                <Link
                                    href="/blogs"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    <svg
                                        className="mr-2 w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                    Back to All Posts
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <SiteFooter />
        </div>
    )
}