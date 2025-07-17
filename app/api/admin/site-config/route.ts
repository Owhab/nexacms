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
        const token = request.cookies.get('auth-token')?.value
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        const updates = await request.json()
        console.log('Site config update request:', updates)

        // Validate and normalize template IDs
        let validatedHeaderTemplateId = null
        let validatedFooterTemplateId = null

        if (updates.headerTemplateId && updates.headerTemplateId !== '') {
            const headerTemplate = await prisma.headerTemplate.findUnique({
                where: { id: updates.headerTemplateId }
            })
            if (!headerTemplate) {
                console.error('Invalid headerTemplateId:', updates.headerTemplateId)
                return NextResponse.json({ error: 'Invalid header template ID' }, { status: 400 })
            }
            validatedHeaderTemplateId = updates.headerTemplateId
        }

        if (updates.footerTemplateId && updates.footerTemplateId !== '') {
            const footerTemplate = await prisma.footerTemplate.findUnique({
                where: { id: updates.footerTemplateId }
            })
            if (!footerTemplate) {
                console.error('Invalid footerTemplateId:', updates.footerTemplateId)
                return NextResponse.json({ error: 'Invalid footer template ID' }, { status: 400 })
            }
            validatedFooterTemplateId = updates.footerTemplateId
        }

        // Get existing config
        let config = await prisma.siteConfig.findFirst()

        // Prepare data for create/update
        const configData = {
            siteName: updates.siteName || 'My Website',
            siteDescription: updates.siteDescription || null,
            logoUrl: updates.logoUrl || null,
            faviconUrl: updates.faviconUrl || null,
            primaryColor: updates.primaryColor || '#3b82f6',
            secondaryColor: updates.secondaryColor || '#64748b',
            accentColor: updates.accentColor || '#10b981',
            backgroundColor: updates.backgroundColor || '#ffffff',
            textColor: updates.textColor || '#1f2937',
            borderColor: updates.borderColor || '#e5e7eb',
            theme: updates.theme || 'LIGHT',
            language: updates.language || 'en',
            direction: updates.direction || 'LTR',
            headerTemplateId: validatedHeaderTemplateId,
            footerTemplateId: validatedFooterTemplateId,
        }

        if (!config) {
            // Create new config
            console.log('Creating new site config with data:', configData)
            config = await prisma.siteConfig.create({
                data: configData,
                include: {
                    headerTemplate: true,
                    footerTemplate: true,
                }
            })
        } else {
            // Update existing config
            console.log('Updating existing site config with data:', configData)
            config = await prisma.siteConfig.update({
                where: { id: config.id },
                data: {
                    ...configData,
                    updatedAt: new Date(),
                },
                include: {
                    headerTemplate: true,
                    footerTemplate: true,
                }
            })
        }

        console.log('Site config operation successful:', config.id)
        return NextResponse.json({ config })
    } catch (error) {
        console.error('Error updating site config:', error)
        if (error instanceof Error) {
            console.error('Error details:', error.message)
        }
        if (error && typeof error === 'object' && 'code' in error) {
            console.error('Error code:', error.code)
        }
        return NextResponse.json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
        }, { status: 500 })
    }
}