import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { UpdateBlogPostSchema } from '@/lib/validations/blog'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.cookies.get('auth-token')?.value
        if (!token) {
            return NextResponse.json({
                error: 'Unauthorized',
                message: 'Authentication token is required'
            }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({
                error: 'Unauthorized',
                message: 'Invalid authentication token'
            }, { status: 401 })
        }

        const post = await prisma.blogPost.findUnique({
            where: { id: params.id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                category: true,
                tags: {
                    include: {
                        tag: true
                    }
                },
                comments: {
                    where: {
                        parentId: null,
                        status: 'APPROVED'
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
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
                                        id: true,
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
            }
        })

        if (!post) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Blog post not found'
            }, { status: 404 })
        }

        // Check permissions for non-published posts
        if (post.status !== 'PUBLISHED') {
            // Only author, editors, or admins can see non-published posts
            if (payload.role !== 'ADMIN' && payload.role !== 'EDITOR' && post.authorId !== payload.userId) {
                return NextResponse.json({
                    error: 'Forbidden',
                    message: 'You do not have permission to view this post'
                }, { status: 403 })
            }
        }

        // Format the response
        const formattedPost = {
            ...post,
            tags: post.tags.map(pt => pt.tag),
            commentCount: post._count.comments
        }

        return NextResponse.json({ post: formattedPost })
    } catch (error) {
        console.error('Error fetching blog post:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to fetch blog post'
        }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.cookies.get('auth-token')?.value
        if (!token) {
            return NextResponse.json({
                error: 'Unauthorized',
                message: 'Authentication token is required'
            }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({
                error: 'Unauthorized',
                message: 'Invalid authentication token'
            }, { status: 401 })
        }

        // Check if post exists
        const existingPost = await prisma.blogPost.findUnique({
            where: { id: params.id },
            include: {
                tags: true
            }
        })

        if (!existingPost) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Blog post not found'
            }, { status: 404 })
        }

        // Check permissions
        if (payload.role !== 'ADMIN' && existingPost.authorId !== payload.userId) {
            return NextResponse.json({
                error: 'Forbidden',
                message: 'You do not have permission to update this post'
            }, { status: 403 })
        }

        const body = await request.json()

        // Validate request body
        const validatedData = UpdateBlogPostSchema.parse(body)

        // Check slug uniqueness if it's being updated
        if (validatedData.slug && validatedData.slug !== existingPost.slug) {
            const slugExists = await prisma.blogPost.findUnique({
                where: { slug: validatedData.slug }
            })

            if (slugExists) {
                return NextResponse.json({
                    error: 'Conflict',
                    message: 'A post with this slug already exists',
                    details: { slug: ['Slug must be unique'] }
                }, { status: 409 })
            }
        }

        // Extract tags from validated data
        const { tags, ...postData } = validatedData

        // Update post
        const updatedPost = await prisma.$transaction(async (tx) => {
            // If tags are provided, update them
            if (tags !== undefined) {
                // Delete existing tag relationships
                await tx.blogPostTag.deleteMany({
                    where: { postId: params.id }
                })

                // Create new tag relationships
                if (tags.length > 0) {
                    await tx.blogPostTag.createMany({
                        data: tags.map(tagId => ({
                            postId: params.id,
                            tagId
                        }))
                    })
                }
            }

            // Update the post
            return tx.blogPost.update({
                where: { id: params.id },
                data: postData,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true
                        }
                    },
                    category: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            })
        })

        // Format the response
        const formattedPost = {
            ...updatedPost,
            tags: updatedPost.tags.map(pt => pt.tag)
        }

        return NextResponse.json({ post: formattedPost })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                error: 'Bad Request',
                message: 'Validation failed',
                details: error.flatten().fieldErrors
            }, { status: 400 })
        }

        console.error('Error updating blog post:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to update blog post'
        }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.cookies.get('auth-token')?.value
        if (!token) {
            return NextResponse.json({
                error: 'Unauthorized',
                message: 'Authentication token is required'
            }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({
                error: 'Unauthorized',
                message: 'Invalid authentication token'
            }, { status: 401 })
        }

        // Check if post exists
        const existingPost = await prisma.blogPost.findUnique({
            where: { id: params.id }
        })

        if (!existingPost) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Blog post not found'
            }, { status: 404 })
        }

        // Check permissions
        if (payload.role !== 'ADMIN' && existingPost.authorId !== payload.userId) {
            return NextResponse.json({
                error: 'Forbidden',
                message: 'You do not have permission to delete this post'
            }, { status: 403 })
        }

        // Delete the post (cascade will handle related entities)
        await prisma.blogPost.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            message: 'Blog post deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting blog post:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to delete blog post'
        }, { status: 500 })
    }
}