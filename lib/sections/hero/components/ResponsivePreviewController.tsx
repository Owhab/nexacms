'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { HeroProps, HeroPreviewProps } from '../types'

/**
 * Responsive Breakpoints Configuration
 */
export const RESPONSIVE_BREAKPOINTS = {
    mobile: {
        width: 375,
        height: 667,
        label: 'Mobile',
        icon: '📱',
        className: 'mobile-preview'
    },
    tablet: {
        width: 768,
        height: 1024,
        label: 'Tablet',
        icon: '📱',
        className: 'tablet-preview'
    },
    desktop: {
        width: 1200,
        height: 800,
        label: 'Desktop',
        icon: '💻',
        className: 'desktop-preview'
    }
} as const

export type ResponsiveMode = keyof typeof RESPONSIVE_BREAKPOINTS

/**
 * Responsive Preview Controller Props
 */
interface ResponsivePreviewControllerProps<T extends HeroProps = HeroProps> {
    heroProps: T
    previewComponent: React.ComponentType<HeroPreviewProps<T>>
    onChange?: (props: Partial<T>) => void
    className?: string
    showControls?: boolean
    defaultMode?: ResponsiveMode
    enableRealTimeUpdates?: boolean
}

/**
 * Responsive Preview Controller Component
 * 
 * Provides responsive preview capabilities with:
 * - Device-specific preview modes
 * - Real-time updates during editing
 * - Responsive breakpoint testing
 * - Performance monitoring
 */
export function ResponsivePreviewController<T extends HeroProps = HeroProps>({
    heroProps,
    previewComponent: PreviewComponent,
    onChange,
    className = '',
    showControls = true,
    defaultMode = 'desktop',
    enableRealTimeUpdates = true
}: ResponsivePreviewControllerProps<T>) {
    // State
    const [currentMode, setCurrentMode] = useState<ResponsiveMode>(defaultMode)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [lastUpdate, setLastUpdate] = useState(Date.now())
    const [performanceMetrics, setPerformanceMetrics] = useState<{
        renderTime: number
        mode: ResponsiveMode
    } | null>(null)

    // Handle mode changes with smooth transitions
    const handleModeChange = useCallback((mode: ResponsiveMode) => {
        if (mode === currentMode) return

        setIsTransitioning(true)
        
        // Measure transition performance
        const startTime = performance.now()
        
        setTimeout(() => {
            setCurrentMode(mode)
            setIsTransitioning(false)
            
            const endTime = performance.now()
            setPerformanceMetrics({
                renderTime: endTime - startTime,
                mode
            })
        }, 150) // Smooth transition delay
    }, [currentMode])

    // Handle real-time updates
    useEffect(() => {
        if (enableRealTimeUpdates) {
            setLastUpdate(Date.now())
        }
    }, [heroProps, enableRealTimeUpdates])

    // Get current breakpoint configuration
    const currentBreakpoint = RESPONSIVE_BREAKPOINTS[currentMode]

    // Calculate preview styles
    const getPreviewStyles = useCallback(() => {
        const breakpoint = RESPONSIVE_BREAKPOINTS[currentMode]
        
        return {
            width: `${breakpoint.width}px`,
            height: `${breakpoint.height}px`,
            maxWidth: '100%',
            transition: 'all 0.3s ease-in-out',
            transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
            opacity: isTransitioning ? 0.7 : 1
        }
    }, [currentMode, isTransitioning])

    // Render mode selector
    const renderModeSelector = () => {
        if (!showControls) return null

        return (
            <div className="responsive-mode-selector flex items-center justify-between p-3 bg-gray-50 border-b">
                {/* Mode Buttons */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Preview:</span>
                    <div className="flex space-x-1">
                        {Object.entries(RESPONSIVE_BREAKPOINTS).map(([mode, config]) => (
                            <Button
                                key={mode}
                                variant={currentMode === mode ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleModeChange(mode as ResponsiveMode)}
                                disabled={isTransitioning}
                                className="text-xs"
                            >
                                <span className="mr-1">{config.icon}</span>
                                {config.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Current Dimensions */}
                <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500">
                        {currentBreakpoint.width} × {currentBreakpoint.height}px
                    </span>
                    
                    {performanceMetrics && (
                        <span className="text-xs text-gray-500">
                            Render: {performanceMetrics.renderTime.toFixed(1)}ms
                        </span>
                    )}
                    
                    {enableRealTimeUpdates && (
                        <span className="text-xs text-gray-500">
                            Updated: {new Date(lastUpdate).toLocaleTimeString()}
                        </span>
                    )}
                </div>
            </div>
        )
    }

    // Render responsive preview
    const renderResponsivePreview = () => {
        return (
            <div className="responsive-preview-container flex justify-center p-6 bg-gray-100">
                <div
                    className={`responsive-preview-frame border rounded-lg overflow-hidden bg-white shadow-lg ${currentBreakpoint.className}`}
                    style={getPreviewStyles()}
                >
                    {/* Device Frame Header */}
                    <div className="device-header bg-gray-800 text-white text-center py-1 text-xs">
                        {currentBreakpoint.icon} {currentBreakpoint.label} Preview
                    </div>

                    {/* Preview Content */}
                    <div className="preview-content h-full overflow-auto">
                        <PreviewComponent
                            {...(heroProps as any)}
                            isPreview={true}
                            previewMode={currentMode}
                        />
                    </div>
                </div>
            </div>
        )
    }

    // Render breakpoint indicators
    const renderBreakpointIndicators = () => {
        if (!showControls) return null

        return (
            <div className="breakpoint-indicators p-3 bg-gray-50 border-t">
                <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center space-x-4">
                        <span>Breakpoints:</span>
                        {Object.entries(RESPONSIVE_BREAKPOINTS).map(([mode, config]) => (
                            <div
                                key={mode}
                                className={`flex items-center space-x-1 ${
                                    currentMode === mode ? 'text-blue-600 font-medium' : ''
                                }`}
                            >
                                <span>{config.icon}</span>
                                <span>{config.width}px</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <span>Current: {currentBreakpoint.label}</span>
                        {isTransitioning && (
                            <span className="text-blue-600">Transitioning...</span>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`responsive-preview-controller ${className}`}>
            {renderModeSelector()}
            {renderResponsivePreview()}
            {renderBreakpointIndicators()}
        </div>
    )
}

/**
 * Responsive Preview Hook
 * 
 * Custom hook for managing responsive preview state
 */
export function useResponsivePreview(initialMode: ResponsiveMode = 'desktop') {
    const [mode, setMode] = useState<ResponsiveMode>(initialMode)
    const [isTransitioning, setIsTransitioning] = useState(false)

    const changeMode = useCallback((newMode: ResponsiveMode) => {
        if (newMode === mode) return

        setIsTransitioning(true)
        setTimeout(() => {
            setMode(newMode)
            setIsTransitioning(false)
        }, 150)
    }, [mode])

    const getCurrentBreakpoint = useCallback(() => {
        return RESPONSIVE_BREAKPOINTS[mode]
    }, [mode])

    return {
        mode,
        isTransitioning,
        changeMode,
        getCurrentBreakpoint,
        breakpoints: RESPONSIVE_BREAKPOINTS
    }
}

/**
 * Responsive Preview Wrapper Component
 * 
 * Simple wrapper for adding responsive preview to any hero component
 */
interface ResponsivePreviewWrapperProps<T extends HeroProps = HeroProps> {
    children: React.ReactNode
    heroProps: T
    mode: ResponsiveMode
    className?: string
}

export function ResponsivePreviewWrapper<T extends HeroProps = HeroProps>({
    children,
    heroProps,
    mode,
    className = ''
}: ResponsivePreviewWrapperProps<T>) {
    const breakpoint = RESPONSIVE_BREAKPOINTS[mode]

    return (
        <div 
            className={`responsive-preview-wrapper ${breakpoint.className} ${className}`}
            style={{
                width: `${breakpoint.width}px`,
                height: `${breakpoint.height}px`,
                maxWidth: '100%',
                margin: '0 auto',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'white'
            }}
        >
            {children}
        </div>
    )
}

export default ResponsivePreviewController