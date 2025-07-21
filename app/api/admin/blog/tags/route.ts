import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { BlogTagSchema } from '@/lib/validations/blog'
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
        const search = searchParams.get('search')
        const limit = parseInt(searchParams.get('limit') || '50')

        // Build where clause
        let whereClause: any = {}

        // Search in name
        if (search) {
            whereClause.name = {
                contains: search,
                mode: 'insensitive'
            }
        }

        // Get all tags with post count
        const tags = await prisma.blogTag.findMany({
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
            },
            take: limit
        })

        // Format the response
        const formattedTags = tags.map(tag => ({
            ...tag,
            postCount: tag._count.posts
        }))

        return NextResponse.json({ tags: formattedTags })
    } catch (error) {
        console.error('Error fetching blog tags:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to fetch blog tags'
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
                message: 'You do not have permission to create tags'
            }, { status: 403 })
        }

        const body = await request.json()

        // Validate request body
        const validatedData = BlogTagSchema.parse(body)

        // Check if name or slug is unique
        const existingTag = await prisma.blogTag.findFirst({
            where: {
                OR: [
                    { name: validatedData.name },
                    { slug: validatedData.slug }
                ]
            }
        })

        if (existingTag) {
            return NextResponse.json({
                error: 'Conflict',
                message: existingTag.name === validatedData.name
                    ? 'A tag with this name already exists'
                    : 'A tag with this slug already exists',
                details: existingTag.name === validatedData.name
                    ? { name: ['Tag name must be unique'] }
                    : { slug: ['Slug must be unique'] }
            }, { status: 409 })
        }

        // Create tag
        const tag = await prisma.blogTag.create({
            data: validatedData,
            include: {
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        })

        const formattedTag = {
            ...tag,
            postCount: tag._count.posts
        }

        return NextResponse.json({ tag: formattedTag }, { status: 201 })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                error: 'Bad Request',
                message: 'Validation failed',
                details: error.flatten().fieldErrors
            }, { status: 400 })
        }

        console.error('Error creating blog tag:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to create blog tag'
        }, { status: 500 })
    }
}