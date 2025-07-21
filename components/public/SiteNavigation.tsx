'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/store'

interface NavigationMenu {
    id: string
    name: string
    location: string
    isActive: boolean
    items: NavigationItem[]
}

interface NavigationItem {
    id: string
    title: string
    url?: string
    pageId?: string
    parentId?: string
    target: 'SELF' | 'BLANK'
    order: number
    isVisible: boolean
    children?: NavigationItem[]
    page?: {
        id: string
        title: string
        slug: string
    }
}

export function SiteNavigation() {
    const [headerMenu, setHeaderMenu] = useState<NavigationMenu | null>(null)
    const [loading, setLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const { user } = useAppSelector((state) => state.auth)

    useEffect(() => {
        const fetchNavigation = async () => {
            try {
                const response = await fetch('/api/admin/navigation?location=HEADER_PRIMARY')
                if (response.ok) {
                    const data = await response.json()
                    const activeMenu = data.menus.find((menu: NavigationMenu) => menu.isActive)
                    setHeaderMenu(activeMenu || null)
                }
            } catch (error) {
                console.error('Error fetching navigation:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchNavigation()
    }, [])

    // Close mobile menu when path changes
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [pathname])

    const getItemUrl = (item: NavigationItem) => {
        if (item.url) return item.url
        if (item.page) {
            return item.page.slug === '/' ? '/' : `/pages${item.page.slug}`
        }
        return '#'
    }

    const isActiveLink = (item: NavigationItem) => {
        const itemUrl = getItemUrl(item)
        if (itemUrl === '/' && pathname === '/') return true
        if (itemUrl !== '/' && pathname === itemUrl) return true
        return false
    }

    const renderNavigationItem = (item: NavigationItem, isMobile = false) => {
        if (!item.isVisible) return null

        const url = getItemUrl(item)
        const isActive = isActiveLink(item)
        const target = item.target === 'BLANK' ? '_blank' : undefined
        const rel = item.target === 'BLANK' ? 'noopener noreferrer' : undefined

        if (isMobile) {
            return (
                <Link
                    key={item.id}
                    href={url}
                    target={target}
                    rel={rel}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                        }`}
                >
                    {item.title}
                </Link>
            )
        }

        return (
            <Link
                key={item.id}
                href={url}
                target={target}
                rel={rel}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
            >
                {item.title}
            </Link>
        )
    }

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-xl font-bold text-gray-900">
                                NexaCMS
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {!loading && headerMenu?.items
                                .filter(item => !item.parentId) // Only top-level items
                                .sort((a, b) => a.order - b.order)
                                .map(item => renderNavigationItem(item))
                            }
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <Link href="/admin">
                                <Button size="sm">Dashboard</Button>
                            </Link>
                        ) : (
                            <div className="hidden sm:flex sm:space-x-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">Sign In</Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </div>
                        )}

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
                    {!loading && headerMenu?.items
                        .filter(item => !item.parentId) // Only top-level items
                        .sort((a, b) => a.order - b.order)
                        .map(item => renderNavigationItem(item, true))
                    }

                    {!user && (
                        <div className="pl-3 pr-4 py-2 space-y-2">
                            <Link href="/login" className="block">
                                <Button variant="ghost" size="sm" className="w-full justify-start">Sign In</Button>
                            </Link>
                            <Link href="/register" className="block">
                                <Button size="sm" className="w-full">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}