'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SearchBar } from './SearchBar'

interface Page {
    id: string
    title: string
    slug: string
}

export function Navbar() {
    const [pages, setPages] = useState<Page[]>([])
    const [loading, setLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const response = await fetch('/api/public/pages/navigation')
                if (response.ok) {
                    const data = await response.json()
                    setPages(data.pages)
                }
            } catch (error) {
                console.error('Error fetching navigation:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPages()
    }, [])

    // Close mobile menu when path changes
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [pathname])

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/pages" className="text-xl font-bold text-gray-900">
                                Our Website
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                href="/pages"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/pages' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                            >
                                Home
                            </Link>

                            {!loading && pages.map((page) => (
                                <Link
                                    key={page.id}
                                    href={`/pages${page.slug}`}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === `/pages${page.slug}` ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                                >
                                    {page.title}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:block">
                            <SearchBar />
                        </div>
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {mobileMenuOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        href="/pages"
                        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname === '/pages' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}
                    >
                        Home
                    </Link>

                    {!loading && pages.map((page) => (
                        <Link
                            key={page.id}
                            href={`/pages${page.slug}`}
                            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname === `/pages${page.slug}` ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}
                        >
                            {page.title}
                        </Link>
                    ))}

                    <div className="pl-3 pr-4 py-2">
                        <SearchBar />
                    </div>
                </div>
            </div>
        </nav>
    )
}