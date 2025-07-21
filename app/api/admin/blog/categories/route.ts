import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { BlogCategorySchema } from '@/lib/validations/blog'
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
        const includeInactive = searchParams.get('includeInactive') === 'true'

        // Build where clause
        let whereClause: any = {}
        if (!includeInactive) {
            whereClause.isActive = true
        }

        // Get all categories with post count
        const categories = await prisma.blogCategory.findMany({
            where: whereClause,
            include: {
                _count: {
                    select: {
                        posts: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        // Format the response
        const formattedCategories = categories.map(category => ({
            ...category,
            postCount: category._count.posts
        }))

        return NextResponse.json({ categories: formattedCategories })
    } catch (error) {
        console.error('Error fetching blog categories:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to fetch blog categories'
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
                message: 'You do not have permission to create categories'
            }, { status: 403 })
        }

        const body = await request.json()

        // Validate request body
        const validatedData = BlogCategorySchema.parse(body)

        // Check if name or slug is unique
        const existingCategory = await prisma.blogCategory.findFirst({
            where: {
                OR: [
                    { name: validatedData.name },
                    { slug: validatedData.slug }
                ]
            }
        })

        if (existingCategory) {
            return NextResponse.json({
                error: 'Conflict',
                message: existingCategory.name === validatedData.name
                    ? 'A category with this name already exists'
                    : 'A category with this slug already exists',
                details: existingCategory.name === validatedData.name
                    ? { name: ['Category name must be unique'] }
                    : { slug: ['Slug must be unique'] }
            }, { status: 409 })
        }

        // Create category
        const category = await prisma.blogCategory.create({
            data: validatedData,
            include: {
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        })

        const formattedCategory = {
            ...category,
            postCount: category._count.posts
        }

        return NextResponse.json({ category: formattedCategory }, { status: 201 })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                error: 'Bad Request',
                message: 'Validation failed',
                details: error.flatten().fieldErrors
            }, { status: 400 })
        }

        console.error('Error creating blog category:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to create blog category'
        }, { status: 500 })
    }
}