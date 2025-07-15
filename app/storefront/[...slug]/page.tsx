'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

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

interface StorefrontPageProps {
    params: { slug: string[] }
}

export default function StorefrontPage({ params }: StorefrontPageProps) {
    const [page, setPage] = useState<Page | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const slug = '/' + (params.slug?.join('/') || '')

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const response = await fetch(`/api/storefront/pages?slug=${encodeURIComponent(slug)}`)
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

    const renderSection = (section: PageSection) => {
        const props = section.props

        switch (section.sectionTemplate.componentName) {
            case 'HeroSection':
                return (
                    <section key={section.id} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className={`text-${props.textAlign || 'center'}`}>
                                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                    {props.title || 'Welcome'}
                                </h1>
                                {props.subtitle && (
                                    <p className="text-xl md:text-2xl mb-8 text-blue-100">
                                        {props.subtitle}
                                    </p>
                                )}
                                {props.buttonText && (
                                    <a
                                        href={props.buttonLink || '#'}
                                        className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                    >
                                        {props.buttonText}
                                    </a>
                                )}
                            </div>
                        </div>
                    </section>
                )

            case 'TextBlock':
                return (
                    <section key={section.id} className="py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div
                                className={`text-${props.textAlign || 'left'}`}
                                style={{ maxWidth: props.maxWidth || '800px', margin: props.textAlign === 'center' ? '0 auto' : '0' }}
                                dangerouslySetInnerHTML={{ __html: props.content || '<p>Add your content here...</p>' }}
                            />
                        </div>
                    </section>
                )

            case 'ImageText':
                return (
                    <section key={section.id} className="py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${props.layout === 'right' ? 'md:grid-flow-col-dense' : ''}`}>
                                <div className={props.layout === 'right' ? 'md:col-start-2' : ''}>
                                    {props.image ? (
                                        <img
                                            src={props.image}
                                            alt={props.imageAlt || ''}
                                            className="w-full h-auto rounded-lg shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-500">Image placeholder</span>
                                        </div>
                                    )}
                                </div>
                                <div className={props.layout === 'right' ? 'md:col-start-1' : ''}>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        {props.title || 'Your Title Here'}
                                    </h2>
                                    <div
                                        className="text-gray-600"
                                        dangerouslySetInnerHTML={{ __html: props.content || '<p>Your content here...</p>' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )

            default:
                return (
                    <section key={section.id} className="py-8 bg-gray-100">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {section.sectionTemplate.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Component: {section.sectionTemplate.componentName}
                                </p>
                                <pre className="mt-4 text-xs text-left bg-white p-4 rounded border overflow-auto">
                                    {JSON.stringify(props, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </section>
                )
        }
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
                    page.sections
                        .sort((a, b) => a.order - b.order)
                        .map(renderSection)
                )}
            </div>
        </>
    )
}