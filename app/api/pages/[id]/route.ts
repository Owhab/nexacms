import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.cookies.get('auth-token')?.value
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const page = await prisma.page.findUnique({
            where: { id: params.id },
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

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 })
        }

        return NextResponse.json({ page })
    } catch (error) {
        console.error('Error fetching page:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.cookies.get('auth-token')?.value
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'EDITOR')) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        const { title, slug, seoTitle, seoDescription, seoKeywords, status } = await request.json()

        // Check if slug already exists (excluding current page)
        if (slug) {
            const existingPage = await prisma.page.findFirst({
                where: {
                    slug,
                    NOT: { id: params.id }
                }
            })

            if (existingPage) {
                return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
            }
        }

        const updateData: any = {}
        if (title !== undefined) updateData.title = title
        if (slug !== undefined) updateData.slug = slug
        if (seoTitle !== undefined) updateData.seoTitle = seoTitle
        if (seoDescription !== undefined) updateData.seoDescription = seoDescription
        if (seoKeywords !== undefined) updateData.seoKeywords = seoKeywords

        // Only admins can publish pages
        if (status !== undefined && payload.role === 'ADMIN') {
            updateData.status = status
            if (status === 'PUBLISHED') {
                updateData.publishedAt = new Date()
            }
        }

        const page = await prisma.page.update({
            where: { id: params.id },
            data: updateData,
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
        console.error('Error updating page:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.cookies.get('auth-token')?.value
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        await prisma.page.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting page:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}