import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { UpdateNavigationItemSchema } from '@/lib/validations/navigation'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string; itemId: string } }
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

        const item = await prisma.navigationItem.findFirst({
            where: {
                id: params.itemId,
                menuId: params.id
            },
            include: {
                page: { select: { id: true, title: true, slug: true } },
                parent: { select: { id: true, title: true } },
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
            }
        })

        if (!item) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Navigation item not found'
            }, { status: 404 })
        }

        return NextResponse.json({ item })
    } catch (error) {
        console.error('Error fetching navigation item:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to fetch navigation item'
        }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string; itemId: string } }
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

        // Check if item exists and belongs to the menu
        const existingItem = await prisma.navigationItem.findFirst({
            where: {
                id: params.itemId,
                menuId: params.id
            }
        })

        if (!existingItem) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Navigation item not found'
            }, { status: 404 })
        }

        const body = await request.json()

        // Validate request body
        const validatedData = UpdateNavigationItemSchema.parse(body)

        // Validate parent exists if parentId is provided and different from current
        if (validatedData.parentId !== undefined && validatedData.parentId !== existingItem.parentId) {
            if (validatedData.parentId) {
                // Check parent exists in same menu
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

                // Check for circular reference (item cannot be parent of itself or its ancestors)
                if (validatedData.parentId === params.itemId) {
                    return NextResponse.json({
                        error: 'Bad Request',
                        message: 'Item cannot be its own parent',
                        details: { parentId: ['Circular reference not allowed'] }
                    }, { status: 400 })
                }

                // Check if the new parent is a descendant of this item
                const isDescendant = await checkIfDescendant(params.itemId, validatedData.parentId)
                if (isDescendant) {
                    return NextResponse.json({
                        error: 'Bad Request',
                        message: 'Cannot set a descendant as parent',
                        details: { parentId: ['Circular reference not allowed'] }
                    }, { status: 400 })
                }
            }
        }

        // Validate page exists if pageId is provided
        if (validatedData.pageId !== undefined && validatedData.pageId !== existingItem.pageId) {
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
        }

        const item = await prisma.navigationItem.update({
            where: { id: params.itemId },
            data: {
                ...validatedData,
                url: validatedData.url === undefined ? existingItem.url : validatedData.url,
                pageId: validatedData.pageId === undefined ? existingItem.pageId : validatedData.pageId,
                parentId: validatedData.parentId === undefined ? existingItem.parentId : validatedData.parentId,
                cssClass: validatedData.cssClass === undefined ? existingItem.cssClass : validatedData.cssClass,
                icon: validatedData.icon === undefined ? existingItem.icon : validatedData.icon,
            },
            include: {
                page: { select: { id: true, title: true, slug: true } },
                parent: { select: { id: true, title: true } },
                children: {
                    include: {
                        page: { select: { id: true, title: true, slug: true } }
                    },
                    orderBy: { order: 'asc' }
                }
            }
        })

        return NextResponse.json({ item })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                error: 'Bad Request',
                message: 'Validation failed',
                details: error.flatten().fieldErrors
            }, { status: 400 })
        }

        console.error('Error updating navigation item:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to update navigation item'
        }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; itemId: string } }
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

        // Check if item exists and belongs to the menu
        const existingItem = await prisma.navigationItem.findFirst({
            where: {
                id: params.itemId,
                menuId: params.id
            },
            include: {
                _count: {
                    select: { children: true }
                }
            }
        })

        if (!existingItem) {
            return NextResponse.json({
                error: 'Not Found',
                message: 'Navigation item not found'
            }, { status: 404 })
        }

        // Delete the item (cascade will handle children)
        await prisma.navigationItem.delete({
            where: { id: params.itemId }
        })

        return NextResponse.json({
            message: 'Navigation item deleted successfully',
            deletedChildrenCount: existingItem._count.children
        })
    } catch (error) {
        console.error('Error deleting navigation item:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to delete navigation item'
        }, { status: 500 })
    }
}

// Helper function to check if an item is a descendant of another
async function checkIfDescendant(ancestorId: string, potentialDescendantId: string): Promise<boolean> {
    const descendants = await prisma.navigationItem.findMany({
        where: { parentId: ancestorId },
        select: { id: true }
    })

    for (const descendant of descendants) {
        if (descendant.id === potentialDescendantId) {
            return true
        }
        // Recursively check deeper levels
        if (await checkIfDescendant(descendant.id, potentialDescendantId)) {
            return true
        }
    }

    return false
}