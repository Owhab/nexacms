'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSiteConfig } from '@/contexts/site-config-context'
import Image from 'next/image'

interface NavigationItem {
    id: string
    title: string
    url?: string
    children?: NavigationItem[]
    target?: 'SELF' | 'BLANK'
}

interface ModernHeaderProps {
    navigation?: NavigationItem[]
    config?: any
}

export function ModernHeader({ navigation = [], config = {} }: ModernHeaderProps) {
    const { config: siteConfig } = useSiteConfig()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    if (!siteConfig) return null

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            {siteConfig.logoUrl && (
                                <Image
                                    src={siteConfig.logoUrl}
                                    alt={siteConfig.siteName}
                                    className="h-8 w-auto"
                                />
                            )}
                            <span className="text-xl font-bold" style={{ color: siteConfig.primaryColor }}>
                                {siteConfig.siteName}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navigation.map((item) => (
                            <div key={item.id} className="relative group">
                                <Link
                                    href={item.url || '#'}
                                    target={item.target === 'BLANK' ? '_blank' : '_self'}
                                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                                    style={{
                                        '--hover-color': siteConfig.primaryColor,
                                    } as React.CSSProperties}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = siteConfig.primaryColor
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = ''
                                    }}
                                >
                                    {item.title}
                                </Link>

                                {/* Dropdown Menu */}
                                {item.children && item.children.length > 0 && (
                                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="py-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.id}
                                                    href={child.url || '#'}
                                                    target={child.target === 'BLANK' ? '_blank' : '_self'}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                >
                                                    {child.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                    {navigation.map((item) => (
                        <div key={item.id}>
                            <Link
                                href={item.url || '#'}
                                target={item.target === 'BLANK' ? '_blank' : '_self'}
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.title}
                            </Link>
                            {item.children && item.children.length > 0 && (
                                <div className="pl-4">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={child.url || '#'}
                                            target={child.target === 'BLANK' ? '_blank' : '_self'}
                                            className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {child.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </header>
    )
}