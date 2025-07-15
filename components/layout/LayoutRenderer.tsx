'use client'

import { useEffect, useState } from 'react'
import { useSiteConfig } from '@/contexts/site-config-context'
import { ModernHeader } from './headers/ModernHeader'
import { ModernFooter } from './footers/ModernFooter'

interface NavigationItem {
    id: string
    title: string
    url?: string
    children?: NavigationItem[]
    target?: 'SELF' | 'BLANK'
}

interface NavigationMenu {
    id: string
    name: string
    location: string
    items: NavigationItem[]
}

interface LayoutRendererProps {
    children: React.ReactNode
}

export function LayoutRenderer({ children }: LayoutRendererProps) {
    const { config } = useSiteConfig()
    const [headerNavigation, setHeaderNavigation] = useState<NavigationItem[]>([])
    const [footerNavigation, setFooterNavigation] = useState<NavigationItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNavigation()
    }, [])

    const fetchNavigation = async () => {
        try {
            const response = await fetch('/api/admin/navigation')
            if (response.ok) {
                const data = await response.json()
                const menus: NavigationMenu[] = data.menus

                // Find header and footer menus
                const headerMenu = menus.find(menu => menu.location === 'HEADER_PRIMARY')
                const footerMenu = menus.find(menu => menu.location === 'FOOTER_PRIMARY')

                setHeaderNavigation(headerMenu?.items || [])
                setFooterNavigation(footerMenu?.items || [])
            }
        } catch (error) {
            console.error('Error fetching navigation:', error)
        } finally {
            setLoading(false)
        }
    }

    const renderHeader = () => {
        if (!config) return null

        // For now, we'll use ModernHeader as default
        // In the future, this will be dynamic based on config.headerTemplateId
        return (
            <ModernHeader
                navigation={headerNavigation}
                config={config}
            />
        )
    }

    const renderFooter = () => {
        if (!config) return null

        // For now, we'll use ModernFooter as default
        // In the future, this will be dynamic based on config.footerTemplateId
        return (
            <ModernFooter
                navigation={footerNavigation}
                config={config}
            />
        )
    }

    if (loading || !config) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            {renderHeader()}
            <main className="flex-1">
                {children}
            </main>
            {renderFooter()}
        </div>
    )
}