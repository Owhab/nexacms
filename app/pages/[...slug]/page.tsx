'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { StorefrontSectionRenderer } from '@/lib/sections/renderer'

interface Page {
    id: string
    title: string
    slug: string
    status: string
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    sections: PageSection[]
}

interface PageSection {
    id: string
    order: number
    props: any
    sectionTemplate: {
        id: string
        name: string
        componentName: string
    }
}

interface PublicPageProps {
    params: { slug: string[] }
}

export default function PublicPage({ params }: PublicPageProps) {
    const [page, setPage] = useState<Page | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const slug = '/' + (params.slug?.join('/') || '')

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const response = await fetch(`/api/public/pages?slug=${encodeURIComponent(slug)}`)
                if (response.ok) {
                    const data = await response.json()
                    setPage(data.page)
                } else if (response.status === 404) {
                    setError('Page not found')
                } else {
                    setError('Failed to load page')
                }
            } catch (err) {
                setError('Network error')
            } finally {
                setLoading(false)
            }
        }

        fetchPage()
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading page...</p>
                </div>
            </div>
        )
    }

    if (error || !page) {
        return notFound()
    }

    return (
        <>
            <head>
                <title>{page.seoTitle || page.title}</title>
                {page.seoDescription && (
                    <meta name="description" content={page.seoDescription} />
                )}
                {page.seoKeywords && (
                    <meta name="keywords" content={page.seoKeywords} />
                )}
            </head>

            <div className="min-h-screen bg-white">
                {page.sections.length === 0 ? (
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
                            <p className="text-gray-600">This page has no content sections yet.</p>
                        </div>
                    </div>
                ) : (
                    [...page.sections]
                        .sort((a, b) => a.order - b.order)
                        .map((section) => (
                            <StorefrontSectionRenderer key={section.id} section={section} />
                        ))
                )}
            </div>
        </>
    )
}