'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store'
import { createPage } from '@/store/pagesSlice'
import { ArrowLeftIcon } from 'lucide-react'

export default function NewPagePage() {
    const dispatch = useAppDispatch()
    const { loading, error } = useAppSelector((state) => state.pages)
    const router = useRouter()

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        seoTitle: '',
        seoDescription: '',
        seoKeywords: ''
    })

    const [selectedTemplate, setSelectedTemplate] = useState<string>('')

    const pageTemplates = [
        { id: 'homepage', title: 'Homepage', slug: '/', description: 'Main landing page for your website' },
        { id: 'about', title: 'About Us', slug: '/about', description: 'Tell your story and company information' },
        { id: 'contact', title: 'Contact', slug: '/contact', description: 'Contact information and form' },
        { id: 'services', title: 'Services', slug: '/services', description: 'Showcase your services or products' },
        { id: 'blog', title: 'Blog', slug: '/blog', description: 'Blog or news section' },
        { id: 'custom', title: 'Custom Page', slug: '', description: 'Create a custom page with your own content' }
    ]

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplate(templateId)
        const template = pageTemplates.find(t => t.id === templateId)
        if (template) {
            setFormData(prev => ({
                ...prev,
                title: template.title,
                slug: template.slug,
                seoTitle: template.title,
                seoDescription: template.description
            }))
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Auto-generate slug from title only if no template is selected
        if (name === 'title' && !formData.slug && selectedTemplate === 'custom') {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()
            setFormData(prev => ({
                ...prev,
                slug: slug.startsWith('/') ? slug : `/${slug}`
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title || !formData.slug) {
            return
        }

        const result = await dispatch(createPage({
            title: formData.title,
            slug: formData.slug,
            seoTitle: formData.seoTitle || undefined,
            seoDescription: formData.seoDescription || undefined,
            seoKeywords: formData.seoKeywords || undefined
        }))

        if (createPage.fulfilled.match(result)) {
            router.push(`/admin/pages/${result.payload.id}/edit`)
        }
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <Link href="/admin/pages" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back to Pages
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Create New Page</h1>
                <p className="text-gray-600 mt-2">Add a new page to your website</p>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Page Template</h2>
                        <p className="text-sm text-gray-600 mb-4">Choose a template to get started quickly, or create a custom page.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {pageTemplates.map((template) => (
                                <div
                                    key={template.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedTemplate === template.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => handleTemplateSelect(template.id)}
                                >
                                    <h3 className="font-medium text-gray-900 mb-1">{template.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                                    {template.slug && (
                                        <p className="text-xs text-gray-500 font-mono">{template.slug}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Page Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter page title"
                                />
                            </div>

                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                                    URL Slug *
                                </label>
                                <input
                                    type="text"
                                    id="slug"
                                    name="slug"
                                    required
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                    placeholder="/page-url"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    The URL path for this page (e.g., /about-us)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                    SEO Title
                                </label>
                                <input
                                    type="text"
                                    id="seoTitle"
                                    name="seoTitle"
                                    value={formData.seoTitle}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="SEO optimized title"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Title that appears in search results (leave empty to use page title)
                                </p>
                            </div>

                            <div>
                                <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                    SEO Description
                                </label>
                                <textarea
                                    id="seoDescription"
                                    name="seoDescription"
                                    rows={3}
                                    value={formData.seoDescription}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Brief description for search engines"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Description that appears in search results (150-160 characters recommended)
                                </p>
                            </div>

                            <div>
                                <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 mb-2">
                                    SEO Keywords
                                </label>
                                <input
                                    type="text"
                                    id="seoKeywords"
                                    name="seoKeywords"
                                    value={formData.seoKeywords}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="keyword1, keyword2, keyword3"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Comma-separated keywords related to this page
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link href="/admin/pages">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={loading || !formData.title || !formData.slug}>
                            {loading ? 'Creating...' : 'Create Page'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}