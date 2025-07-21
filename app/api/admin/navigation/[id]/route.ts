import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { UpdateNavigationMenuSchema } from '@/lib/validations/navigation'
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

        const menu = await prisma.navigationMenu.findUnique({
            where: { id: params.id },
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
            }
        })

        if (!menu) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Navigation menu not found'
            }, { status: 404 })
        }

        return NextResponse.json({ menu })
    } catch (error) {
        console.error('Error fetching navigation menu:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to fetch navigation menu'
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
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({
                error: 'Forbidden',
                message: 'Admin privileges required'
            }, { status: 403 })
        }

        const body = await request.json()

        // Validate request body
        const validatedData = UpdateNavigationMenuSchema.parse(body)

        // Check if menu exists
        const existingMenu = await prisma.navigationMenu.findUnique({
            where: { id: params.id }
        })

        if (!existingMenu) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Navigation menu not found'
            }, { status: 404 })
        }

        // Check for name/location conflicts if name or location is being updated
        if (validatedData.name || validatedData.location) {
            const conflictMenu = await prisma.navigationMenu.findFirst({
                where: {
                    id: { not: params.id },
                    name: validatedData.name || existingMenu.name,
                    location: validatedData.location || existingMenu.location
                }
            })

            if (conflictMenu) {
                return NextResponse.json({
                    error: 'Conflict',
                    message: 'A menu with this name already exists in the specified location',
                    details: { name: ['Menu name must be unique per location'] }
                }, { status: 409 })
            }
        }

        const menu = await prisma.navigationMenu.update({
            where: { id: params.id },
            data: validatedData,
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

        return NextResponse.json({ menu })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                error: 'Bad Request',
                message: 'Validation failed',
                details: error.flatten().fieldErrors
            }, { status: 400 })
        }

        console.error('Error updating navigation menu:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to update navigation menu'
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
                message: 'Admin privileges required'
            }, { status: 403 })
        }

        // Check if menu exists
        const existingMenu = await prisma.navigationMenu.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: { items: true }
                }
            }
        })

        if (!existingMenu) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Navigation menu not found'
            }, { status: 404 })
        }

        // Delete the menu (cascade will handle navigation items)
        await prisma.navigationMenu.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            message: 'Navigation menu deleted successfully',
            deletedItemsCount: existingMenu._count.items
        })
    } catch (error) {
        console.error('Error deleting navigation menu:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to delete navigation menu'
        }, { status: 500 })
    }
}