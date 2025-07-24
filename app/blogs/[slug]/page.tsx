import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { SiteNavigation } from '@/components/public/SiteNavigation'
import { SiteFooter } from '@/components/public/SiteFooter'
import Image from 'next/image'

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
        id: string
        name: string
        slug: string
        color?: string
    }
    tags: Array<{
        tag: {
            id: string
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

interface RelatedPost {
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
                        id: true,
                        name: true,
                        slug: true,
                        color: true
                    }
                },
                tags: {
                    include: {
                        tag: {
                            select: {
                                id: true,
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

async function getRelatedPosts(postId: string, categoryId?: string, tagIds: string[] = []): Promise<RelatedPost[]> {
    try {
        const posts = await prisma.blogPost.findMany({
            where: {
                id: { not: postId },
                status: 'PUBLISHED',
                OR: [
                    categoryId ? { categoryId } : {},
                    tagIds.length > 0 ? {
                        tags: {
                            some: {
                                tagId: { in: tagIds }
                            }
                        }
                    } : {}
                ]
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
                publishedAt: 'desc'
            },
            take: 3
        })

        return posts as RelatedPost[]
    } catch (error) {
        console.error('Error fetching related posts:', error)
        return []
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
        },
        twitter: {
            card: 'summary_large_image',
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt,
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

// Enhanced markdown-like content renderer
function renderContent(content: string): string {
    return content
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-8 text-gray-900">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 mt-8 text-gray-900">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3 mt-6 text-gray-900">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/```([\\s\\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 text-sm"><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
        .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
        .replace(/\\n\\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
        .replace(/\\n/g, '<br>')
}

function ShareButtons({ post }: { post: BlogPost }) {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = post.title

    return (
        <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Share:</span>
            <div className="flex space-x-2">
                <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    aria-label="Share on Twitter"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                </a>
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    aria-label="Share on Facebook"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </a>
                <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                    aria-label="Share on LinkedIn"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

function RelatedPosts({ posts }: { posts: RelatedPost[] }) {
    if (posts.length === 0) return null

    return (
        <section className="mt-16 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        {post.featuredImage && (
                            <div className="aspect-w-16 aspect-h-9">
                                <Image
                                    src={post.featuredImage}
                                    alt={post.title}
                                    className="w-full h-32 object-cover"
                                />
                            </div>
                        )}
                        <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                <Link
                                    href={`/blogs/${post.slug}`}
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    {post.title}
                                </Link>
                            </h4>
                            {post.excerpt && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {post.excerpt}
                                </p>
                            )}
                            <div className="flex items-center text-xs text-gray-500">
                                <span>{post.author.name}</span>
                                <span className="mx-2">•</span>
                                <span>{formatDate(post.publishedAt)}</span>
                                {post.readingTime && (
                                    <>
                                        <span className="mx-2">•</span>
                                        <span>{getReadingTimeText(post.readingTime)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getBlogPost(params.slug)

    if (!post) {
        notFound()
    }

    const relatedPosts = await getRelatedPosts(
        post.id,
        post.category?.id,
        post.tags.map(t => t.tag.id)
    )

    return (
        <div className="min-h-screen bg-white">
            <SiteNavigation />
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-gray-50 to-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <ol className="flex items-center space-x-2 text-sm text-gray-500">
                            <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
                            <li>/</li>
                            <li><Link href="/blogs" className="hover:text-gray-700">Blog</Link></li>
                            {post.category && (
                                <>
                                    <li>/</li>
                                    <li>
                                        <Link
                                            href={`/blogs/category/${post.category.slug}`}
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
                        <div className="mb-6">
                            <Link
                                href={`/blogs/category/${post.category.slug}`}
                                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
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
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
                        <div className="flex items-center space-x-3">
                            {post.author.avatar && (
                                <Image
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    className="w-10 h-10 rounded-full"
                                />
                            )}
                            <div>
                                <p className="font-medium text-gray-900">{post.author.name}</p>
                                <p className="text-sm">{formatDate(post.publishedAt)}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm">
                            {post.readingTime && (
                                <span>{getReadingTimeText(post.readingTime)}</span>
                            )}
                            <span>•</span>
                            <span>{post.viewCount} views</span>
                            <span>•</span>
                            <span>{post.comments.length} comments</span>
                        </div>
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {post.tags.map((postTag) => (
                                <Link
                                    key={postTag.tag.slug}
                                    href={`/blogs/tag/${postTag.tag.slug}`}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                                    style={{
                                        backgroundColor: (postTag.tag.color || '#6b7280') + '20',
                                        color: postTag.tag.color || '#6b7280'
                                    }}
                                >
                                    #{postTag.tag.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Share Buttons */}
                    <ShareButtons post={post} />
                </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
                    <Image
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-64 md:h-96 object-cover rounded-xl shadow-2xl"
                    />
                </div>
            )}

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="prose prose-lg max-w-none">
                    <div
                        className="text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: `<p class="mb-4 text-gray-700 leading-relaxed">${renderContent(post.content)}</p>`
                        }}
                    />
                </div>

                {/* Share Buttons Bottom */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <ShareButtons post={post} />
                </div>

                {/* Comments Section */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">
                        Comments ({post.comments.length})
                    </h3>

                    {post.comments.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {post.comments.map((comment) => (
                                <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-start space-x-4">
                                        {comment.author.avatar && (
                                            <Image
                                                src={comment.author.avatar}
                                                alt={comment.author.name}
                                                className="w-10 h-10 rounded-full flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h4 className="font-medium text-gray-900">{comment.author.name}</h4>
                                                <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                                            </div>
                                            <p className="text-gray-800 mb-4">{comment.content}</p>

                                            {/* Replies */}
                                            {comment.replies.length > 0 && (
                                                <div className="ml-6 space-y-4 border-l-2 border-gray-200 pl-6">
                                                    {comment.replies.map((reply) => (
                                                        <div key={reply.id} className="bg-white rounded-lg p-4">
                                                            <div className="flex items-start space-x-3">
                                                                {reply.author.avatar && (
                                                                    <Image
                                                                        src={reply.author.avatar}
                                                                        alt={reply.author.name}
                                                                        className="w-8 h-8 rounded-full flex-shrink-0"
                                                                    />
                                                                )}
                                                                <div className="flex-1">
                                                                    <div className="flex items-center space-x-2 mb-1">
                                                                        <h5 className="font-medium text-gray-900 text-sm">{reply.author.name}</h5>
                                                                        <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                                                                    </div>
                                                                    <p className="text-gray-800 text-sm">{reply.content}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Related Posts */}
                <RelatedPosts posts={relatedPosts} />

                {/* Back to Blog */}
                <div className="mt-16 pt-8 border-t border-gray-200 text-center">
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
            </div>
            <SiteFooter />
        </div>
    )
}