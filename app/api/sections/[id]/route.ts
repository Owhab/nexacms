import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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

        const { props, order } = await request.json()

        const updateData: any = {}
        if (props !== undefined) updateData.props = JSON.stringify(props)
        if (order !== undefined) updateData.order = order

        const section = await prisma.pageSection.update({
            where: { id: params.id },
            data: updateData,
            include: {
                sectionTemplate: true
            }
        })

        return NextResponse.json({ section })
    } catch (error) {
        console.error('Error updating section:', error)
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
        if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'EDITOR')) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        await prisma.pageSection.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting section:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}