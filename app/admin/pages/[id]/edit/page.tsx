'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchPage, updatePage, fetchSectionTemplates, addSection, deleteSection, updateSection } from '@/store/pagesSlice'
import { ArrowLeftIcon, PlusIcon, TrashIcon, EyeIcon, SaveIcon, EditIcon } from 'lucide-react'

// Section Management
import { SectionRenderer } from '@/lib/sections/renderer'
import { getSectionConfig } from '@/lib/sections/registry'
import { SectionLibrary } from '@/components/admin/SectionLibrary'

// Page Preview Modal
import { PagePreviewModal } from '@/components/admin/PagePreviewModal'

interface PageEditorProps {
    params: { id: string }
}

export default function PageEditor({ params }: PageEditorProps) {
    const dispatch = useAppDispatch()
    const { currentPage, sectionTemplates, loading, error } = useAppSelector((state) => state.pages)
    const { user } = useAppSelector((state) => state.auth)
    const router = useRouter()

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
        status: 'DRAFT'
    })

    const [showSectionLibrary, setShowSectionLibrary] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [editingSection, setEditingSection] = useState<string | null>(null)
    const [showPreview, setShowPreview] = useState(false)

    const canPublish = user?.role === 'ADMIN'

    useEffect(() => {
        dispatch(fetchPage(params.id))
        dispatch(fetchSectionTemplates())
    }, [dispatch, params.id])

    useEffect(() => {
        if (currentPage) {
            setFormData({
                title: currentPage.title,
                slug: currentPage.slug,
                seoTitle: currentPage.seoTitle || '',
                seoDescription: currentPage.seoDescription || '',
                seoKeywords: currentPage.seoKeywords || '',
                status: currentPage.status
            })
        }
    }, [currentPage])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSave = async () => {
        if (!currentPage) return

        await dispatch(updatePage({
            id: currentPage.id,
            title: formData.title,
            slug: formData.slug,
            seoTitle: formData.seoTitle || undefined,
            seoDescription: formData.seoDescription || undefined,
            seoKeywords: formData.seoKeywords || undefined,
            status: formData.status
        }))
    }

    const handleAddSection = async (sectionId: string) => {
        if (!currentPage) return

        const sectionConfig = getSectionConfig(sectionId)
        if (!sectionConfig) return

        await dispatch(addSection({
            pageId: currentPage.id,
            sectionTemplateId: sectionId,
            props: sectionConfig.defaultProps
        }))
    }

    const handleDeleteSection = async (sectionId: string) => {
        if (deleteConfirm === sectionId) {
            await dispatch(deleteSection(sectionId))
            setDeleteConfirm(null)
        } else {
            setDeleteConfirm(sectionId)
            setTimeout(() => setDeleteConfirm(null), 3000)
        }
    }

    const handleEditSection = (sectionId: string) => {
        setEditingSection(sectionId)
    }

    const handleSaveSection = async (sectionId: string, newProps: any) => {
        await dispatch(updateSection({
            id: sectionId,
            props: newProps
        }))
        setEditingSection(null)
    }

    const handleCancelEdit = () => {
        setEditingSection(null)
    }

    const handlePublishToggle = async () => {
        if (!currentPage) return

        const newStatus = currentPage.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'

        await dispatch(updatePage({
            id: currentPage.id,
            status: newStatus,
        }))
    }

    const renderSectionEditor = (section: any) => {
        const props = typeof section.props === 'string' ? JSON.parse(section.props) : section.props

        return (
            <SectionRenderer
                sectionId={section.sectionTemplate.id}
                props={props}
                mode="editor"
                onSave={(newProps) => handleSaveSection(section.id, newProps)}
                onCancel={handleCancelEdit}
            />
        )
    }

    const renderSectionPreview = (section: any) => {
        const props = typeof section.props === 'string' ? JSON.parse(section.props) : section.props

        return (
            <SectionRenderer
                sectionId={section.sectionTemplate.id}
                props={props}
                mode="preview"
            />
        )
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

    if (!currentPage) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                    <Link href="/admin/pages">
                        <Button>Back to Pages</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/admin/pages" className="text-gray-500 hover:text-gray-700">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">{currentPage.title}</h1>
                            <p className="text-sm text-gray-500">Editing page</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Status Badge */}
                        <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${currentPage.status === 'PUBLISHED'
                                ? 'bg-green-100 text-green-800'
                                : currentPage.status === 'SCHEDULED'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {currentPage.status}
                            </span>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPreview(true)}
                        >
                            <EyeIcon className="mr-2 h-4 w-4" />
                            Preview
                        </Button>

                        {currentPage.status === 'PUBLISHED' && (
                            <>
                                <a
                                    href={`/pages${currentPage.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline" size="sm">
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        View Public
                                    </Button>
                                </a>
                                <a
                                    href={`/storefront${currentPage.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline" size="sm">
                                        <EyeIcon className="mr-2 h-4 w-4" />
                                        Storefront
                                    </Button>
                                </a>
                            </>
                        )}

                        <Button onClick={handleSave} disabled={loading}>
                            <SaveIcon className="mr-2 h-4 w-4" />
                            Save
                        </Button>

                        {canPublish && (
                            <Button
                                onClick={handlePublishToggle}
                                disabled={loading}
                                className={currentPage.status === 'PUBLISHED'
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                }
                            >
                                {currentPage.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Page Settings</h2>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-4">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Page Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL Slug
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {canPublish && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="DRAFT">Draft</option>
                                        <option value="PUBLISHED">Published</option>
                                        <option value="SCHEDULED">Scheduled</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    SEO Title
                                </label>
                                <input
                                    type="text"
                                    name="seoTitle"
                                    value={formData.seoTitle}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    SEO Description
                                </label>
                                <textarea
                                    name="seoDescription"
                                    value={formData.seoDescription}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    SEO Keywords
                                </label>
                                <input
                                    type="text"
                                    name="seoKeywords"
                                    value={formData.seoKeywords}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-md font-medium text-gray-900">Sections</h3>
                                <Button
                                    size="sm"
                                    onClick={() => setShowSectionLibrary(true)}
                                >
                                    <PlusIcon className="h-4 w-4" />
                                </Button>
                            </div>



                            <div className="space-y-2">
                                {currentPage.sections.map((section, index) => (
                                    <div
                                        key={section.id}
                                        className={`flex items-center justify-between p-3 rounded border transition-colors ${editingSection === section.id
                                            ? 'bg-blue-50 border-blue-200'
                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900">
                                                {section.sectionTemplate.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Order: {section.order}
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleEditSection(section.id)}
                                                className={editingSection === section.id ? 'text-blue-600' : ''}
                                                title="Edit section"
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDeleteSection(section.id)}
                                                className={deleteConfirm === section.id ? 'text-red-600' : ''}
                                                title={deleteConfirm === section.id ? 'Click again to confirm' : 'Delete section'}
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-8">
                    <div className="bg-white rounded-lg shadow-sm border min-h-96">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Page Preview</h3>

                            {currentPage.sections.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <div className="mb-4">
                                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-medium mb-2">No sections yet</p>
                                    <p className="text-sm">Add sections from the sidebar to start building your page.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {currentPage.sections.map((section) => (
                                        <div key={section.id} className="relative group">
                                            {/* Section Controls */}
                                            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditSection(section.id)}
                                                        className="bg-white shadow-sm"
                                                    >
                                                        <EditIcon className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDeleteSection(section.id)}
                                                        className={`bg-white shadow-sm ${deleteConfirm === section.id ? 'text-red-600 border-red-300' : ''}`}
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Section Content */}
                                            {editingSection === section.id ? (
                                                <div className="border border-blue-300 rounded-lg p-6 bg-blue-50">
                                                    <div className="mb-4">
                                                        <h4 className="font-medium text-gray-900 mb-2">
                                                            Editing: {section.sectionTemplate.name}
                                                        </h4>
                                                    </div>
                                                    {renderSectionEditor(section)}
                                                </div>
                                            ) : (
                                                <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
                                                    {renderSectionPreview(section)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Library Modal */}
            <SectionLibrary
                isOpen={showSectionLibrary}
                onClose={() => setShowSectionLibrary(false)}
                onAddSection={handleAddSection}
            />

            {/* Preview Modal */}
            <PagePreviewModal
                page={currentPage}
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
            />
        </div>
    )
}