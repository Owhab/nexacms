// User roles as defined in Prisma schema
export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER'

// Page status as defined in Prisma schema  
export type PageStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED'

// Media types as defined in Prisma schema
export type MediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT'

// User interface
export interface User {
    id: string
    email: string
    role: UserRole
    createdAt: string
    updatedAt: string
}

// Auth interfaces
export interface AuthUser {
    id: string
    email: string
    role: UserRole
}

export interface JWTPayload {
    userId: string
    email: string
    role: UserRole
}