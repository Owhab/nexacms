'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchPages } from '@/store/pagesSlice'
import { PlusIcon, FileTextIcon, ImageIcon, UsersIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.auth)
    const { pages } = useAppSelector((state) => state.pages)

    const canManageUsers = user?.role === 'ADMIN'
    const canManageSettings = user?.role === 'ADMIN'
    const canCreateContent = user?.role === 'ADMIN' || user?.role === 'EDITOR'

    useEffect(() => {
        dispatch(fetchPages())
    }, [dispatch])

    const publishedPages = pages.filter(page => page.status === 'PUBLISHED').length
    const totalSections = pages.reduce((total, page) => total + (page.sections?.length || 0), 0)

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">
                    Welcome back, {user?.email} ({user?.role?.toLowerCase()})
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Pages</p>
                            <p className="text-2xl font-bold text-gray-900">{pages.length}</p>
                        </div>
                        <FileTextIcon className="h-8 w-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Sections</p>
                            <p className="text-2xl font-bold text-gray-900">{totalSections}</p>
                        </div>
                        <ImageIcon className="h-8 w-8 text-green-600" />
                    </div>
                </div>

                {canManageUsers && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Users</p>
                                <p className="text-2xl font-bold text-gray-900">1</p>
                            </div>
                            <UsersIcon className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Published</p>
                            <p className="text-2xl font-bold text-gray-900">{publishedPages}</p>
                        </div>
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                            <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {canCreateContent && (
                        <Link href="/admin/pages/new">
                            <Button className="h-20 flex-col space-y-2 w-full">
                                <PlusIcon className="h-6 w-6" />
                                <span>Create New Page</span>
                            </Button>
                        </Link>
                    )}

                    <Link href="/admin/media">
                        <Button variant="outline" className="h-20 flex-col space-y-2 w-full">
                            <ImageIcon className="h-6 w-6" />
                            <span>Media Library</span>
                        </Button>
                    </Link>

                    {canManageUsers && (
                        <Link href="/admin/users">
                            <Button variant="outline" className="h-20 flex-col space-y-2 w-full">
                                <UsersIcon className="h-6 w-6" />
                                <span>Manage Users</span>
                            </Button>
                        </Link>
                    )}

                    {canManageSettings && (
                        <Link href="/admin/settings">
                            <Button variant="outline" className="h-20 flex-col space-y-2 w-full">
                                <SettingsIcon className="h-6 w-6" />
                                <span>Settings</span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">Home page updated</span>
                        </div>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">New image uploaded</span>
                        </div>
                        <span className="text-xs text-gray-500">4 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">About page created</span>
                        </div>
                        <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                </div>
            </div>
        </div>
    )
}