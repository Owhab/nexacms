import React from 'react'
import { getSectionConfig } from './registry'

// Dynamic imports for section components
const sectionComponents = {
    // Previews
    HeroSectionPreview: React.lazy(() => import('@/components/admin/section-previews/HeroSectionPreview').then(m => ({ default: m.HeroSectionPreview }))),
    TextBlockPreview: React.lazy(() => import('@/components/admin/section-previews/TextBlockPreview').then(m => ({ default: m.TextBlockPreview }))),
    ImageTextPreview: React.lazy(() => import('@/components/admin/section-previews/ImageTextPreview').then(m => ({ default: m.ImageTextPreview }))),

    // Editors
    HeroSectionEditor: React.lazy(() => import('@/components/admin/section-editors/HeroSectionEditor').then(m => ({ default: m.HeroSectionEditor }))),
    TextBlockEditor: React.lazy(() => import('@/components/admin/section-editors/TextBlockEditor').then(m => ({ default: m.TextBlockEditor }))),
    ImageTextEditor: React.lazy(() => import('@/components/admin/section-editors/ImageTextEditor').then(m => ({ default: m.ImageTextEditor }))),
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
                <p className="text-sm text-red-700">Section "{sectionId}" not found in registry.</p>
            </div>
        )
    }

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

    const componentProps = {
        props,
        ...(mode === 'editor' && { onSave, onCancel })
    }

    return (
        <React.Suspense fallback={
            <div className="p-6 bg-gray-50 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
        }>
            <Component {...componentProps} />
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
                            <img
                                src={props.image}
                                alt={props.imageAlt || ''}
                                className="w-full h-auto rounded-lg shadow-lg"
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