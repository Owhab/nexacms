import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    { params }: { params: { token: string } }
) {
    try {
        const invitation = await prisma.userInvitation.findUnique({
            where: {
                token: params.token,
                status: 'PENDING'
            },
            include: {
                inviter: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })

        if (!invitation) {
            return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 404 })
        }

        if (invitation.expiresAt < new Date()) {
            await prisma.userInvitation.update({
                where: { id: invitation.id },
                data: { status: 'EXPIRED' }
            })
            return NextResponse.json({ error: 'Invitation has expired' }, { status: 410 })
        }

        return NextResponse.json({
            invitation: {
                email: invitation.email,
                role: invitation.role,
                inviterName: invitation.inviter.name || invitation.inviter.email,
                expiresAt: invitation.expiresAt
            }
        })
    } catch (error) {
        console.error('Error fetching invitation:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { token: string } }
) {
    try {
        const { password, name } = await request.json()

        const invitation = await prisma.userInvitation.findUnique({
            where: {
                token: params.token,
                status: 'PENDING'
            }
        })

        if (!invitation) {
            return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 404 })
        }

        if (invitation.expiresAt < new Date()) {
            await prisma.userInvitation.update({
                where: { id: invitation.id },
                data: { status: 'EXPIRED' }
            })
            return NextResponse.json({ error: 'Invitation has expired' }, { status: 410 })
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: invitation.email }
        })

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        // Create user
        const { hashPassword, generateToken } = await import('@/lib/auth')

        const userData: any = {
            email: invitation.email,
            role: invitation.role,
            status: 'ACTIVE',
            invitedBy: invitation.invitedBy,
            invitedAt: invitation.createdAt
        }

        if (name) {
            userData.name = name
        }

        if (password) {
            userData.passwordHash = await hashPassword(password)
        }

        const user = await prisma.user.create({
            data: userData
        })

        // Mark invitation as accepted
        await prisma.userInvitation.update({
            where: { id: invitation.id },
            data: { status: 'ACCEPTED' }
        })

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        })

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        })
    } catch (error) {
        console.error('Error accepting invitation:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}