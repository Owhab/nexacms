'use client'

import React from 'react'
import { HeroVideo } from './variants/HeroVideo'
import { HeroVideoEditor } from './editors/HeroVideoEditor'
import { HeroVideoPreview } from './previews/HeroVideoPreview'
import { HeroVariant, HeroVideoProps } from './types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from './utils'

/**
 * Integration Test Component for Hero Video
 * 
 * This component demonstrates the Hero Video variant working with its editor and preview.
 * It can be used for testing and development purposes.
 */
export function HeroVideoIntegrationTest() {
    const [heroProps, setHeroProps] = React.useState<HeroVideoProps>({
        id: 'test-hero-video',
        variant: HeroVariant.VIDEO,
        theme: getDefaultThemeConfig(),
        responsive: getDefaultResponsiveConfig(),
        accessibility: getDefaultAccessibilityConfig(),
        video: {
            id: 'test-video',
            url: '/assets/hero/hero-video.mp4',
            type: 'video',
            autoplay: true,
            loop: true,
            muted: true,
            controls: false,
            poster: '/assets/hero/video-poster.jpg',
            objectFit: 'cover',
            loading: 'eager'
        },
        overlay: {
            enabled: true,
            color: '#000000',
            opacity: 0.4
        },
        content: {
            title: {
                text: 'Experience Innovation',
                tag: 'h1'
            },
            subtitle: {
                text: 'See Our Product in Action',
                tag: 'h2'
            },
            description: {
                text: 'Watch how our solution transforms businesses worldwide.',
                tag: 'p'
            },
            buttons: [
                {
                    text: 'Watch Demo',
                    url: '#demo',
                    style: 'primary',
                    size: 'lg',
                    icon: '▶️',
                    iconPosition: 'left',
                    target: '_self'
                },
                {
                    text: 'Learn More',
                    url: '#learn',
                    style: 'outline',
                    size: 'lg',
                    iconPosition: 'right',
                    target: '_self'
                }
            ],
            position: 'center'
        }
    })

    const [showEditor, setShowEditor] = React.useState(false)
    const [showPreview, setShowPreview] = React.useState(false)

    const handleSave = (newProps: HeroVideoProps) => {
        setHeroProps(newProps)
        setShowEditor(false)
        console.log('Hero Video props saved:', newProps)
    }

    const handleCancel = () => {
        setShowEditor(false)
    }

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">Hero Video Integration Test</h1>
                <p className="text-gray-600">
                    Test the Hero Video component, editor, and preview functionality
                </p>
                
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setShowEditor(!showEditor)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {showEditor ? 'Hide Editor' : 'Show Editor'}
                    </button>
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                </div>
            </div>

            {/* Hero Video Component */}
            <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b">
                    <h2 className="font-semibold">Hero Video Component</h2>
                </div>
                <HeroVideo {...heroProps} />
            </div>

            {/* Editor */}
            {showEditor && (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 border-b">
                        <h2 className="font-semibold">Hero Video Editor</h2>
                    </div>
                    <div className="p-4">
                        <HeroVideoEditor
                            props={heroProps}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            onChange={(partialProps) => {
                                setHeroProps(prev => ({ ...prev, ...partialProps }))
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Preview */}
            {showPreview && (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 border-b">
                        <h2 className="font-semibold">Hero Video Preview</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <h3 className="font-medium mb-2">Desktop Preview</h3>
                            <HeroVideoPreview
                                {...heroProps}
                                isPreview={true}
                                previewMode="desktop"
                            />
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Tablet Preview</h3>
                            <HeroVideoPreview
                                {...heroProps}
                                isPreview={true}
                                previewMode="tablet"
                            />
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Mobile Preview</h3>
                            <HeroVideoPreview
                                {...heroProps}
                                isPreview={true}
                                previewMode="mobile"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Props Display */}
            <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b">
                    <h2 className="font-semibold">Current Props</h2>
                </div>
                <div className="p-4">
                    <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
                        {JSON.stringify(heroProps, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    )
}

export default HeroVideoIntegrationTest