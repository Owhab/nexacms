'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    HeroProps,
    HeroPreviewProps,
    ResponsiveConfig,
    ThemeConfig
} from '../types'
import { BaseHeroPreview } from '../previews/BaseHeroPreview'

/**
 * Preview Mode Types
 */
export type PreviewMode = 'mobile' | 'tablet' | 'desktop' | 'fullscreen'
export type PreviewContext = 'isolated' | 'page' | 'interactive'

/**
 * Preview Configuration
 */
interface PreviewConfig {
    mode: PreviewMode
    context: PreviewContext
    showGrid: boolean
    showRulers: boolean
    enableInteractions: boolean
    autoRefresh: boolean
    refreshInterval: number
}

/**
 * Device Specifications for Preview Modes
 */
const DEVICE_SPECS = {
    mobile: {
        width: 375,
        height: 667,
        label: 'Mobile (375px)',
        icon: '📱'
    },
    tablet: {
        width: 768,
        height: 1024,
        label: 'Tablet (768px)',
        icon: '📱'
    },
    desktop: {
        width: 1200,
        height: 800,
        label: 'Desktop (1200px)',
        icon: '💻'
    },
    fullscreen: {
        width: '100%',
        height: '100%',
        label: 'Full Screen',
        icon: '🖥️'
    }
} as const

/**
 * Advanced Preview Component
 * 
 * Provides comprehensive preview capabilities including:
 * - Responsive preview modes with device simulation
 * - Real-time updates during editing
 * - Page context preview
 * - Interactive element testing
 * - Performance monitoring
 */
interface AdvancedPreviewProps<T extends HeroProps = HeroProps> {
    props: T
    previewComponent: React.ComponentType<HeroPreviewProps<T>>
    onChange?: (props: Partial<T>) => void
    onInteraction?: (type: string, data: any) => void
    className?: string
    initialConfig?: Partial<PreviewConfig>
}

export function AdvancedPreview<T extends HeroProps = HeroProps>({
    props,
    previewComponent: PreviewComponent,
    onChange,
    onInteraction,
    className = '',
    initialConfig = {}
}: AdvancedPreviewProps<T>) {
    // Preview configuration state
    const [config, setConfig] = useState<PreviewConfig>({
        mode: 'desktop',
        context: 'isolated',
        showGrid: false,
        showRulers: false,
        enableInteractions: true,
        autoRefresh: true,
        refreshInterval: 500,
        ...initialConfig
    })

    // Preview state
    const [isLoading, setIsLoading] = useState(false)
    const [lastUpdate, setLastUpdate] = useState(Date.now())
    const [interactions, setInteractions] = useState<Array<{
        type: string
        timestamp: number
        data: any
    }>>([])

    // Refs
    const previewRef = useRef<HTMLDivElement>(null)
    const refreshTimeoutRef = useRef<NodeJS.Timeout>()

    // Handle configuration changes
    const updateConfig = useCallback((updates: Partial<PreviewConfig>) => {
        setConfig(prev => ({ ...prev, ...updates }))
    }, [])

    // Handle real-time updates
    useEffect(() => {
        if (config.autoRefresh && onChange) {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current)
            }

            refreshTimeoutRef.current = setTimeout(() => {
                setLastUpdate(Date.now())
            }, config.refreshInterval)
        }

        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current)
            }
        }
    }, [props, config.autoRefresh, config.refreshInterval, onChange])

    // Handle interactions
    const handleInteraction = useCallback((type: string, data: any) => {
        const interaction = {
            type,
            timestamp: Date.now(),
            data
        }

        setInteractions(prev => [...prev.slice(-9), interaction])
        onInteraction?.(type, data)
    }, [onInteraction])

    // Get device styles for current mode
    const getDeviceStyles = useCallback(() => {
        const device = DEVICE_SPECS[config.mode]

        if (config.mode === 'fullscreen') {
            return {
                width: '100%',
                height: '100%',
                minHeight: '600px'
            }
        }

        return {
            width: `${device.width}px`,
            height: `${device.height}px`,
            maxWidth: '100%',
            margin: '0 auto'
        }
    }, [config.mode])

    // Render preview toolbar
    const renderToolbar = () => (
        <div className="preview-toolbar flex items-center justify-between p-3 bg-gray-50 border-b">
            {/* Device Mode Selector */}
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Device:</span>
                <div className="flex space-x-1">
                    {Object.entries(DEVICE_SPECS).map(([mode, spec]) => (
                        <Button
                            key={mode}
                            variant={config.mode === mode ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateConfig({ mode: mode as PreviewMode })}
                            className="text-xs"
                        >
                            <span className="mr-1">{spec.icon}</span>
                            {mode === 'mobile' ? 'M' : mode === 'tablet' ? 'T' : mode === 'desktop' ? 'D' : 'F'}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Context Selector */}
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Context:</span>
                <select
                    value={config.context}
                    onChange={(e) => updateConfig({ context: e.target.value as PreviewContext })}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                    <option value="isolated">Isolated</option>
                    <option value="page">Page Context</option>
                    <option value="interactive">Interactive</option>
                </select>
            </div>

            {/* Preview Options */}
            <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-1 text-xs">
                    <input
                        type="checkbox"
                        checked={config.showGrid}
                        onChange={(e) => updateConfig({ showGrid: e.target.checked })}
                        className="rounded border-gray-300"
                    />
                    <span>Grid</span>
                </label>

                <label className="flex items-center space-x-1 text-xs">
                    <input
                        type="checkbox"
                        checked={config.showRulers}
                        onChange={(e) => updateConfig({ showRulers: e.target.checked })}
                        className="rounded border-gray-300"
                    />
                    <span>Rulers</span>
                </label>

                <label className="flex items-center space-x-1 text-xs">
                    <input
                        type="checkbox"
                        checked={config.enableInteractions}
                        onChange={(e) => updateConfig({ enableInteractions: e.target.checked })}
                        className="rounded border-gray-300"
                    />
                    <span>Interactive</span>
                </label>
            </div>

            {/* Refresh Controls */}
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLastUpdate(Date.now())}
                    className="text-xs"
                >
                    🔄 Refresh
                </Button>
                <span className="text-xs text-gray-500">
                    Updated: {new Date(lastUpdate).toLocaleTimeString()}
                </span>
            </div>
        </div>
    )

    // Render device frame
    const renderDeviceFrame = () => {
        const device = DEVICE_SPECS[config.mode]
        const styles = getDeviceStyles()

        return (
            <div className="preview-device-frame relative">
                {/* Device Label */}
                <div className="device-label text-center mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {device.icon} {device.label}
                    </span>
                </div>

                {/* Device Container */}
                <div
                    className="device-container relative border rounded-lg overflow-hidden bg-white shadow-lg"
                    style={styles}
                >
                    {/* Grid Overlay */}
                    {config.showGrid && (
                        <div className="absolute inset-0 pointer-events-none z-10">
                            <div
                                className="w-full h-full opacity-20"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                                        linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                                    `,
                                    backgroundSize: '20px 20px'
                                }}
                            />
                        </div>
                    )}

                    {/* Rulers */}
                    {config.showRulers && (
                        <>
                            <div className="absolute top-0 left-0 right-0 h-4 bg-gray-100 border-b text-xs flex items-center justify-center">
                                Horizontal Ruler
                            </div>
                            <div className="absolute top-0 left-0 bottom-0 w-4 bg-gray-100 border-r text-xs flex items-center justify-center">
                                <span className="transform -rotate-90 whitespace-nowrap">Vertical</span>
                            </div>
                        </>
                    )}

                    {/* Preview Content */}
                    <div
                        ref={previewRef}
                        className={`preview-content ${config.showRulers ? 'ml-4 mt-4' : ''}`}
                        style={{
                            width: config.showRulers ? 'calc(100% - 16px)' : '100%',
                            height: config.showRulers ? 'calc(100% - 16px)' : '100%'
                        }}
                    >
                        {config.context === 'page' ? (
                            <PageContextPreview
                                heroProps={props}
                                previewComponent={PreviewComponent}
                                enableInteractions={config.enableInteractions}
                                onInteraction={handleInteraction}
                            />
                        ) : config.context === 'interactive' ? (
                            <InteractivePreview
                                heroProps={props}
                                previewComponent={PreviewComponent}
                                onInteraction={handleInteraction}
                            />
                        ) : (
                            <PreviewComponent
                                {...(props as any)}
                                isPreview={true}
                                previewMode={config.mode === 'fullscreen' ? 'desktop' : config.mode}
                            />
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // Render interaction log
    const renderInteractionLog = () => {
        if (!config.enableInteractions || interactions.length === 0) {
            return null
        }

        return (
            <div className="interaction-log mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Recent Interactions
                </h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                    {interactions.slice(-5).map((interaction, index) => (
                        <div key={index} className="text-xs text-gray-600 flex justify-between">
                            <span>{interaction.type}</span>
                            <span>{new Date(interaction.timestamp).toLocaleTimeString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className={`advanced-preview ${className}`}>
            {renderToolbar()}

            <div className="preview-container p-4">
                {renderDeviceFrame()}
                {renderInteractionLog()}
            </div>
        </div>
    )
}

/**
 * Page Context Preview Component
 * 
 * Shows the hero section within a simulated page layout
 */
interface PageContextPreviewProps<T extends HeroProps = HeroProps> {
    heroProps: T
    previewComponent: React.ComponentType<HeroPreviewProps<T>>
    enableInteractions: boolean
    onInteraction: (type: string, data: any) => void
}

function PageContextPreview<T extends HeroProps = HeroProps>({
    heroProps,
    previewComponent: PreviewComponent,
    enableInteractions,
    onInteraction
}: PageContextPreviewProps<T>) {
    return (
        <div className="page-context-preview">
            {/* Simulated Header */}
            <div className="simulated-header bg-white border-b p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded"></div>
                    <span className="font-semibold">Your Website</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Home</span>
                    <span className="text-sm text-gray-600">About</span>
                    <span className="text-sm text-gray-600">Contact</span>
                </div>
            </div>

            {/* Hero Section */}
            <div
                className="hero-section-container"
                onClick={() => enableInteractions && onInteraction('hero_click', { section: 'hero' })}
            >
                <PreviewComponent
                    {...(heroProps as any)}
                    isPreview={true}
                    previewMode="desktop"
                />
            </div>

            {/* Simulated Content Below */}
            <div className="simulated-content p-8 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Page Content</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white p-4 rounded-lg shadow">
                                <div className="w-full h-32 bg-gray-200 rounded mb-3"></div>
                                <h3 className="font-semibold mb-2">Content Block {i}</h3>
                                <p className="text-sm text-gray-600">
                                    This simulates content that would appear below the hero section.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Interactive Preview Component
 * 
 * Enables testing of interactive elements within the hero section
 */
interface InteractivePreviewProps<T extends HeroProps = HeroProps> {
    heroProps: T
    previewComponent: React.ComponentType<HeroPreviewProps<T>>
    onInteraction: (type: string, data: any) => void
}

function InteractivePreview<T extends HeroProps = HeroProps>({
    heroProps,
    previewComponent: PreviewComponent,
    onInteraction
}: InteractivePreviewProps<T>) {
    const [hoveredElement, setHoveredElement] = useState<string | null>(null)
    const [clickedElement, setClickedElement] = useState<string | null>(null)

    const handleElementHover = useCallback((elementId: string, isHovering: boolean) => {
        setHoveredElement(isHovering ? elementId : null)
        onInteraction('hover', { elementId, isHovering })
    }, [onInteraction])

    const handleElementClick = useCallback((elementId: string, event: React.MouseEvent) => {
        event.preventDefault()
        setClickedElement(elementId)
        onInteraction('click', { elementId, coordinates: { x: event.clientX, y: event.clientY } })

        // Reset clicked state after animation
        setTimeout(() => setClickedElement(null), 200)
    }, [onInteraction])

    return (
        <div className="interactive-preview relative">
            {/* Interactive Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {hoveredElement && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded">
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Hovering: {hoveredElement}
                        </div>
                    </div>
                )}

                {clickedElement && (
                    <div className="absolute inset-0 bg-green-500 bg-opacity-20 border-2 border-green-500 rounded animate-pulse">
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Clicked: {clickedElement}
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Preview with Interaction Handlers */}
            <div
                className="interactive-content"
                onMouseEnter={() => handleElementHover('hero-container', true)}
                onMouseLeave={() => handleElementHover('hero-container', false)}
                onClick={(e) => handleElementClick('hero-container', e)}
            >
                <PreviewComponent
                    {...(heroProps as any)}
                    isPreview={true}
                    previewMode="desktop"
                />
            </div>

            {/* Interaction Instructions */}
            <div className="interaction-instructions absolute bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
                <div>• Hover to highlight elements</div>
                <div>• Click to test interactions</div>
                <div>• Check console for events</div>
            </div>
        </div>
    )
}

export default AdvancedPreview