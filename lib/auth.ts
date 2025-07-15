import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { UserRole, AuthUser, JWTPayload } from './types'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-development-only'

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
        console.error('verifyToken - Verification failed:', error)
        return null
    }
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return null
        }

        const isValidPassword = await verifyPassword(password, user.passwordHash)
        if (!isValidPassword) {
            return null
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role as UserRole
        }
    } catch (error) {
        console.error('Authentication error:', error)
        return null
    }
}

export async function createUser(email: string, password: string, role: UserRole = 'EDITOR'): Promise<AuthUser | null> {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            throw new Error('User already exists')
        }

        const hashedPassword = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                role
            }
        })

        return {
            id: user.id,
            email: user.email,
            role: user.role as UserRole
        }
    } catch (error) {
        console.error('User creation error:', error)
        return null
    }
}