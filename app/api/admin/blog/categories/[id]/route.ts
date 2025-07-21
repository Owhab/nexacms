import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { UpdateBlogCategorySchema } from '@/lib/validations/blog'
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

        const category = await prisma.blogCategory.findUnique({
            where: { id: params.id },
            include: {
                posts: {
                    where: {
                        status: 'PUBLISHED'
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true
                            }
                        },
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
                        publishedAt: 'desc'
                    },
                    take: 10
                },
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        })

        if (!category) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Blog category not found'
            }, { status: 404 })
        }

        // Format the response
        const formattedCategory = {
            ...category,
            posts: category.posts.map(post => ({
                ...post,
                tags: post.tags.map(pt => pt.tag),
                commentCount: post._count.comments
            })),
            postCount: category._count.posts
        }

        return NextResponse.json({ category: formattedCategory })
    } catch (error) {
        console.error('Error fetching blog category:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to fetch blog category'
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
                message: 'You do not have permission to update categories'
            }, { status: 403 })
        }

        // Check if category exists
        const existingCategory = await prisma.blogCategory.findUnique({
            where: { id: params.id }
        })

        if (!existingCategory) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Blog category not found'
            }, { status: 404 })
        }

        const body = await request.json()

        // Validate request body
        const validatedData = UpdateBlogCategorySchema.parse(body)

        // Check name and slug uniqueness if they're being updated
        if (validatedData.name || validatedData.slug) {
            const nameToCheck = validatedData.name || existingCategory.name
            const slugToCheck = validatedData.slug || existingCategory.slug

            const conflictingCategory = await prisma.blogCategory.findFirst({
                where: {
                    id: { not: params.id },
                    OR: [
                        { name: nameToCheck },
                        { slug: slugToCheck }
                    ]
                }
            })

            if (conflictingCategory) {
                const isNameConflict = conflictingCategory.name === nameToCheck
                return NextResponse.json({
                    error: 'Conflict',
                    message: isNameConflict
                        ? 'A category with this name already exists'
                        : 'A category with this slug already exists',
                    details: isNameConflict
                        ? { name: ['Category name must be unique'] }
                        : { slug: ['Slug must be unique'] }
                }, { status: 409 })
            }
        }

        // Update category
        const category = await prisma.blogCategory.update({
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
        const formattedCategory = {
            ...category,
            postCount: category._count.posts
        }

        return NextResponse.json({ category: formattedCategory })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                error: 'Bad Request',
                message: 'Validation failed',
                details: error.flatten().fieldErrors
            }, { status: 400 })
        }

        console.error('Error updating blog category:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to update blog category'
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
                message: 'Only administrators can delete categories'
            }, { status: 403 })
        }

        // Check if category exists
        const existingCategory = await prisma.blogCategory.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        })

        if (!existingCategory) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Blog category not found'
            }, { status: 404 })
        }

        // Check if category has posts
        if (existingCategory._count.posts > 0) {
            return NextResponse.json({
                error: 'Conflict',
                message: 'Cannot delete category with associated posts',
                details: { category: ['Remove or reassign all posts before deleting this category'] }
            }, { status: 409 })
        }

        // Delete the category
        await prisma.blogCategory.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            message: 'Blog category deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting blog category:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to delete blog category'
        }, { status: 500 })
    }
}