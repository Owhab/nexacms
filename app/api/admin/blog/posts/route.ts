import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { CreateBlogPostSchema } from '@/lib/validations/blog'
import { ZodError } from 'zod'

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
        if (!payload) {
            return NextResponse.json({
                error: 'Unauthorized',
                message: 'Invalid authentication token'
            }, { status: 401 })
        }

        // Parse query parameters
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const status = searchParams.get('status')
        const categoryId = searchParams.get('categoryId')
        const tagId = searchParams.get('tagId')
        const search = searchParams.get('search')
        const sortBy = searchParams.get('sortBy') || 'createdAt'
        const sortOrder = searchParams.get('sortOrder') || 'desc'
        const authorId = searchParams.get('authorId')

        // Build where clause
        let whereClause: any = {}

        // Filter by status
        if (status) {
            whereClause.status = status
        }

        // Filter by category
        if (categoryId) {
            whereClause.categoryId = categoryId
        }

        // Filter by author
        if (authorId) {
            whereClause.authorId = authorId
        }

        // Filter by tag
        if (tagId) {
            whereClause.tags = {
                some: {
                    tagId
                }
            }
        }

        // Search in title, excerpt, or content
        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ]
        }

        // For non-admin users, apply visibility restrictions
        if (payload.role !== 'ADMIN') {
            if (payload.role === 'EDITOR') {
                // Editors can see all published posts and their own drafts
                whereClause.OR = [
                    { status: 'PUBLISHED' },
                    { authorId: payload.userId }
                ]
            } else {
                // Viewers can only see published posts
                whereClause.status = 'PUBLISHED'
            }
        }

        // Calculate pagination
        const skip = (page - 1) * limit

        // Get total count for pagination
        const totalPosts = await prisma.blogPost.count({ where: whereClause })
        const totalPages = Math.ceil(totalPosts / limit)

        // Get posts with pagination, sorting, and includes
        const posts = await prisma.blogPost.findMany({
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
                category: true,
                tags: {
                    include: {
                        tag: true
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
                [sortBy]: sortOrder
            },
            skip,
            take: limit
        })

        // Format the response
        const formattedPosts = posts.map(post => ({
            ...post,
            tags: post.tags.map(pt => pt.tag),
            commentCount: post._count.comments
        }))

        return NextResponse.json({
            posts: formattedPosts,
            pagination: {
                page,
                limit,
                totalPosts,
                totalPages
            }
        })
    } catch (error) {
        console.error('Error fetching blog posts:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to fetch blog posts'
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
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
                message: 'You do not have permission to create blog posts'
            }, { status: 403 })
        }

        const body = await request.json()

        // Validate request body
        const validatedData = CreateBlogPostSchema.parse(body)

        // Check if slug is unique
        const existingPost = await prisma.blogPost.findUnique({
            where: { slug: validatedData.slug }
        })

        if (existingPost) {
            return NextResponse.json({
                error: 'Conflict',
                message: 'A post with this slug already exists',
                details: { slug: ['Slug must be unique'] }
            }, { status: 409 })
        }

        // Extract tags from validated data
        const { tags, ...postData } = validatedData

        // Create post with tags
        const post = await prisma.blogPost.create({
            data: {
                ...postData,
                authorId: payload.userId,
                tags: tags && tags.length > 0 ? {
                    create: tags.map(tagId => ({
                        tag: {
                            connect: { id: tagId }
                        }
                    }))
                } : undefined
            },
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

        // Format the response
        const formattedPost = {
            ...post,
            tags: post.tags.map(pt => pt.tag)
        }

        return NextResponse.json({ post: formattedPost }, { status: 201 })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                error: 'Bad Request',
                message: 'Validation failed',
                details: error.flatten().fieldErrors
            }, { status: 400 })
        }

        console.error('Error creating blog post:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to create blog post'
        }, { status: 500 })
    }
}