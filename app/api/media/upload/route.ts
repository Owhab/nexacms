import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const altText = formData.get('altText') as string || ''
        const category = formData.get('category') as string || 'general'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            'video/mp4', 'video/webm', 'video/ogg',
            'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File size too large (max 10MB)' }, { status: 400 })
        }

        // Create assets directory if it doesn't exist
        const assetsDir = path.join(process.cwd(), 'public', 'assets')
        const categoryDir = path.join(assetsDir, category)

        if (!existsSync(assetsDir)) {
            await mkdir(assetsDir, { recursive: true })
        }

        if (!existsSync(categoryDir)) {
            await mkdir(categoryDir, { recursive: true })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const fileExtension = path.extname(file.name)
        const fileName = `${timestamp}_${randomString}${fileExtension}`
        const filePath = path.join(categoryDir, fileName)
        const publicUrl = `/assets/${category}/${fileName}`

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)

        // Determine media type
        let mediaType: 'IMAGE' | 'VIDEO' | 'DOCUMENT' = 'DOCUMENT'
        if (file.type.startsWith('image/')) {
            mediaType = 'IMAGE'
        } else if (file.type.startsWith('video/')) {
            mediaType = 'VIDEO'
        }

        // Save to database
        const media = await prisma.media.create({
            data: {
                url: publicUrl,
                altText: altText,
                type: mediaType,
                uploadedBy: payload.userId,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
                category: category
            }
        })

        return NextResponse.json({
            media: {
                id: media.id,
                url: media.url,
                altText: media.altText,
                type: media.type,
                fileName: media.fileName,
                fileSize: media.fileSize,
                mimeType: media.mimeType,
                category: media.category,
                createdAt: media.createdAt
            }
        })
    } catch (error) {
        console.error('Error uploading media:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}