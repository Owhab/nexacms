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
    content: string
    excerpt?: string
    featuredImage?: string
    publishedAt: Date
    readingTime?: number
    seoTitle?: string
    seoDescription?: string
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
    comments: Array<{
        id: string
        content: string
        createdAt: Date
        author: {
            name: string
            avatar?: string
        }
        replies: Array<{
            id: string
            content: string
            createdAt: Date
            author: {
                name: string
                avatar?: string
            }
        }>
    }>
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        const post = await prisma.blogPost.findUnique({
            where: {
                slug,
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
                comments: {
                    where: {
                        status: 'APPROVED',
                        parentId: null
                    },
                    include: {
                        author: {
                            select: {
                                name: true,
                                avatar: true
                            }
                        },
                        replies: {
                            where: {
                                status: 'APPROVED'
                            },
                            include: {
                                author: {
                                    select: {
                                        name: true,
                                        avatar: true
                                    }
                                }
                            },
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        })

        if (post) {
            // Increment view count
            await prisma.blogPost.update({
                where: { id: post.id },
                data: { viewCount: { increment: 1 } }
            })
        }

        return post as BlogPost | null
    } catch (error) {
        console.error('Error fetching blog post:', error)
        return null
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = await getBlogPost(params.slug)

    if (!post) {
        return {
            title: 'Post Not Found'
        }
    }

    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt,
            type: 'article',
            publishedTime: post.publishedAt.toISOString(),
            authors: [post.author.name],
            ...(post.featuredImage && { images: [post.featuredImage] })
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

// Simple markdown-like content renderer
function renderContent(content: string): string {
    return content
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 mt-8">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-6">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-4">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/```([\\s\\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
        .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
        .replace(/\\n\\n/g, '</p><p class="mb-4">')
        .replace(/\\n/g, '<br>')
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getBlogPost(params.slug)

    if (!post) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-white">
            <SiteNavigation />
            {/* Hero Section */}
            <div className="bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-6">
                        <ol className="flex items-center space-x-2 text-sm text-gray-500">
                            <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
                            <li>/</li>
                            <li><Link href="/blog" className="hover:text-gray-700">Blog</Link></li>
                            {post.category && (
                                <>
                                    <li>/</li>
                                    <li>
                                        <Link
                                            href={`/blog/category/${post.category.slug}`}
                                            className="hover:text-gray-700"
                                        >
                                            {post.category.name}
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ol>
                    </nav>

                    {/* Category */}
                    {post.category && (
                        <div className="mb-4">
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
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {post.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex items-center space-x-4 text-gray-600 mb-6">
                        <div className="flex items-center space-x-2">
                            {post.author.avatar && (
                                <img
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    className="w-8 h-8 rounded-full"
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
                        <span>•</span>
                        <span>{post.viewCount} views</span>
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((postTag) => (
                                <Link
                                    key={postTag.tag.slug}
                                    href={`/blog/tag/${postTag.tag.slug}`}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
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
                </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8">
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                    />
                </div>
            )}

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="prose prose-lg max-w-none">
                    <div
                        className="text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: `<p class="mb-4">${renderContent(post.content)}</p>`
                        }}
                    />
                </div>

                {/* Comments Section */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Comments ({post.comments.length})
                    </h3>

                    {post.comments.length === 0 ? (
                        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
                    ) : (
                        <div className="space-y-6">
                            {post.comments.map((comment) => (
                                <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        {comment.author.avatar && (
                                            <img
                                                src={comment.author.avatar}
                                                alt={comment.author.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">{comment.author.name}</p>
                                            <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-800 mb-4">{comment.content}</p>

                                    {/* Replies */}
                                    {comment.replies.length > 0 && (
                                        <div className="ml-6 space-y-4 border-l-2 border-gray-200 pl-6">
                                            {comment.replies.map((reply) => (
                                                <div key={reply.id} className="bg-white rounded-lg p-4">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        {reply.author.avatar && (
                                                            <img
                                                                src={reply.author.avatar}
                                                                alt={reply.author.name}
                                                                className="w-6 h-6 rounded-full"
                                                            />
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm">{reply.author.name}</p>
                                                            <p className="text-xs text-gray-500">{formatDate(reply.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-800 text-sm">{reply.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Back to Blog */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                        <svg
                            className="mr-2 w-4 h-4"
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
                        Back to Blog
                    </Link>
                </div>
            </div>
            <SiteFooter />
        </div>
    )
}