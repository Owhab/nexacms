import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { UpdateBlogCommentSchema } from '@/lib/validations/blog'
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

        const comment = await prisma.blogComment.findUnique({
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
                post: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        authorId: true
                    }
                },
                parent: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                replies: {
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
            }
        })

        if (!comment) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Comment not found'
            }, { status: 404 })
        }

        // Check permissions for non-approved comments
        if (comment.status !== 'APPROVED') {
            // Only admins, the post author, or the comment author can see non-approved comments
            const isAdmin = payload.role === 'ADMIN'
            const isPostAuthor = comment.post.authorId === payload.userId
            const isCommentAuthor = comment.authorId === payload.userId

            if (!isAdmin && !isPostAuthor && !isCommentAuthor) {
                return NextResponse.json({
                    error: 'Forbidden',
                    message: 'You do not have permission to view this comment'
                }, { status: 403 })
            }
        }

        return NextResponse.json({ comment })
    } catch (error) {
        console.error('Error fetching comment:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to fetch comment'
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

        // Check if comment exists
        const existingComment = await prisma.blogComment.findUnique({
            where: { id: params.id },
            include: {
                post: {
                    select: {
                        authorId: true
                    }
                }
            }
        })

        if (!existingComment) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Comment not found'
            }, { status: 404 })
        }

        const body = await request.json()

        // Validate request body
        const validatedData = UpdateBlogCommentSchema.parse(body)

        // Check permissions
        const isAdmin = payload.role === 'ADMIN'
        const isPostAuthor = existingComment.post.authorId === payload.userId
        const isCommentAuthor = existingComment.authorId === payload.userId

        // Only admins can change approval status
        if (validatedData.status && !isAdmin) {
            return NextResponse.json({
                error: 'Forbidden',
                message: 'Only administrators can change comment approval status'
            }, { status: 403 })
        }

        // Only comment author, post author, or admin can edit content
        if (validatedData.content && !isAdmin && !isPostAuthor && !isCommentAuthor) {
            return NextResponse.json({
                error: 'Forbidden',
                message: 'You do not have permission to edit this comment'
            }, { status: 403 })
        }

        // Update comment
        const comment = await prisma.blogComment.update({
            where: { id: params.id },
            data: validatedData,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                parent: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json({ comment })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                error: 'Bad Request',
                message: 'Validation failed',
                details: error.flatten().fieldErrors
            }, { status: 400 })
        }

        console.error('Error updating comment:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to update comment'
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

        // Check if comment exists
        const existingComment = await prisma.blogComment.findUnique({
            where: { id: params.id },
            include: {
                post: {
                    select: {
                        authorId: true
                    }
                },
                _count: {
                    select: {
                        replies: true
                    }
                }
            }
        })

        if (!existingComment) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Comment not found'
            }, { status: 404 })
        }

        // Check permissions
        const isAdmin = payload.role === 'ADMIN'
        const isPostAuthor = existingComment.post.authorId === payload.userId
        const isCommentAuthor = existingComment.authorId === payload.userId

        if (!isAdmin && !isPostAuthor && !isCommentAuthor) {
            return NextResponse.json({
                error: 'Forbidden',
                message: 'You do not have permission to delete this comment'
            }, { status: 403 })
        }

        // Delete the comment (cascade will handle replies)
        await prisma.blogComment.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            message: 'Comment deleted successfully',
            repliesDeleted: existingComment._count.replies
        })
    } catch (error) {
        console.error('Error deleting comment:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to delete comment'
        }, { status: 500 })
    }
}