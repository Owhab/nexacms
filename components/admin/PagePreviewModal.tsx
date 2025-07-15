'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { XIcon, ExternalLinkIcon } from 'lucide-react'
import { StorefrontSectionRenderer } from '@/lib/sections/renderer'

interface Page {
    id: string
    title: string
    slug: string
    status: string
    sections: PageSection[]
}

interface PageSection {
    id: string
    order: number
    props: string
    sectionTemplate: {
        id: string
        name: string
        componentName: string
    }
}

interface PagePreviewModalProps {
    page: Page
    isOpen: boolean
    onClose: () => void
}

export function PagePreviewModal({ page, isOpen, onClose }: PagePreviewModalProps) {
    if (!isOpen) return null

    const renderSection = (section: PageSection) => {
        return <StorefrontSectionRenderer key={section.id} section={section} />
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Preview: {page.title}</h2>
                            <p className="text-sm text-gray-500">How your page will look to visitors</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {page.status === 'PUBLISHED' && (
                                <a
                                    href={`/storefront${page.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    <ExternalLinkIcon className="mr-1 h-4 w-4" />
                                    View Live
                                </a>
                            )}
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <XIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-auto">
                        <div className="min-h-full bg-white">
                            {page.sections.length === 0 ? (
                                <div className="min-h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
                                        <p className="text-gray-600">This page has no content sections yet.</p>
                                    </div>
                                </div>
                            ) : (
                                [...page.sections]
                                    .sort((a, b) => a.order - b.order)
                                    .map(renderSection)
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}