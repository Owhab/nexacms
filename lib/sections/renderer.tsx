import React from 'react'
import { getSectionConfig } from './registry'
import { HeroSectionFactory } from './hero/factory'
import { HeroVariant } from './hero/types'
import Image from 'next/image'

// Dynamic imports for section components
const sectionComponents = {
    // Hero Section (Legacy)
    HeroSectionPreview: React.lazy(() => import('./HeroSection').then(m => ({ default: m.HeroSectionPreview }))),
    HeroSectionEditor: React.lazy(() => import('./HeroSection').then(m => ({ default: m.HeroSectionEditor }))),

    // Text Block
    TextBlockPreview: React.lazy(() => import('./TextBlockSection').then(m => ({ default: m.TextBlockSectionPreview }))),
    TextBlockEditor: React.lazy(() => import('./TextBlockSection').then(m => ({ default: m.TextBlockSectionEditor }))),

    // Image Text
    ImageTextPreview: React.lazy(() => import('./ImageTextSection').then(m => ({ default: m.ImageTextSectionPreview }))),
    ImageTextEditor: React.lazy(() => import('./ImageTextSection').then(m => ({ default: m.ImageTextSectionEditor }))),
}

// Dynamic hero component loader
function createHeroComponent(variant: HeroVariant, mode: 'preview' | 'editor' | 'component') {
    return React.lazy(async () => {
        try {
            let component
            switch (mode) {
                case 'preview':
                    component = await HeroSectionFactory.loadPreview(variant)
                    break
                case 'editor':
                    component = await HeroSectionFactory.loadEditor(variant)
                    break
                case 'component':
                    component = await HeroSectionFactory.loadComponent(variant)
                    break
                default:
                    throw new Error(`Unknown mode: ${mode}`)
            }
            
            if (!component) {
                throw new Error(`Failed to load hero ${mode} for variant: ${variant}`)
            }
            
            return { default: component }
        } catch (error) {
            console.error(`Error loading hero ${mode} for variant ${variant}:`, error)
            // Return fallback component
            return {
                default: ({ props, onSave, onCancel }: any) => (
                    <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-yellow-900 mb-2">Component Loading Error</h4>
                        <p className="text-sm text-yellow-700 mb-4">
                            Failed to load hero {mode} for variant &quot;{variant}&quot;. This might be a temporary issue.
                        </p>
                        {onCancel && (
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300 transition-colors"
                            >
                                Close
                            </button>
                        )}
                    </div>
                )
            }
        }
    })
}

// Check if section is a hero variant
function isHeroVariant(sectionId: string): boolean {
    return sectionId.startsWith('hero-') && sectionId !== 'hero-section'
}

// Get hero variant from section ID
function getHeroVariant(sectionId: string): HeroVariant | null {
    if (!isHeroVariant(sectionId)) return null
    
    const variant = sectionId.replace('hero-', '') as HeroVariant
    return Object.values(HeroVariant).includes(variant) ? variant : null
}

// Validate hero variant exists in registry
function validateHeroVariant(variant: HeroVariant): boolean {
    const config = getSectionConfig(`hero-${variant}`)
    return config !== undefined && config.isActive
}

interface SectionRendererProps {
    sectionId: string
    props: any
    mode: 'preview' | 'editor' | 'storefront'
    onSave?: (props: any) => void
    onCancel?: () => void
}

export function SectionRenderer({ sectionId, props, mode, onSave, onCancel }: SectionRendererProps) {
    const config = getSectionConfig(sectionId)

    if (!config) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Unknown Section</h4>
                <p className="text-sm text-red-700">Section &quot;{sectionId}&quot; not found in registry.</p>
            </div>
        )
    }

    // Handle hero variants dynamically
    if (isHeroVariant(sectionId)) {
        const variant = getHeroVariant(sectionId)
        if (variant && validateHeroVariant(variant)) {
            const HeroComponent = createHeroComponent(variant, mode === 'storefront' ? 'component' : mode)
            
            return (
                <React.Suspense fallback={
                    <div className="p-6 bg-gray-50 rounded-lg animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="text-xs text-gray-400 mt-2">Loading {config.name}...</div>
                    </div>
                }>
                    {mode === 'editor' ? (
                        <HeroComponent
                            props={props}
                            onSave={onSave || (() => { })}
                            onCancel={onCancel || (() => { })}
                        />
                    ) : (
                        <HeroComponent
                            {...props}
                            variant={variant}
                        />
                    )}
                </React.Suspense>
            )
        } else {
            // Invalid or inactive hero variant
            return (
                <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Hero Variant Unavailable</h4>
                    <p className="text-sm text-orange-700">
                        Hero variant &quot;{variant || 'unknown'}&quot; is not available or has been disabled.
                    </p>
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="mt-3 px-4 py-2 bg-orange-200 text-orange-800 rounded hover:bg-orange-300 transition-colors"
                        >
                            Close
                        </button>
                    )}
                </div>
            )
        }
    }

    // Handle legacy sections
    const getComponentName = () => {
        switch (mode) {
            case 'preview':
                return config.previewComponent || `${config.componentName}Preview`
            case 'editor':
                return config.editorComponent || `${config.componentName}Editor`
            case 'storefront':
                return config.componentName
            default:
                return config.componentName
        }
    }

    const componentName = getComponentName()
    const Component = sectionComponents[componentName as keyof typeof sectionComponents]

    if (!Component) {
        // Fallback for unimplemented sections
        return (
            <div className="p-6 bg-gray-100 rounded-lg text-center">
                <div className="text-2xl mb-2">{config.icon}</div>
                <h4 className="font-medium text-gray-900 mb-2">{config.name}</h4>
                <p className="text-sm text-gray-500 mb-4">{config.description}</p>
                {mode === 'preview' && (
                    <div className="text-xs text-gray-400">
                        Component: {componentName} (Not implemented)
                    </div>
                )}
                {mode === 'editor' && (
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">Editor not available yet</p>
                        {onCancel && (
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                            >
                                Close
                            </button>
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <React.Suspense fallback={
            <div className="p-6 bg-gray-50 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
        }>
            {mode === 'editor' ? (
                <Component
                    props={props}
                    onSave={onSave || (() => { })}
                    onCancel={onCancel || (() => { })}
                />
            ) : (
                <Component
                    props={props}
                    onSave={() => { }}
                    onCancel={() => { }}
                />
            )}
        </React.Suspense>
    )
}

// Storefront section renderer for public pages
export function StorefrontSectionRenderer({ section }: { section: any }) {
    const config = getSectionConfig(section.sectionTemplate.id)
    const props = typeof section.props === 'string' ? JSON.parse(section.props) : section.props

    if (!config) {
        return null // Don't render unknown sections on storefront
    }

    // Handle hero variants for storefront
    if (isHeroVariant(section.sectionTemplate.id)) {
        const variant = getHeroVariant(section.sectionTemplate.id)
        if (variant && validateHeroVariant(variant)) {
            const HeroComponent = createHeroComponent(variant, 'component')
            
            return (
                <React.Suspense fallback={
                    <section className="py-8 bg-gray-100 animate-pulse">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </div>
                    </section>
                }>
                    <HeroComponent
                        {...props}
                        variant={variant}
                    />
                </React.Suspense>
            )
        } else {
            // Don't render invalid/inactive hero variants on storefront
            return null
        }
    }

    // For storefront, we render the actual components directly for better performance
    switch (config.componentName) {
        case 'HeroSection':
            return <HeroSectionStorefront props={props} />
        case 'TextBlock':
            return <TextBlockStorefront props={props} />
        case 'ImageText':
            return <ImageTextStorefront props={props} />
        default:
            return (
                <section className="py-8 bg-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="text-2xl mb-2">{config.icon}</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{config.name}</h3>
                        <p className="text-sm text-gray-500">{config.description}</p>
                    </div>
                </section>
            )
    }
}

// Storefront components (optimized for public rendering)
function HeroSectionStorefront({ props }: { props: any }) {
    const backgroundStyle = props.backgroundImage
        ? { backgroundImage: `url(${props.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {}

    return (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20" style={backgroundStyle}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`text-${props.textAlign || 'center'}`}>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        {props.title || 'Welcome'}
                    </h1>
                    {props.subtitle && (
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            {props.subtitle}
                        </p>
                    )}
                    {props.buttonText && (
                        <a
                            href={props.buttonLink || '#'}
                            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            {props.buttonText}
                        </a>
                    )}
                </div>
            </div>
        </section>
    )
}

function TextBlockStorefront({ props }: { props: any }) {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`text-${props.textAlign || 'left'} prose max-w-none`}
                    style={{ maxWidth: props.maxWidth || '800px', margin: props.textAlign === 'center' ? '0 auto' : '0' }}
                    dangerouslySetInnerHTML={{ __html: props.content || '<p>Add your content here...</p>' }}
                />
            </div>
        </section>
    )
}

function ImageTextStorefront({ props }: { props: any }) {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${props.layout === 'right' ? 'md:grid-flow-col-dense' : ''}`}>
                    <div className={props.layout === 'right' ? 'md:col-start-2' : ''}>
                        {props.image ? (
                            <Image
                                src={props.image}
                                alt={props.imageAlt || ''}
                                className="w-full h-auto rounded-lg shadow-lg"
                                height="250"
                                width="350"

                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500">Image placeholder</span>
                            </div>
                        )}
                    </div>
                    <div className={props.layout === 'right' ? 'md:col-start-1' : ''}>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            {props.title || 'Your Title Here'}
                        </h2>
                        <div
                            className="text-gray-600 prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: props.content || '<p>Your content here...</p>' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}