import { NextRequest, NextResponse } from 'next/server'
import { verifyGoogleToken, handleGoogleLogin } from '@/lib/google-auth'
import { sendWelcomeEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=google_auth_failed`)
        }

        if (!code) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=missing_code`)
        }

        // Verify Google token and get user info
        const googleUser = await verifyGoogleToken(code)
        if (!googleUser) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=invalid_token`)
        }

        // Handle login/registration
        const result = await handleGoogleLogin(googleUser)
        if (!result) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=access_denied`)
        }

        // Set auth cookie
        const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/admin`)
        response.cookies.set('auth-token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        })

        // Send welcome email for new users (optional)
        if (result.user.name) {
            try {
                await sendWelcomeEmail(result.user.email, result.user.name)
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError)
                // Don't fail the login if email fails
            }
        }

        return response
    } catch (error) {
        console.error('Google callback error:', error)
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=callback_failed`)
    }
}