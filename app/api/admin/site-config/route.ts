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

        // Get or create site config
        let config = await prisma.siteConfig.findFirst({
            include: {
                headerTemplate: true,
                footerTemplate: true,
            }
        })

        if (!config) {
            // Create default config
            config = await prisma.siteConfig.create({
                data: {
                    siteName: 'My Website',
                    primaryColor: '#3b82f6',
                    secondaryColor: '#64748b',
                    accentColor: '#10b981',
                    backgroundColor: '#ffffff',
                    textColor: '#1f2937',
                    borderColor: '#e5e7eb',
                    theme: 'LIGHT',
                    language: 'en',
                    direction: 'LTR',
                },
                include: {
                    headerTemplate: true,
                    footerTemplate: true,
                }
            })
        }

        return NextResponse.json({ config })
    } catch (error) {
        console.error('Error fetching site config:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        const updates = await request.json()

        // Get existing config
        let config = await prisma.siteConfig.findFirst()

        if (!config) {
            // Create new config with updates
            config = await prisma.siteConfig.create({
                data: {
                    siteName: updates.siteName || 'My Website',
                    siteDescription: updates.siteDescription,
                    logoUrl: updates.logoUrl,
                    faviconUrl: updates.faviconUrl,
                    primaryColor: updates.primaryColor || '#3b82f6',
                    secondaryColor: updates.secondaryColor || '#64748b',
                    accentColor: updates.accentColor || '#10b981',
                    backgroundColor: updates.backgroundColor || '#ffffff',
                    textColor: updates.textColor || '#1f2937',
                    borderColor: updates.borderColor || '#e5e7eb',
                    theme: updates.theme || 'LIGHT',
                    language: updates.language || 'en',
                    direction: updates.direction || 'LTR',
                    headerTemplateId: updates.headerTemplateId,
                    footerTemplateId: updates.footerTemplateId,
                },
                include: {
                    headerTemplate: true,
                    footerTemplate: true,
                }
            })
        } else {
            // Update existing config
            config = await prisma.siteConfig.update({
                where: { id: config.id },
                data: {
                    ...updates,
                    updatedAt: new Date(),
                },
                include: {
                    headerTemplate: true,
                    footerTemplate: true,
                }
            })
        }

        return NextResponse.json({ config })
    } catch (error) {
        console.error('Error updating site config:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}