import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { sendInvitationEmail } from '@/lib/email'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        const { email, role } = await request.json()

        if (!email || !role) {
            return NextResponse.json({ error: 'Email and role are required' }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        // Check if there's already a pending invitation
        const existingInvitation = await prisma.userInvitation.findFirst({
            where: {
                email,
                status: 'PENDING',
                expiresAt: {
                    gt: new Date()
                }
            }
        })

        if (existingInvitation) {
            return NextResponse.json({ error: 'Invitation already sent and still valid' }, { status: 400 })
        }

        // Generate invitation token
        const invitationToken = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

        // Create new invitation
        const invitation = await prisma.userInvitation.create({
            data: {
                email,
                role,
                token: invitationToken,
                status: 'PENDING',
                expiresAt,
                invitedBy: payload.userId
            }
        })

        // Get inviter info
        const inviter = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { name: true, email: true }
        })

        // Send invitation email
        const emailSent = await sendInvitationEmail({
            email,
            inviterName: inviter?.name || inviter?.email || 'Admin',
            inviterEmail: inviter?.email || '',
            role,
            invitationToken,
            expiresAt
        })

        if (!emailSent) {
            return NextResponse.json({ error: 'Failed to send invitation email' }, { status: 500 })
        }

        return NextResponse.json({
            invitation: {
                id: invitation.id,
                email: invitation.email,
                role: invitation.role,
                status: invitation.status,
                expiresAt: invitation.expiresAt,
                createdAt: invitation.createdAt
            }
        })
    } catch (error) {
        console.error('Error sending invitation:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}