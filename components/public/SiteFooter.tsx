'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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

export function SiteFooter() {
    const [footerMenu, setFooterMenu] = useState<NavigationMenu | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNavigation = async () => {
            try {
                const response = await fetch('/api/admin/navigation?location=FOOTER_PRIMARY')
                if (response.ok) {
                    const data = await response.json()
                    const activeMenu = data.menus.find((menu: NavigationMenu) => menu.isActive)
                    setFooterMenu(activeMenu || null)
                }
            } catch (error) {
                console.error('Error fetching footer navigation:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchNavigation()
    }, [])

    const getItemUrl = (item: NavigationItem) => {
        if (item.url) return item.url
        if (item.page) {
            return item.page.slug === '/' ? '/' : `/pages${item.page.slug}`
        }
        return '#'
    }

    const renderNavigationItem = (item: NavigationItem) => {
        if (!item.isVisible) return null

        const url = getItemUrl(item)
        const target = item.target === 'BLANK' ? '_blank' : undefined
        const rel = item.target === 'BLANK' ? 'noopener noreferrer' : undefined

        return (
            <Link
                key={item.id}
                href={url}
                target={target}
                rel={rel}
                className="text-gray-400 hover:text-white transition-colors"
            >
                {item.title}
            </Link>
        )
    }

    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">NexaCMS</h3>
                    <p className="text-gray-400 mb-8">Modern Content Management Made Simple</p>

                    {/* Footer Navigation */}
                    {!loading && footerMenu && footerMenu.items.length > 0 && (
                        <div className="flex justify-center space-x-6 mb-8">
                            {footerMenu.items
                                .filter(item => !item.parentId && item.isVisible)
                                .sort((a, b) => a.order - b.order)
                                .map(item => renderNavigationItem(item))
                            }
                        </div>
                    )}

                    {/* Default Footer Links (shown when no footer menu exists) */}
                    {(!footerMenu || footerMenu.items.length === 0) && (
                        <div className="flex justify-center space-x-6">
                            <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
                            <Link href="/login" className="text-gray-400 hover:text-white">Sign In</Link>
                            <Link href="/register" className="text-gray-400 hover:text-white">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        </footer>
    )
}