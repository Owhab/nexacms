import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { CreateNavigationItemSchema } from '@/lib/validations/navigation'
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

        // Check if menu exists
        const menu = await prisma.navigationMenu.findUnique({
            where: { id: params.id }
        })

        if (!menu) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Navigation menu not found'
            }, { status: 404 })
        }

        // Get hierarchical navigation items
        const items = await prisma.navigationItem.findMany({
            where: { menuId: params.id },
            include: {
                page: { select: { id: true, title: true, slug: true } },
                children: {
                    include: {
                        page: { select: { id: true, title: true, slug: true } },
                        children: {
                            include: {
                                page: { select: { id: true, title: true, slug: true } }
                            },
                            orderBy: { order: 'asc' }
                        }
                    },
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { order: 'asc' }
        })

        return NextResponse.json({ items })
    } catch (error) {
        console.error('Error fetching navigation items:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to fetch navigation items'
        }, { status: 500 })
    }
}

export async function POST(
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
                message: 'Admin privileges required'
            }, { status: 403 })
        }

        // Check if menu exists
        const menu = await prisma.navigationMenu.findUnique({
            where: { id: params.id }
        })

        if (!menu) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Navigation menu not found'
            }, { status: 404 })
        }

        const body = await request.json()

        // Validate request body
        const validatedData = CreateNavigationItemSchema.parse(body)

        // Validate parent exists if parentId is provided
        if (validatedData.parentId) {
            const parent = await prisma.navigationItem.findFirst({
                where: {
                    id: validatedData.parentId,
                    menuId: params.id
                }
            })

            if (!parent) {
                return NextResponse.json({
                    error: 'Bad Request',
                    message: 'Parent navigation item not found in this menu',
                    details: { parentId: ['Parent item must exist in the same menu'] }
                }, { status: 400 })
            }
        }

        // Validate page exists if pageId is provided
        if (validatedData.pageId) {
            const page = await prisma.page.findUnique({
                where: { id: validatedData.pageId }
            })

            if (!page) {
                return NextResponse.json({
                    error: 'Bad Request',
                    message: 'Referenced page not found',
                    details: { pageId: ['Page must exist'] }
                }, { status: 400 })
            }
        }

        // Get the next order if not provided
        let itemOrder = validatedData.order
        if (itemOrder === undefined) {
            const lastItem = await prisma.navigationItem.findFirst({
                where: {
                    menuId: params.id,
                    parentId: validatedData.parentId || null
                },
                orderBy: { order: 'desc' }
            })
            itemOrder = (lastItem?.order || 0) + 1
        }

        const item = await prisma.navigationItem.create({
            data: {
                menuId: params.id,
                parentId: validatedData.parentId || null,
                title: validatedData.title,
                url: validatedData.url || null,
                pageId: validatedData.pageId || null,
                target: validatedData.target,
                order: itemOrder,
                isVisible: validatedData.isVisible,
                cssClass: validatedData.cssClass || null,
                icon: validatedData.icon || null,
            },
            include: {
                page: { select: { id: true, title: true, slug: true } },
                children: {
                    include: {
                        page: { select: { id: true, title: true, slug: true } }
                    },
                    orderBy: { order: 'asc' }
                }
            }
        })

        return NextResponse.json({ item }, { status: 201 })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                error: 'Bad Request',
                message: 'Validation failed',
                details: error.flatten().fieldErrors
            }, { status: 400 })
        }

        console.error('Error creating navigation item:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to create navigation item'
        }, { status: 500 })
    }
}