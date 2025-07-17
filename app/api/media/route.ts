import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { unlink } from 'fs/promises'
import path from 'path'

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
        const category = searchParams.get('category')
        const type = searchParams.get('type')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const search = searchParams.get('search')

        const where: any = {}

        if (category) {
            where.category = category
        }

        if (type) {
            where.type = type
        }

        if (search) {
            where.OR = [
                { fileName: { contains: search, mode: 'insensitive' } },
                { altText: { contains: search, mode: 'insensitive' } }
            ]
        }

        const [media, total] = await Promise.all([
            prisma.media.findMany({
                where,
                include: {
                    uploader: {
                        select: {
                            email: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma.media.count({ where })
        ])

        return NextResponse.json({
            media,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching media:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const mediaId = searchParams.get('id')

        if (!mediaId) {
            return NextResponse.json({ error: 'Media ID is required' }, { status: 400 })
        }

        // Get media info before deletion
        const media = await prisma.media.findUnique({
            where: { id: mediaId }
        })

        if (!media) {
            return NextResponse.json({ error: 'Media not found' }, { status: 404 })
        }

        // Delete file from filesystem
        try {
            const filePath = path.join(process.cwd(), 'public', media.url)
            await unlink(filePath)
        } catch (fileError) {
            console.warn('Could not delete file from filesystem:', fileError)
            // Continue with database deletion even if file deletion fails
        }

        // Delete from database
        await prisma.media.delete({
            where: { id: mediaId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting media:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}