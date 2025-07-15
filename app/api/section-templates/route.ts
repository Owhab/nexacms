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

        const templates = await prisma.sectionTemplate.findMany({
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json({ templates })
    } catch (error) {
        console.error('Error fetching section templates:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}