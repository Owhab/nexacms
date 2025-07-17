import { NextRequest, NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/google-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const authUrl = await getGoogleAuthUrl()
        return NextResponse.redirect(authUrl)
    } catch (error) {
        console.error('Google auth URL generation failed:', error)
        return NextResponse.json({ error: 'Failed to generate auth URL' }, { status: 500 })
    }
}