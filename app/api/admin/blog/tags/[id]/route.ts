import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { UpdateBlogTagSchema } from '@/lib/validations/blog'
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

        const tag = await prisma.blogTag.findUnique({
            where: { id: params.id },
            include: {
                posts: {
                    where: {
                        post: {
                            status: 'PUBLISHED'
                        }
                    },
                    include: {
                        post: {
                            include: {
                                author: {
                                    select: {
                                        id: true,
                                        name: true,
                                        avatar: true
                                    }
                                },
                                category: true,
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
                        }
                    },
                    orderBy: {
                        post: {
                            publishedAt: 'desc'
                        }
                    },
                    take: 10
                },
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
            }
        })

        if (!tag) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Blog tag not found'
            }, { status: 404 })
        }

        // Format the response
        const formattedTag = {
            ...tag,
            posts: tag.posts.map(pt => ({
                ...pt.post,
                commentCount: pt.post._count.comments
            })),
            postCount: tag._count.posts
        }

        return NextResponse.json({ tag: formattedTag })
    } catch (error) {
        console.error('Error fetching blog tag:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to fetch blog tag'
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
        if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'EDITOR')) {
            return NextResponse.json({
                error: 'Forbidden',
                message: 'You do not have permission to update tags'
            }, { status: 403 })
        }

        // Check if tag exists
        const existingTag = await prisma.blogTag.findUnique({
            where: { id: params.id }
        })

        if (!existingTag) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Blog tag not found'
            }, { status: 404 })
        }

        const body = await request.json()

        // Validate request body
        const validatedData = UpdateBlogTagSchema.parse(body)

        // Check name and slug uniqueness if they're being updated
        if (validatedData.name || validatedData.slug) {
            const nameToCheck = validatedData.name || existingTag.name
            const slugToCheck = validatedData.slug || existingTag.slug

            const conflictingTag = await prisma.blogTag.findFirst({
                where: {
                    id: { not: params.id },
                    OR: [
                        { name: nameToCheck },
                        { slug: slugToCheck }
                    ]
                }
            })

            if (conflictingTag) {
                const isNameConflict = conflictingTag.name === nameToCheck
                return NextResponse.json({
                    error: 'Conflict',
                    message: isNameConflict
                        ? 'A tag with this name already exists'
                        : 'A tag with this slug already exists',
                    details: isNameConflict
                        ? { name: ['Tag name must be unique'] }
                        : { slug: ['Slug must be unique'] }
                }, { status: 409 })
            }
        }

        // Update tag
        const tag = await prisma.blogTag.update({
            where: { id: params.id },
            data: validatedData,
            include: {
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        })

        // Format the response
        const formattedTag = {
            ...tag,
            postCount: tag._count.posts
        }

        return NextResponse.json({ tag: formattedTag })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                error: 'Bad Request',
                message: 'Validation failed',
                details: error.flatten().fieldErrors
            }, { status: 400 })
        }

        console.error('Error updating blog tag:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to update blog tag'
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
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({
                error: 'Forbidden',
                message: 'Only administrators can delete tags'
            }, { status: 403 })
        }

        // Check if tag exists
        const existingTag = await prisma.blogTag.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        })

        if (!existingTag) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Blog tag not found'
            }, { status: 404 })
        }

        // Delete the tag (cascade will handle post-tag relationships)
        await prisma.blogTag.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            message: 'Blog tag deleted successfully',
            postCount: existingTag._count.posts
        })
    } catch (error) {
        console.error('Error deleting blog tag:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to delete blog tag'
        }, { status: 500 })
    }
}