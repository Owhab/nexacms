'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MediaPicker } from '@/components/ui/MediaPicker'
import { useSiteConfig } from '@/contexts/site-config-context'
import {
    SettingsIcon,
    PaletteIcon,
    GlobeIcon,
    LayoutIcon,
    NavigationIcon,
    SaveIcon,
    UploadIcon
} from 'lucide-react'

interface HeaderTemplate {
    id: string
    name: string
    description?: string
    template: string
}

interface FooterTemplate {
    id: string
    name: string
    description?: string
    template: string
}

export default function SettingsPage() {
    const { config, updateConfig, loading } = useSiteConfig()
    const [activeTab, setActiveTab] = useState('general')
    const [saving, setSaving] = useState(false)
    const [headerTemplates, setHeaderTemplates] = useState<HeaderTemplate[]>([])
    const [footerTemplates, setFooterTemplates] = useState<FooterTemplate[]>([])

    const [formData, setFormData] = useState({
        siteName: '',
        siteDescription: '',
        logoUrl: '',
        faviconUrl: '',
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        accentColor: '#10b981',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderColor: '#e5e7eb',
        theme: 'LIGHT' as 'LIGHT' | 'DARK' | 'AUTO',
        language: 'en',
        direction: 'LTR' as 'LTR' | 'RTL',
        headerTemplateId: '',
        footerTemplateId: '',
    })

    useEffect(() => {
        if (config) {
            setFormData({
                siteName: config.siteName,
                siteDescription: config.siteDescription || '',
                logoUrl: config.logoUrl || '',
                faviconUrl: config.faviconUrl || '',
                primaryColor: config.primaryColor,
                secondaryColor: config.secondaryColor,
                accentColor: config.accentColor,
                backgroundColor: config.backgroundColor,
                textColor: config.textColor,
                borderColor: config.borderColor,
                theme: config.theme,
                language: config.language,
                direction: config.direction,
                headerTemplateId: config.headerTemplateId || '',
                footerTemplateId: config.footerTemplateId || '',
            })
        }
    }, [config])

    useEffect(() => {
        fetchTemplates()
    }, [])

    const fetchTemplates = async () => {
        try {
            const [headerRes, footerRes] = await Promise.all([
                fetch('/api/admin/header-templates'),
                fetch('/api/admin/footer-templates')
            ])

            if (headerRes.ok) {
                const headerData = await headerRes.json()
                setHeaderTemplates(headerData.templates)
            }

            if (footerRes.ok) {
                const footerData = await footerRes.json()
                setFooterTemplates(footerData.templates)
            }
        } catch (error) {
            console.error('Error fetching templates:', error)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            await updateConfig(formData)
        } catch (error) {
            console.error('Error saving settings:', error)
        } finally {
            setSaving(false)
        }
    }

    const tabs = [
        { id: 'general', name: 'General', icon: SettingsIcon },
        { id: 'theme', name: 'Theme & Colors', icon: PaletteIcon },
        { id: 'localization', name: 'Localization', icon: GlobeIcon },
        { id: 'layout', name: 'Layout Templates', icon: LayoutIcon },
        { id: 'navigation', name: 'Navigation', icon: NavigationIcon },
    ]

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
                        <p className="text-gray-600">Manage your website configuration and appearance</p>
                    </div>
                    <Button onClick={handleSave} disabled={saving}>
                        <SaveIcon className="mr-2 h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
                    <nav className="p-4 space-y-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className="mr-3 h-4 w-4" />
                                    {tab.name}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="max-w-4xl">
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Site Name
                                            </label>
                                            <input
                                                type="text"
                                                name="siteName"
                                                value={formData.siteName}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Logo
                                            </label>
                                            <MediaPicker
                                                value={formData.logoUrl ? {
                                                    id: 'current-logo',
                                                    url: formData.logoUrl,
                                                    type: 'IMAGE' as const,
                                                    fileName: 'logo',
                                                    fileSize: 0,
                                                    mimeType: 'image/*'
                                                } : undefined}
                                                onChange={(media) => {
                                                    if (media && !Array.isArray(media)) {
                                                        setFormData(prev => ({ ...prev, logoUrl: media.url }))
                                                    }
                                                }}
                                                accept="image/*"
                                                category="branding"
                                                type="IMAGE"
                                                placeholder="Upload or select logo"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Site Description
                                            </label>
                                            <textarea
                                                name="siteDescription"
                                                value={formData.siteDescription}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Favicon
                                            </label>
                                            <MediaPicker
                                                value={formData.faviconUrl ? {
                                                    id: 'current-favicon',
                                                    url: formData.faviconUrl,
                                                    type: 'IMAGE' as const,
                                                    fileName: 'favicon',
                                                    fileSize: 0,
                                                    mimeType: 'image/*'
                                                } : undefined}
                                                onChange={(media) => {
                                                    if (media && !Array.isArray(media)) {
                                                        setFormData(prev => ({ ...prev, faviconUrl: media.url }))
                                                    }
                                                }}
                                                accept="image/x-icon,image/png,image/svg+xml"
                                                category="branding"
                                                type="IMAGE"
                                                placeholder="Upload or select favicon"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'theme' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Theme & Colors</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Theme Mode
                                            </label>
                                            <select
                                                name="theme"
                                                value={formData.theme}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="LIGHT">Light</option>
                                                <option value="DARK">Dark</option>
                                                <option value="AUTO">Auto (System)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Primary Color
                                            </label>
                                            <div className="flex">
                                                <input
                                                    type="color"
                                                    name="primaryColor"
                                                    value={formData.primaryColor}
                                                    onChange={handleInputChange}
                                                    className="w-12 h-10 border border-gray-300 rounded-l-md"
                                                />
                                                <input
                                                    type="text"
                                                    name="primaryColor"
                                                    value={formData.primaryColor}
                                                    onChange={handleInputChange}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Secondary Color
                                            </label>
                                            <div className="flex">
                                                <input
                                                    type="color"
                                                    name="secondaryColor"
                                                    value={formData.secondaryColor}
                                                    onChange={handleInputChange}
                                                    className="w-12 h-10 border border-gray-300 rounded-l-md"
                                                />
                                                <input
                                                    type="text"
                                                    name="secondaryColor"
                                                    value={formData.secondaryColor}
                                                    onChange={handleInputChange}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Accent Color
                                            </label>
                                            <div className="flex">
                                                <input
                                                    type="color"
                                                    name="accentColor"
                                                    value={formData.accentColor}
                                                    onChange={handleInputChange}
                                                    className="w-12 h-10 border border-gray-300 rounded-l-md"
                                                />
                                                <input
                                                    type="text"
                                                    name="accentColor"
                                                    value={formData.accentColor}
                                                    onChange={handleInputChange}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Background Color
                                            </label>
                                            <div className="flex">
                                                <input
                                                    type="color"
                                                    name="backgroundColor"
                                                    value={formData.backgroundColor}
                                                    onChange={handleInputChange}
                                                    className="w-12 h-10 border border-gray-300 rounded-l-md"
                                                />
                                                <input
                                                    type="text"
                                                    name="backgroundColor"
                                                    value={formData.backgroundColor}
                                                    onChange={handleInputChange}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Text Color
                                            </label>
                                            <div className="flex">
                                                <input
                                                    type="color"
                                                    name="textColor"
                                                    value={formData.textColor}
                                                    onChange={handleInputChange}
                                                    className="w-12 h-10 border border-gray-300 rounded-l-md"
                                                />
                                                <input
                                                    type="text"
                                                    name="textColor"
                                                    value={formData.textColor}
                                                    onChange={handleInputChange}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">Preview</h3>
                                        <div
                                            className="p-4 rounded border"
                                            style={{
                                                backgroundColor: formData.backgroundColor,
                                                color: formData.textColor,
                                                borderColor: formData.borderColor
                                            }}
                                        >
                                            <h4 style={{ color: formData.primaryColor }} className="font-semibold mb-2">
                                                Sample Heading
                                            </h4>
                                            <p className="mb-2">This is how your text will look with the current color scheme.</p>
                                            <button
                                                className="px-4 py-2 rounded text-white"
                                                style={{ backgroundColor: formData.primaryColor }}
                                            >
                                                Primary Button
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'localization' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Localization Settings</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Language
                                            </label>
                                            <select
                                                name="language"
                                                value={formData.language}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="en">English</option>
                                                <option value="ar">Arabic (العربية)</option>
                                                <option value="es">Spanish (Español)</option>
                                                <option value="fr">French (Français)</option>
                                                <option value="de">German (Deutsch)</option>
                                                <option value="zh">Chinese (中文)</option>
                                                <option value="ja">Japanese (日本語)</option>
                                                <option value="ko">Korean (한국어)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Text Direction
                                            </label>
                                            <select
                                                name="direction"
                                                value={formData.direction}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="LTR">Left to Right (LTR)</option>
                                                <option value="RTL">Right to Left (RTL)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                        <h3 className="text-sm font-medium text-blue-900 mb-2">Direction Preview</h3>
                                        <div
                                            className="p-4 bg-white rounded border"
                                            dir={formData.direction.toLowerCase()}
                                        >
                                            <p className="mb-2">
                                                This text will flow in the {formData.direction === 'RTL' ? 'right-to-left' : 'left-to-right'} direction.
                                            </p>
                                            <div className="flex space-x-2">
                                                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Button 1</button>
                                                <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm">Button 2</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'layout' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Layout Templates</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-md font-medium text-gray-900 mb-3">Header Template</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {headerTemplates.map((template) => (
                                                    <div
                                                        key={template.id}
                                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${formData.headerTemplateId === template.id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                        onClick={() => setFormData(prev => ({ ...prev, headerTemplateId: template.id }))}
                                                    >
                                                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                                                        {template.description && (
                                                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-md font-medium text-gray-900 mb-3">Footer Template</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {footerTemplates.map((template) => (
                                                    <div
                                                        key={template.id}
                                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${formData.footerTemplateId === template.id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                        onClick={() => setFormData(prev => ({ ...prev, footerTemplateId: template.id }))}
                                                    >
                                                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                                                        {template.description && (
                                                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'navigation' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation Management</h2>
                                    <p className="text-gray-600 mb-6">
                                        Configure your site navigation menus. You can create different menus for header, footer, and other locations.
                                    </p>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <p className="text-yellow-800">
                                            Navigation management interface will be implemented in the next phase.
                                            This will include drag-and-drop menu builder with support for nested items.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}