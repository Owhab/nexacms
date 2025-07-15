'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import { useAppDispatch, useAppSelector } from '@/store'
import { checkAuth } from '@/store/authSlice'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const dispatch = useAppDispatch()
    const { user, loading, isAuthenticated } = useAppSelector((state) => state.auth)
    const router = useRouter()

    useEffect(() => {
        // Check authentication on mount
        dispatch(checkAuth())
    }, [dispatch])

    useEffect(() => {
        // Redirect to login if not authenticated and not loading
        if (!loading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return null // Will redirect to login
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}