import React from 'react'
import {
    HeroVariant,
    HeroProps,
    HeroSectionConfig,
    HeroEditorProps,
    HeroPreviewProps
} from './types'
import { HERO_SECTION_REGISTRY } from './registry'
import { 
    lazyLoadHeroVariant, 
    lazyLoadHeroEditor, 
    lazyLoadHeroPreview,
    HeroPerformanceMonitor
} from './performance'

/**
 * Hero Section Factory
 * 
 * Provides dynamic component loading for hero section variants, editors, and previews.
 * Implements lazy loading for performance optimization and supports hot-swapping of components.
 */
export class HeroSectionFactory {
    private static componentCache = new Map<string, React.ComponentType<any>>()
    private static loadingPromises = new Map<string, Promise<React.ComponentType<any>>>()

    /**
     * Get hero section configuration by variant
     */
    static getConfig(variant: HeroVariant): HeroSectionConfig | undefined {
        return Object.values(HERO_SECTION_REGISTRY).find(config => config.variant === variant)
    }

    /**
     * Get all available hero section configurations
     */
    static getAllConfigs(): HeroSectionConfig[] {
        return Object.values(HERO_SECTION_REGISTRY).filter(config => config.isActive)
    }

    /**
     * Get hero section configurations by category or tag
     */
    static getConfigsByTag(tag: string): HeroSectionConfig[] {
        return Object.values(HERO_SECTION_REGISTRY).filter(config =>
            config.isActive && config.tags.includes(tag)
        )
    }

    /**
     * Dynamically load hero section component
     */
    static async loadComponent(variant: HeroVariant): Promise<React.ComponentType<HeroProps> | null> {
        const cacheKey = `component-${variant}`

        // Return cached component if available
        if (this.componentCache.has(cacheKey)) {
            return this.componentCache.get(cacheKey)!
        }

        // Return existing loading promise if in progress
        if (this.loadingPromises.has(cacheKey)) {
            return this.loadingPromises.get(cacheKey)!
        }

        // Create loading promise
        const loadingPromise = this.loadComponentInternal(variant)
        this.loadingPromises.set(cacheKey, loadingPromise)

        try {
            const component = await loadingPromise
            this.componentCache.set(cacheKey, component)
            this.loadingPromises.delete(cacheKey)
            return component
        } catch (error) {
            this.loadingPromises.delete(cacheKey)
            console.error(`Failed to load hero component for variant: ${variant}`, error)
            return null
        }
    }

    /**
     * Dynamically load hero section editor component
     */
    static async loadEditor(variant: HeroVariant): Promise<React.ComponentType<HeroEditorProps> | null> {
        const cacheKey = `editor-${variant}`

        // Return cached component if available
        if (this.componentCache.has(cacheKey)) {
            return this.componentCache.get(cacheKey)!
        }

        // Return existing loading promise if in progress
        if (this.loadingPromises.has(cacheKey)) {
            return this.loadingPromises.get(cacheKey)!
        }

        // Create loading promise
        const loadingPromise = this.loadEditorInternal(variant)
        this.loadingPromises.set(cacheKey, loadingPromise)

        try {
            const component = await loadingPromise
            this.componentCache.set(cacheKey, component)
            this.loadingPromises.delete(cacheKey)
            return component
        } catch (error) {
            this.loadingPromises.delete(cacheKey)
            console.error(`Failed to load hero editor for variant: ${variant}`, error)
            return null
        }
    }

    /**
     * Dynamically load hero section preview component
     */
    static async loadPreview(variant: HeroVariant): Promise<React.ComponentType<HeroPreviewProps> | null> {
        const cacheKey = `preview-${variant}`

        // Return cached component if available
        if (this.componentCache.has(cacheKey)) {
            return this.componentCache.get(cacheKey)!
        }

        // Return existing loading promise if in progress
        if (this.loadingPromises.has(cacheKey)) {
            return this.loadingPromises.get(cacheKey)!
        }

        // Create loading promise
        const loadingPromise = this.loadPreviewInternal(variant)
        this.loadingPromises.set(cacheKey, loadingPromise)

        try {
            const component = await loadingPromise
            this.componentCache.set(cacheKey, component)
            this.loadingPromises.delete(cacheKey)
            return component
        } catch (error) {
            this.loadingPromises.delete(cacheKey)
            console.error(`Failed to load hero preview for variant: ${variant}`, error)
            return null
        }
    }

    /**
     * Create a lazy-loaded React component for a hero variant
     */
    static createLazyComponent(variant: HeroVariant): React.ComponentType<HeroProps> {
        return React.lazy(async () => {
            const component = await this.loadComponent(variant)
            if (!component) {
                throw new Error(`Hero component not found for variant: ${variant}`)
            }
            return { default: component }
        })
    }

    /**
     * Create a lazy-loaded React editor component for a hero variant
     */
    static createLazyEditor(variant: HeroVariant): React.ComponentType<HeroEditorProps> {
        return React.lazy(async () => {
            const component = await this.loadEditor(variant)
            if (!component) {
                throw new Error(`Hero editor not found for variant: ${variant}`)
            }
            return { default: component }
        })
    }

    /**
     * Create a lazy-loaded React preview component for a hero variant
     */
    static createLazyPreview(variant: HeroVariant): React.ComponentType<HeroPreviewProps> {
        return React.lazy(async () => {
            const component = await this.loadPreview(variant)
            if (!component) {
                throw new Error(`Hero preview not found for variant: ${variant}`)
            }
            return { default: component }
        })
    }

    /**
     * Preload components for better performance
     */
    static async preloadComponents(variants: HeroVariant[]): Promise<void> {
        const promises = variants.flatMap(variant => [
            this.loadComponent(variant),
            this.loadEditor(variant),
            this.loadPreview(variant)
        ])

        await Promise.allSettled(promises)
    }

    /**
     * Clear component cache (useful for development/hot reloading)
     */
    static clearCache(): void {
        this.componentCache.clear()
        this.loadingPromises.clear()
    }

    /**
     * Get cache statistics
     */
    static getCacheStats() {
        return {
            cachedComponents: this.componentCache.size,
            loadingPromises: this.loadingPromises.size,
            cacheKeys: Array.from(this.componentCache.keys())
        }
    }

    /**
     * Internal method to load component
     */
    private static async loadComponentInternal(variant: HeroVariant): Promise<React.ComponentType<HeroProps>> {
        const monitor = new HeroPerformanceMonitor()
        
        return monitor.measureAsyncOperation(`load-component-${variant}`, (async () => {
            try {
                // Use lazy loading utility for better performance
                const LazyComponent = lazyLoadHeroVariant(variant)
                return LazyComponent
            } catch (error) {
                // Fallback to base component if specific variant not found
                console.warn(`Specific component not found for ${variant}, using base component`)
                const { BaseHeroSection } = await import('./base/BaseHeroSection')

                // Create a wrapper that matches the expected interface
                const FallbackComponent = (props: HeroProps) => {
                    const baseProps = {
                        ...props,
                        children: React.createElement('div', {
                            className: 'p-8 text-center'
                        }, `Hero variant "${variant}" not implemented`)
                    }
                    return React.createElement(BaseHeroSection, baseProps)
                }

                return FallbackComponent
            }
        })())
    }

    /**
     * Internal method to load editor
     */
    private static async loadEditorInternal(variant: HeroVariant): Promise<React.ComponentType<HeroEditorProps>> {
        const monitor = new HeroPerformanceMonitor()
        
        return monitor.measureAsyncOperation(`load-editor-${variant}`, (async () => {
            try {
                // Use lazy loading utility for better performance
                const LazyEditor = lazyLoadHeroEditor(variant)
                return LazyEditor
            } catch (error) {
                // Fallback to base editor if specific variant not found
                console.warn(`Specific editor not found for ${variant}, using base editor`)
                const { BaseHeroEditor } = await import('./editors/BaseHeroEditor')
                return BaseHeroEditor as React.ComponentType<HeroEditorProps>
            }
        })())
    }

    /**
     * Internal method to load preview
     */
    private static async loadPreviewInternal(variant: HeroVariant): Promise<React.ComponentType<HeroPreviewProps>> {
        const monitor = new HeroPerformanceMonitor()
        
        return monitor.measureAsyncOperation(`load-preview-${variant}`, (async () => {
            try {
                // Use lazy loading utility for better performance
                const LazyPreview = lazyLoadHeroPreview(variant)
                return LazyPreview
            } catch (error) {
                // Fallback to base preview if specific variant not found
                console.warn(`Specific preview not found for ${variant}, using base preview`)
                const { BaseHeroPreview } = await import('./previews/BaseHeroPreview')

                // Create a wrapper that matches the expected interface
                const FallbackPreview = (props: HeroPreviewProps) => {
                    const baseProps = {
                        ...props,
                        children: React.createElement('div', {
                            className: 'p-8 text-center'
                        }, `Hero preview for variant "${variant}" not implemented`)
                    }
                    return React.createElement(BaseHeroPreview, baseProps)
                }

                return FallbackPreview
            }
        })())
    }

    /**
     * Get component name from variant
     */
    private static getComponentName(variant: HeroVariant): string {
        const baseName = variant
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('')
        return `Hero${baseName}`
    }

    /**
     * Get editor name from variant
     */
    private static getEditorName(variant: HeroVariant): string {
        return `${this.getComponentName(variant)}Editor`
    }

    /**
     * Get preview name from variant
     */
    private static getPreviewName(variant: HeroVariant): string {
        return `${this.getComponentName(variant)}Preview`
    }
}

/**
 * React Hook for using hero section factory
 */
export function useHeroSection(variant: HeroVariant) {
    const [component, setComponent] = React.useState<React.ComponentType<HeroProps> | null>(null)
    const [editor, setEditor] = React.useState<React.ComponentType<HeroEditorProps> | null>(null)
    const [preview, setPreview] = React.useState<React.ComponentType<HeroPreviewProps> | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        let isMounted = true

        const loadComponents = async () => {
            try {
                setLoading(true)
                setError(null)

                const [comp, edit, prev] = await Promise.all([
                    HeroSectionFactory.loadComponent(variant),
                    HeroSectionFactory.loadEditor(variant),
                    HeroSectionFactory.loadPreview(variant)
                ])

                if (isMounted) {
                    setComponent(() => comp)
                    setEditor(() => edit)
                    setPreview(() => prev)
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Failed to load hero components')
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadComponents()

        return () => {
            isMounted = false
        }
    }, [variant])

    return {
        component,
        editor,
        preview,
        loading,
        error,
        config: HeroSectionFactory.getConfig(variant)
    }
}

/**
 * React Hook for preloading hero components
 */
export function useHeroPreloader(variants: HeroVariant[]) {
    const [preloaded, setPreloaded] = React.useState(false)

    React.useEffect(() => {
        HeroSectionFactory.preloadComponents(variants).then(() => {
            setPreloaded(true)
        })
    }, [variants])

    return preloaded
}

export default HeroSectionFactory