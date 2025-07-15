import { jwtVerify, SignJWT } from 'jose'
import { JWTPayload } from './types'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
)

export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)

        // Validate that the payload has the required properties
        if (
            payload &&
            typeof payload === 'object' &&
            'userId' in payload &&
            'email' in payload &&
            'role' in payload
        ) {
            return {
                userId: payload.userId as string,
                email: payload.email as string,
                role: payload.role as 'ADMIN' | 'EDITOR' | 'VIEWER'
            }
        }

        return null
    } catch (error) {
        console.error('Edge JWT verification failed:', error)
        return null
    }
}

export async function generateTokenEdge(payload: JWTPayload): Promise<string> {
    return await new SignJWT({
        userId: payload.userId,
        email: payload.email,
        role: payload.role
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(JWT_SECRET)
}