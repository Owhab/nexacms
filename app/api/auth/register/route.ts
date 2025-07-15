import { NextRequest, NextResponse } from 'next/server'
import { createUser, generateToken } from '@/lib/auth'
import { UserRole } from '@/lib/types'

export async function POST(request: NextRequest) {
    try {
        const { email, password, role } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Validate role
        const validRoles: UserRole[] = ['ADMIN', 'EDITOR', 'VIEWER']
        const userRole: UserRole = validRoles.includes(role) ? role : 'EDITOR'

        const user = await createUser(email, password, userRole)

        if (!user) {
            return NextResponse.json(
                { error: 'Failed to create user' },
                { status: 400 }
            )
        }

        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        })

        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        })

        // Set HTTP-only cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return response
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}