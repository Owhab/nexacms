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
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const status = searchParams.get('status')

        const where: any = {}
        if (status) {
            where.status = status
        }

        const [invitations, total] = await Promise.all([
            prisma.userInvitation.findMany({
                where,
                include: {
                    inviter: {
                        select: {
                            name: true,
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
            prisma.userInvitation.count({ where })
        ])

        return NextResponse.json({
            invitations,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching invitations:', error)
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
        const invitationId = searchParams.get('id')

        if (!invitationId) {
            return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 })
        }

        await prisma.userInvitation.update({
            where: { id: invitationId },
            data: { status: 'CANCELLED' }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error cancelling invitation:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}