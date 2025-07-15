import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(
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

        const { sectionTemplateId, order, props } = await request.json()

        if (!sectionTemplateId) {
            return NextResponse.json({ error: 'Section template ID is required' }, { status: 400 })
        }

        // Get the next order if not provided
        let sectionOrder = order
        if (sectionOrder === undefined) {
            const lastSection = await prisma.pageSection.findFirst({
                where: { pageId: params.id },
                orderBy: { order: 'desc' }
            })
            sectionOrder = (lastSection?.order || 0) + 1
        }

        const section = await prisma.pageSection.create({
            data: {
                pageId: params.id,
                sectionTemplateId,
                order: sectionOrder,
                props: JSON.stringify(props || {})
            },
            include: {
                sectionTemplate: true
            }
        })

        return NextResponse.json({ section })
    } catch (error) {
        console.error('Error creating section:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}