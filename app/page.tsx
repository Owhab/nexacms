'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store'
import { checkAuth } from '@/store/authSlice'
import { CheckIcon, ArrowRightIcon } from 'lucide-react'
import { StorefrontSectionRenderer } from '@/lib/sections/renderer'
import { SiteNavigation } from '@/components/public/SiteNavigation'
import { SiteFooter } from '@/components/public/SiteFooter'

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

export default function HomePage() {
    const dispatch = useAppDispatch()
    const { user, loading } = useAppSelector((state) => state.auth)
    const [homepage, setHomepage] = useState<Page | null>(null)
    const [pageLoading, setPageLoading] = useState(true)

    useEffect(() => {
        dispatch(checkAuth())
        fetchHomepage()
    }, [dispatch])

    const fetchHomepage = async () => {
        try {
            const response = await fetch('/api/public/pages?slug=/')
            if (response.ok) {
                const data = await response.json()
                setHomepage(data.page)
            } else {
                // No custom homepage found, will show default landing page
                console.log('No custom homepage found, showing default landing page')
            }
        } catch (error) {
            console.error('Error fetching homepage:', error)
        } finally {
            setPageLoading(false)
        }
    }

    if (loading || pageLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    // If we have a custom homepage, render it
    if (homepage) {
        return (
            <>
                <head>
                    <title>{homepage.seoTitle || homepage.title}</title>
                    {homepage.seoDescription && (
                        <meta name="description" content={homepage.seoDescription} />
                    )}
                    {homepage.seoKeywords && (
                        <meta name="keywords" content={homepage.seoKeywords} />
                    )}
                </head>

                <div className="min-h-screen bg-white">
                    <SiteNavigation />

                    {homepage.sections.length === 0 ? (
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">{homepage.title}</h1>
                                <p className="text-gray-600">This page has no content sections yet.</p>
                                {user && (
                                    <Link href={`/admin/pages/${homepage.id}/edit`} className="mt-4 inline-block">
                                        <Button>Edit Homepage</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : (
                        [...homepage.sections]
                            .sort((a, b) => a.order - b.order)
                            .map((section) => (
                                <StorefrontSectionRenderer key={section.id} section={section} />
                            ))
                    )}

                    <SiteFooter />
                </div>
            </>
        )
    }

    // Default landing page when no custom homepage exists
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">NexaCMS</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                                    <Link href="/admin">
                                        <Button>Dashboard</Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost">Sign In</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button>Get Started</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Modern Content Management
                            <span className="text-blue-600 block">Made Simple</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Build beautiful websites with our intuitive drag-and-drop page builder.
                            No coding required, unlimited possibilities.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {user ? (
                                <Link href="/admin">
                                    <Button size="lg" className="w-full sm:w-auto">
                                        Go to Dashboard
                                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/register">
                                        <Button size="lg" className="w-full sm:w-auto">
                                            Start Building Free
                                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Link href="/storefront">
                                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                            View Demo Site
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything you need to build amazing websites
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed for creators, marketers, and developers
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Drag & Drop Builder</h3>
                            <p className="text-gray-600">Create stunning pages with our intuitive visual editor. No coding skills required.</p>
                        </div>

                        <div className="text-center p-6">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
                            <p className="text-gray-600">Secure user management with admin, editor, and viewer roles for team collaboration.</p>
                        </div>

                        <div className="text-center p-6">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                            <p className="text-gray-600">Optimized for performance with fast loading times and excellent Core Web Vitals.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Why choose NexaCMS?
                            </h2>
                            <div className="space-y-4">
                                {[
                                    'Visual page builder with real-time preview',
                                    'Responsive design for all devices',
                                    'SEO optimization built-in',
                                    'Media library management',
                                    'User role management',
                                    'Modern, clean interface'
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-center">
                                        <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                {user ? (
                                    <Link href="/admin">
                                        <Button size="lg">
                                            Go to Dashboard
                                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/register">
                                        <Button size="lg">
                                            Get Started Today
                                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to start?</h3>
                                <p className="text-gray-600 mb-6">Join thousands of creators building amazing websites</p>
                                {user ? (
                                    <div className="space-y-3">
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                            <p className="text-sm text-green-700">
                                                Welcome back, <span className="font-medium">{user.email}</span>
                                            </p>
                                            <p className="text-xs text-green-600 capitalize">
                                                Role: {user.role.toLowerCase()}
                                            </p>
                                        </div>
                                        <Link href="/admin" className="block">
                                            <Button className="w-full" size="lg">Access Dashboard</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Link href="/register" className="block">
                                            <Button className="w-full" size="lg">Create Free Account</Button>
                                        </Link>
                                        <Link href="/login" className="block">
                                            <Button variant="outline" className="w-full" size="lg">Sign In</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">NexaCMS</h3>
                        <p className="text-gray-400 mb-8">Modern Content Management Made Simple</p>
                        <div className="flex justify-center space-x-6">
                            <Link href="/storefront" className="text-gray-400 hover:text-white">Demo</Link>
                            <Link href="/login" className="text-gray-400 hover:text-white">Sign In</Link>
                            <Link href="/register" className="text-gray-400 hover:text-white">Get Started</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}