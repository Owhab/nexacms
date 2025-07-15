import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge } from './lib/auth-edge'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if the request is for admin routes
    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('auth-token')?.value


        if (!token) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(loginUrl)
        }

        const payload = await verifyTokenEdge(token)

        if (!payload) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(loginUrl)
        }


        // Add user info to headers for use in components
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-user-id', payload.userId)
        requestHeaders.set('x-user-email', payload.email)
        requestHeaders.set('x-user-role', payload.role)

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    }

    // Redirect authenticated users away from login/register pages
    if (pathname === '/login' || pathname === '/register') {
        const token = request.cookies.get('auth-token')?.value
        if (token) {
            const payload = await verifyTokenEdge(token)
            if (payload) {
                return NextResponse.redirect(new URL('/admin', request.url))
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/login', '/register']
}