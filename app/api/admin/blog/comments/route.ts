import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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
                message: 'Only administrators can access all comments'
            }, { status: 403 })
        }

        // Parse query parameters
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const status = searchParams.get('status') // 'APPROVED', 'PENDING', 'REJECTED', 'SPAM'
        const postId = searchParams.get('postId')
        const authorId = searchParams.get('authorId')

        // Build where clause
        let whereClause: any = {}

        // Filter by approval status
        if (status) {
            whereClause.status = status
        }

        // Filter by post
        if (postId) {
            whereClause.postId = postId
        }

        // Filter by author
        if (authorId) {
            whereClause.authorId = authorId
        }

        // Calculate pagination
        const skip = (page - 1) * limit

        // Get total count for pagination
        const totalComments = await prisma.blogComment.count({ where: whereClause })
        const totalPages = Math.ceil(totalComments / limit)

        // Get comments with pagination
        const comments = await prisma.blogComment.findMany({
            where: whereClause,
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
                },
                _count: {
                    select: {
                        replies: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limit
        })

        // Format the response
        const formattedComments = comments.map(comment => ({
            ...comment,
            replyCount: comment._count.replies
        }))

        return NextResponse.json({
            comments: formattedComments,
            pagination: {
                page,
                limit,
                totalComments,
                totalPages
            }
        })
    } catch (error) {
        console.error('Error fetching blog comments:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to fetch blog comments'
        }, { status: 500 })
    }
}