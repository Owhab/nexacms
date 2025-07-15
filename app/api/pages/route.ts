import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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

        const pages = await prisma.page.findMany({
            include: {
                sections: {
                    include: {
                        sectionTemplate: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })

        return NextResponse.json({ pages })
    } catch (error) {
        console.error('Error fetching pages:', error)
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
        if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'EDITOR')) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        const { title, slug, seoTitle, seoDescription, seoKeywords } = await request.json()

        if (!title || !slug) {
            return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 })
        }

        // Check if slug already exists
        const existingPage = await prisma.page.findUnique({
            where: { slug }
        })

        if (existingPage) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
        }

        const page = await prisma.page.create({
            data: {
                title,
                slug,
                seoTitle,
                seoDescription,
                seoKeywords,
                status: 'DRAFT'
            },
            include: {
                sections: {
                    include: {
                        sectionTemplate: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        })

        return NextResponse.json({ page })
    } catch (error) {
        console.error('Error creating page:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}