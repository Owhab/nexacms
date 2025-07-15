import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const templates = await prisma.headerTemplate.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ templates })
    } catch (error) {
        console.error('Error fetching header templates:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        const { name, description, template, config } = await request.json()

        const headerTemplate = await prisma.headerTemplate.create({
            data: {
                name,
                description,
                template,
                config: config || {},
            }
        })

        return NextResponse.json({ template: headerTemplate })
    } catch (error) {
        console.error('Error creating header template:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}