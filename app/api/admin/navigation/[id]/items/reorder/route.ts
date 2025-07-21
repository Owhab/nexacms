import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { ReorderNavigationItemsSchema } from '@/lib/validations/navigation'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

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
        const validatedData = ReorderNavigationItemsSchema.parse(body)

        // Validate all items exist and belong to this menu
        const itemIds = validatedData.items.map(item => item.id)
        const existingItems = await prisma.navigationItem.findMany({
            where: {
                id: { in: itemIds },
                menuId: params.id
            },
            select: { id: true, parentId: true }
        })

        if (existingItems.length !== itemIds.length) {
            const foundIds = existingItems.map(item => item.id)
            const missingIds = itemIds.filter(id => !foundIds.includes(id))
            return NextResponse.json({
                error: 'Bad Request',
                message: 'Some navigation items not found in this menu',
                details: { items: [`Items not found: ${missingIds.join(', ')}`] }
            }, { status: 400 })
        }

        // Validate parent-child relationships and check for circular references
        for (const item of validatedData.items) {
            if (item.parentId) {
                // Check if parent exists in the same menu
                const parent = await prisma.navigationItem.findFirst({
                    where: {
                        id: item.parentId,
                        menuId: params.id
                    }
                })

                if (!parent) {
                    return NextResponse.json({
                        error: 'Bad Request',
                        message: `Parent item ${item.parentId} not found in this menu`,
                        details: { items: [`Invalid parent ID: ${item.parentId}`] }
                    }, { status: 400 })
                }

                // Check for circular reference
                if (await wouldCreateCircularReference(item.id, item.parentId, validatedData.items)) {
                    return NextResponse.json({
                        error: 'Bad Request',
                        message: 'Circular reference detected in hierarchy',
                        details: { items: [`Item ${item.id} cannot have parent ${item.parentId} - would create circular reference`] }
                    }, { status: 400 })
                }
            }
        }

        // Validate hierarchy depth (optional - limit to reasonable depth)
        const maxDepth = 5 // Configurable limit
        for (const item of validatedData.items) {
            const depth = calculateItemDepth(item.id, validatedData.items)
            if (depth > maxDepth) {
                return NextResponse.json({
                    error: 'Bad Request',
                    message: `Maximum nesting depth (${maxDepth}) exceeded`,
                    details: { items: [`Item ${item.id} would be nested too deeply`] }
                }, { status: 400 })
            }
        }

        // Perform bulk update in a transaction with temporary negative orders to avoid conflicts
        await prisma.$transaction(async (tx) => {
            // First, set all items to temporary negative orders to avoid unique constraint conflicts
            for (let i = 0; i < validatedData.items.length; i++) {
                const item = validatedData.items[i]
                await tx.navigationItem.update({
                    where: { id: item.id },
                    data: {
                        order: -(i + 1000), // Use negative numbers to avoid conflicts
                        parentId: item.parentId || null
                    }
                })
            }

            // Then update to the final order values
            for (const item of validatedData.items) {
                await tx.navigationItem.update({
                    where: { id: item.id },
                    data: {
                        order: item.order
                    }
                })
            }
        })

        // Fetch updated menu structure
        const updatedMenu = await prisma.navigationMenu.findUnique({
            where: { id: params.id },
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

        return NextResponse.json({
            message: 'Navigation items reordered successfully',
            menu: updatedMenu
        })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                error: 'Bad Request',
                message: 'Validation failed',
                details: error.flatten().fieldErrors
            }, { status: 400 })
        }

        console.error('Error reordering navigation items:', error)
        return NextResponse.json({
            error: 'Internal Server Error',
            message: 'Failed to reorder navigation items'
        }, { status: 500 })
    }
}

// Helper function to check if a parent-child assignment would create a circular reference
async function wouldCreateCircularReference(
    itemId: string,
    newParentId: string,
    allItems: Array<{ id: string; parentId?: string | null }>
): Promise<boolean> {
    // Build a map of the new hierarchy
    const parentMap = new Map<string, string | null>()
    for (const item of allItems) {
        parentMap.set(item.id, item.parentId || null)
    }

    // Check if setting newParentId as parent of itemId would create a cycle
    let currentId: string | null = newParentId
    const visited = new Set<string>()

    while (currentId) {
        if (visited.has(currentId)) {
            // We found a cycle, but need to check if it involves our itemId
            return true
        }

        if (currentId === itemId) {
            // We reached back to our original item - circular reference!
            return true
        }

        visited.add(currentId)
        currentId = parentMap.get(currentId) || null
    }

    return false
}

// Helper function to calculate the depth of an item in the hierarchy
function calculateItemDepth(
    itemId: string,
    allItems: Array<{ id: string; parentId?: string | null }>
): number {
    const parentMap = new Map<string, string | null>()
    for (const item of allItems) {
        parentMap.set(item.id, item.parentId || null)
    }

    let depth = 0
    let currentId: string | null = itemId
    const visited = new Set<string>()

    while (currentId) {
        if (visited.has(currentId)) {
            // Circular reference - return high depth to trigger validation error
            return 999
        }

        visited.add(currentId)
        currentId = parentMap.get(currentId) || null
        if (currentId) {
            depth++
        }
    }

    return depth
}