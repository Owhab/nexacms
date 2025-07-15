'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchPages, deletePage } from '@/store/pagesSlice'
import { PlusIcon, EditIcon, EyeIcon, TrashIcon } from 'lucide-react'

export default function PagesPage() {
    const dispatch = useAppDispatch()
    const { pages, loading, error } = useAppSelector((state) => state.pages)
    const { user } = useAppSelector((state) => state.auth)
    const router = useRouter()
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    const canDelete = user?.role === 'ADMIN'
    const canPublish = user?.role === 'ADMIN'

    useEffect(() => {
        dispatch(fetchPages())
    }, [dispatch])

    const handleDelete = async (id: string) => {
        if (deleteConfirm === id) {
            await dispatch(deletePage(id))
            setDeleteConfirm(null)
        } else {
            setDeleteConfirm(id)
            // Auto-cancel confirmation after 3 seconds
            setTimeout(() => setDeleteConfirm(null), 3000)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return 'bg-green-100 text-green-800'
            case 'DRAFT':
                return 'bg-yellow-100 text-yellow-800'
            case 'SCHEDULED':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
                    <p className="text-gray-600 mt-2">Manage your website pages</p>
                </div>
                <Link href="/admin/pages/new">
                    <Button>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Create Page
                    </Button>
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border">
                {pages.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No pages yet</h3>
                        <p className="text-gray-500 mb-4">Get started by creating your first page.</p>
                        <Link href="/admin/pages/new">
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Create Your First Page
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Slug
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sections
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Modified
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pages.map((page) => (
                                    <tr key={page.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{page.title}</div>
                                            {page.seoTitle && (
                                                <div className="text-xs text-gray-500">{page.seoTitle}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500 font-mono">{page.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(page.status)}`}>
                                                {page.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{page.sections?.length || 0} sections</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(page.updatedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {page.status === 'PUBLISHED' && (
                                                    <a
                                                        href={`/storefront${page.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button size="sm" variant="ghost" title="View Page">
                                                            <EyeIcon className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                )}
                                                <Link href={`/admin/pages/${page.id}/edit`}>
                                                    <Button size="sm" variant="ghost" title="Edit Page">
                                                        <EditIcon className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {canDelete && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(page.id)}
                                                        className={deleteConfirm === page.id ? 'text-red-600 hover:text-red-700' : ''}
                                                        title={deleteConfirm === page.id ? 'Click again to confirm' : 'Delete Page'}
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}