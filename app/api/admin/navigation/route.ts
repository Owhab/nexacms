import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { CreateNavigationMenuSchema, MenuLocationSchema } from '@/lib/validations/navigation'
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

        const { searchParams } = new URL(request.url)
        const location = searchParams.get('location')

        // Validate location parameter if provided
        let whereClause = {}
        if (location) {
            try {
                const validLocation = MenuLocationSchema.parse(location)
                whereClause = { location: validLocation }
            } catch (error) {
                return NextResponse.json({
                    error: 'Bad Request',
                    message: 'Invalid location parameter',
                    details: { location: ['Must be one of: HEADER_PRIMARY, HEADER_SECONDARY, FOOTER_PRIMARY, FOOTER_SECONDARY, SIDEBAR'] }
                }, { status: 400 })
            }
        }

        const menus = await prisma.navigationMenu.findMany({
            where: whereClause,
            include: {
                items: {
                    include: {
                        children: {
                            include: {
                                children: true, // Support 3 levels of nesting
                                page: { select: { id: true, title: true, slug: true } }
                            },
                            orderBy: { order: 'asc' }
                        },
                        page: { select: { id: true, title: true, slug: true } }
                    },
                    where: { parentId: null }, // Only get top-level items
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ menus })
    } catch (error) {
        console.error('Error fetching navigation menus:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to fetch navigation menus'
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
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({
                error: 'Forbidden',
                message: 'Admin privileges required'
            }, { status: 403 })
        }

        const body = await request.json()

        // Validate request body
        const validatedData = CreateNavigationMenuSchema.parse(body)

        // Check if menu with same name and location already exists
        const existingMenu = await prisma.navigationMenu.findFirst({
            where: {
                name: validatedData.name,
                location: validatedData.location
            }
        })

        if (existingMenu) {
            return NextResponse.json({
                error: 'Conflict',
                message: 'A menu with this name already exists in the specified location',
                details: { name: ['Menu name must be unique per location'] }
            }, { status: 409 })
        }

        const menu = await prisma.navigationMenu.create({
            data: {
                name: validatedData.name,
                location: validatedData.location,
                isActive: validatedData.isActive
            },
            include: {
                items: {
                    include: {
                        children: {
                            include: {
                                children: true,
                                page: { select: { id: true, title: true, slug: true } }
                            },
                            orderBy: { order: 'asc' }
                        },
                        page: { select: { id: true, title: true, slug: true } }
                    },
                    where: { parentId: null },
                    orderBy: { order: 'asc' }
                }
            }
        })

        return NextResponse.json({ menu }, { status: 201 })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                error: 'Bad Request',
                message: 'Validation failed',
                details: error.flatten().fieldErrors
            }, { status: 400 })
        }

        console.error('Error creating navigation menu:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to create navigation menu'
        }, { status: 500 })
    }
}