import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const location = searchParams.get('location')

        const whereClause = location ? { location: location as any } : {}

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
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        const { name, location } = await request.json()

        const menu = await prisma.navigationMenu.create({
            data: {
                name,
                location,
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

        return NextResponse.json({ menu })
    } catch (error) {
        console.error('Error creating navigation menu:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}