import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        const { title, url, pageId, parentId, target, order, cssClass, icon } = await request.json()

        // Get the next order if not provided
        let itemOrder = order
        if (itemOrder === undefined) {
            const lastItem = await prisma.navigationItem.findFirst({
                where: {
                    menuId: params.id,
                    parentId: parentId || null
                },
                orderBy: { order: 'desc' }
            })
            itemOrder = (lastItem?.order || 0) + 1
        }

        const item = await prisma.navigationItem.create({
            data: {
                menuId: params.id,
                parentId: parentId || null,
                title,
                url: url || null,
                pageId: pageId || null,
                target: target || 'SELF',
                order: itemOrder,
                cssClass: cssClass || null,
                icon: icon || null,
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

        return NextResponse.json({ item })
    } catch (error) {
        console.error('Error creating navigation item:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        const { items } = await request.json()

        // Update all items in a transaction
        await prisma.$transaction(
            items.map((item: any, index: number) =>
                prisma.navigationItem.update({
                    where: { id: item.id },
                    data: {
                        order: index + 1,
                        parentId: item.parentId || null,
                        title: item.title,
                        url: item.url || null,
                        pageId: item.pageId || null,
                        target: item.target || 'SELF',
                        cssClass: item.cssClass || null,
                        icon: item.icon || null,
                        isVisible: item.isVisible !== false,
                    }
                })
            )
        )

        // Fetch updated menu
        const menu = await prisma.navigationMenu.findUnique({
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

        return NextResponse.json({ menu })
    } catch (error) {
        console.error('Error updating navigation items:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}