'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { HeroProps } from '../types'

/**
 * Real-time Preview Configuration
 */
interface RealTimePreviewConfig {
    enabled: boolean
    debounceMs: number
    throttleMs: number
    maxUpdateFrequency: number
    enablePerformanceMonitoring: boolean
}

/**
 * Performance Metrics
 */
interface PerformanceMetrics {
    updateCount: number
    averageUpdateTime: number
    lastUpdateTime: number
    totalUpdateTime: number
    peakUpdateTime: number
    droppedUpdates: number
}

/**
 * Update Event
 */
interface UpdateEvent<T extends HeroProps = HeroProps> {
    timestamp: number
    props: T
    changes: Partial<T>
    source: 'user' | 'system' | 'external'
    updateId: string
}

/**
 * Real-time Preview Hook
 * 
 * Manages real-time preview updates with:
 * - Debounced and throttled updates
 * - Performance monitoring
 * - Update batching
 * - Error handling
 */
export function useRealTimePreview<T extends HeroProps = HeroProps>(
    initialProps: T,
    config: Partial<RealTimePreviewConfig> = {}
) {
    // Configuration with defaults
    const finalConfig: RealTimePreviewConfig = {
        enabled: true,
        debounceMs: 300,
        throttleMs: 100,
        maxUpdateFrequency: 60, // Updates per second
        enablePerformanceMonitoring: true,
        ...config
    }

    // State
    const [currentProps, setCurrentProps] = useState<T>(initialProps)
    const [isUpdating, setIsUpdating] = useState(false)
    const [updateQueue, setUpdateQueue] = useState<UpdateEvent<T>[]>([])
    const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
        updateCount: 0,
        averageUpdateTime: 0,
        lastUpdateTime: 0,
        totalUpdateTime: 0,
        peakUpdateTime: 0,
        droppedUpdates: 0
    })

    // Refs
    const debounceTimeoutRef = useRef<NodeJS.Timeout>()
    const throttleTimeoutRef = useRef<NodeJS.Timeout>()
    const lastUpdateTimeRef = useRef<number>(0)
    const updateIdCounterRef = useRef<number>(0)
    const performanceStartTimeRef = useRef<number>(0)

    // Generate unique update ID
    const generateUpdateId = useCallback(() => {
        return `update_${++updateIdCounterRef.current}_${Date.now()}`
    }, [])

    // Calculate update frequency
    const canUpdate = useCallback(() => {
        const now = Date.now()
        const timeSinceLastUpdate = now - lastUpdateTimeRef.current
        const minInterval = 1000 / finalConfig.maxUpdateFrequency

        return timeSinceLastUpdate >= minInterval
    }, [finalConfig.maxUpdateFrequency])

    // Process update with performance monitoring
    const processUpdate = useCallback((updateEvent: UpdateEvent<T>) => {
        if (!finalConfig.enabled) return

        const startTime = performance.now()
        performanceStartTimeRef.current = startTime

        setIsUpdating(true)

        try {
            // Apply the update
            setCurrentProps(updateEvent.props)
            lastUpdateTimeRef.current = Date.now()

            // Update performance metrics
            if (finalConfig.enablePerformanceMonitoring) {
                const endTime = performance.now()
                const updateTime = endTime - startTime

                setPerformanceMetrics(prev => {
                    const newUpdateCount = prev.updateCount + 1
                    const newTotalTime = prev.totalUpdateTime + updateTime

                    return {
                        updateCount: newUpdateCount,
                        averageUpdateTime: newTotalTime / newUpdateCount,
                        lastUpdateTime: updateTime,
                        totalUpdateTime: newTotalTime,
                        peakUpdateTime: Math.max(prev.peakUpdateTime, updateTime),
                        droppedUpdates: prev.droppedUpdates
                    }
                })
            }
        } catch (error) {
            console.error('Real-time preview update error:', error)
        } finally {
            setIsUpdating(false)
        }
    }, [finalConfig.enabled, finalConfig.enablePerformanceMonitoring])

    // Debounced update handler
    const debouncedUpdate = useCallback((updateEvent: UpdateEvent<T>) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }

        debounceTimeoutRef.current = setTimeout(() => {
            if (canUpdate()) {
                processUpdate(updateEvent)
            } else {
                // Queue the update for later
                setUpdateQueue(prev => [...prev, updateEvent])
                setPerformanceMetrics(prev => ({
                    ...prev,
                    droppedUpdates: prev.droppedUpdates + 1
                }))
            }
        }, finalConfig.debounceMs)
    }, [canUpdate, processUpdate, finalConfig.debounceMs])

    // Throttled update handler
    const throttledUpdate = useCallback((updateEvent: UpdateEvent<T>) => {
        if (throttleTimeoutRef.current) return

        throttleTimeoutRef.current = setTimeout(() => {
            throttleTimeoutRef.current = undefined
            processUpdate(updateEvent)
        }, finalConfig.throttleMs)
    }, [processUpdate, finalConfig.throttleMs])

    // Main update function
    const updatePreview = useCallback((
        changes: Partial<T>,
        source: 'user' | 'system' | 'external' = 'user',
        immediate: boolean = false
    ) => {
        const newProps = { ...currentProps, ...changes }
        const updateEvent: UpdateEvent<T> = {
            timestamp: Date.now(),
            props: newProps,
            changes,
            source,
            updateId: generateUpdateId()
        }

        if (immediate) {
            processUpdate(updateEvent)
        } else if (source === 'user') {
            debouncedUpdate(updateEvent)
        } else {
            throttledUpdate(updateEvent)
        }
    }, [currentProps, generateUpdateId, processUpdate, debouncedUpdate, throttledUpdate])

    // Process queued updates
    useEffect(() => {
        if (updateQueue.length === 0) return

        const processQueue = () => {
            const nextUpdate = updateQueue[0]
            if (nextUpdate && canUpdate()) {
                processUpdate(nextUpdate)
                setUpdateQueue(prev => prev.slice(1))
            }
        }

        const queueInterval = setInterval(processQueue, finalConfig.throttleMs)
        return () => clearInterval(queueInterval)
    }, [updateQueue, canUpdate, processUpdate, finalConfig.throttleMs])

    // Cleanup timeouts
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
            }
            if (throttleTimeoutRef.current) {
                clearTimeout(throttleTimeoutRef.current)
            }
        }
    }, [])

    // Reset performance metrics
    const resetMetrics = useCallback(() => {
        setPerformanceMetrics({
            updateCount: 0,
            averageUpdateTime: 0,
            lastUpdateTime: 0,
            totalUpdateTime: 0,
            peakUpdateTime: 0,
            droppedUpdates: 0
        })
    }, [])

    // Force immediate update
    const forceUpdate = useCallback((changes: Partial<T>) => {
        updatePreview(changes, 'system', true)
    }, [updatePreview])

    // Batch multiple updates
    const batchUpdate = useCallback((updates: Array<{ changes: Partial<T>; source?: 'user' | 'system' | 'external' }>) => {
        const batchedChanges = updates.reduce((acc, update) => ({ ...acc, ...update.changes }), {} as Partial<T>)
        updatePreview(batchedChanges, 'system', false)
    }, [updatePreview])

    return {
        // Current state
        currentProps,
        isUpdating,
        updateQueue: updateQueue.length,
        performanceMetrics,

        // Update functions
        updatePreview,
        forceUpdate,
        batchUpdate,

        // Utility functions
        resetMetrics,
        canUpdate,

        // Configuration
        config: finalConfig
    }
}

/**
 * Real-time Preview Provider Hook
 * 
 * Provides real-time preview context for child components
 */
export function useRealTimePreviewProvider<T extends HeroProps = HeroProps>(
    initialProps: T,
    config?: Partial<RealTimePreviewConfig>
) {
    const preview = useRealTimePreview(initialProps, config)

    // Enhanced update function with validation
    const updateWithValidation = useCallback((
        changes: Partial<T>,
        validator?: (props: T) => boolean,
        source?: 'user' | 'system' | 'external'
    ) => {
        const newProps = { ...preview.currentProps, ...changes }
        
        if (validator && !validator(newProps)) {
            console.warn('Real-time preview update failed validation:', changes)
            return false
        }

        preview.updatePreview(changes, source)
        return true
    }, [preview])

    // Optimized update for specific field types
    const updateField = useCallback((
        fieldPath: string,
        value: any,
        source?: 'user' | 'system' | 'external'
    ) => {
        const changes = {} as Partial<T>
        const pathParts = fieldPath.split('.')
        
        let current: any = changes
        for (let i = 0; i < pathParts.length - 1; i++) {
            current[pathParts[i]] = current[pathParts[i]] || {}
            current = current[pathParts[i]]
        }
        current[pathParts[pathParts.length - 1]] = value

        preview.updatePreview(changes, source)
    }, [preview])

    return {
        ...preview,
        updateWithValidation,
        updateField
    }
}

/**
 * Performance Monitor Hook
 * 
 * Monitors real-time preview performance
 */
export function usePreviewPerformanceMonitor() {
    const [metrics, setMetrics] = useState<{
        fps: number
        memoryUsage: number
        renderTime: number
        updateLatency: number
    }>({
        fps: 0,
        memoryUsage: 0,
        renderTime: 0,
        updateLatency: 0
    })

    const [isMonitoring, setIsMonitoring] = useState(false)
    const frameCountRef = useRef(0)
    const lastFrameTimeRef = useRef(performance.now())

    // Start monitoring
    const startMonitoring = useCallback(() => {
        setIsMonitoring(true)
        
        const monitor = () => {
            if (!isMonitoring) return

            const now = performance.now()
            frameCountRef.current++

            // Calculate FPS every second
            if (now - lastFrameTimeRef.current >= 1000) {
                const fps = frameCountRef.current
                frameCountRef.current = 0
                lastFrameTimeRef.current = now

                // Get memory usage if available
                const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0

                setMetrics(prev => ({
                    ...prev,
                    fps,
                    memoryUsage: memoryUsage / 1024 / 1024 // Convert to MB
                }))
            }

            requestAnimationFrame(monitor)
        }

        requestAnimationFrame(monitor)
    }, [isMonitoring])

    // Stop monitoring
    const stopMonitoring = useCallback(() => {
        setIsMonitoring(false)
    }, [])

    return {
        metrics,
        isMonitoring,
        startMonitoring,
        stopMonitoring
    }
}

export default useRealTimePreview