import { OAuth2Client } from 'google-auth-library'
import { prisma } from './prisma'
import { generateToken } from './auth'

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
)

export interface GoogleUserInfo {
    id: string
    email: string
    name: string
    picture?: string
    verified_email: boolean
}

export async function getGoogleAuthUrl(): Promise<string> {
    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ],
        include_granted_scopes: true
    })

    return authUrl
}

export async function verifyGoogleToken(code: string): Promise<GoogleUserInfo | null> {
    try {
        const { tokens } = await client.getToken(code)
        client.setCredentials(tokens)

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token!,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()
        if (!payload) {
            return null
        }

        return {
            id: payload.sub,
            email: payload.email!,
            name: payload.name!,
            picture: payload.picture,
            verified_email: payload.email_verified || false
        }
    } catch (error) {
        console.error('Google token verification failed:', error)
        return null
    }
}

export async function handleGoogleLogin(googleUser: GoogleUserInfo): Promise<{ user: any, token: string } | null> {
    try {
        // Check if user exists by Google ID
        let user = await prisma.user.findUnique({
            where: { googleId: googleUser.id }
        })

        if (!user) {
            // Check if user exists by email
            user = await prisma.user.findUnique({
                where: { email: googleUser.email }
            })

            if (user) {
                // Link Google account to existing user
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        googleId: googleUser.id,
                        name: user.name || googleUser.name,
                        avatar: user.avatar || googleUser.picture,
                        lastLoginAt: new Date()
                    }
                })
            } else {
                // Check if there's a pending invitation for this email
                const invitation = await prisma.userInvitation.findFirst({
                    where: {
                        email: googleUser.email,
                        status: 'PENDING',
                        expiresAt: {
                            gt: new Date()
                        }
                    }
                })

                if (invitation && invitation.expiresAt > new Date()) {
                    // Create user from invitation
                    user = await prisma.user.create({
                        data: {
                            email: googleUser.email,
                            googleId: googleUser.id,
                            name: googleUser.name,
                            avatar: googleUser.picture,
                            role: invitation.role,
                            status: 'ACTIVE',
                            invitedBy: invitation.invitedBy,
                            invitedAt: invitation.createdAt,
                            lastLoginAt: new Date()
                        }
                    })

                    // Mark invitation as accepted
                    await prisma.userInvitation.update({
                        where: { id: invitation.id },
                        data: { status: 'ACCEPTED' }
                    })
                } else {
                    // No invitation found - reject login for new users
                    return null
                }
            }
        } else {
            // Update last login time
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    lastLoginAt: new Date(),
                    name: user.name || googleUser.name,
                    avatar: user.avatar || googleUser.picture
                }
            })
        }

        // Check if user is active
        if (user.status !== 'ACTIVE') {
            return null
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        })

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
                status: user.status
            },
            token
        }
    } catch (error) {
        console.error('Google login error:', error)
        return null
    }
}