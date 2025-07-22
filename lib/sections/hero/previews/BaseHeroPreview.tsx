'use client'

import React from 'react'
import {
    HeroPreviewProps,
    HeroProps,
    ResponsiveConfig,
    AnimationConfig
} from '../types'
import {
    BaseHeroSection,
    HeroBackground,
    HeroContentContainer
} from '../base/BaseHeroSection'
import {
    generateTextClasses,
    generateButtonClasses,
    optimizeImageUrl,
    shouldLazyLoad
} from '../utils'

/**
 * Base Hero Preview Component
 * 
 * Provides common preview functionality for all hero section variants including:
 * - Responsive preview modes
 * - Theme integration
 * - Background handling
 * - Animation support
 * - Performance optimization
 */
interface BaseHeroPreviewProps<T extends HeroProps = HeroProps> {
    children: React.ReactNode
    containerClassName?: string
    contentClassName?: string
    minHeight?: string
    isPreview?: boolean
    previewMode?: 'mobile' | 'tablet' | 'desktop'
    id: string
    variant: T['variant']
    theme: T['theme']
    responsive: T['responsive']
    accessibility: T['accessibility']
    className?: string
    style?: React.CSSProperties
}

export function BaseHeroPreview<T extends HeroProps = HeroProps>({
    children,
    containerClassName = '',
    contentClassName = '',
    minHeight = '400px',
    isPreview = false,
    previewMode = 'desktop',
    ...props
}: BaseHeroPreviewProps<T>) {
    // Apply preview mode styles
    const previewStyles = isPreview ? getPreviewModeStyles(previewMode) : {}

    // Combine container classes
    const combinedContainerClassName = [
        'hero-preview',
        isPreview && 'preview-mode',
        isPreview && `preview-mode--${previewMode}`,
        containerClassName
    ].filter(Boolean).join(' ')

    return (
        <div
            className={`preview-wrapper ${isPreview ? 'border rounded-lg overflow-hidden' : ''}`}
            style={previewStyles}
        >
            <BaseHeroSection
                {...props}
                containerClassName={combinedContainerClassName}
                contentClassName={contentClassName}
                style={{ minHeight, ...props.style }}
            >
                {/* Background */}
                <HeroBackground background={(props as any).background} />

                {/* Content */}
                {children}
            </BaseHeroSection>

            {/* Preview Mode Indicator */}
            {isPreview && (
                <div className="preview-indicator absolute top-2 right-2 z-20">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {previewMode}
                    </span>
                </div>
            )}
        </div>
    )
}

/**
 * Hero Text Component
 * 
 * Renders text content with proper styling and responsive behavior
 */
interface HeroTextProps {
    content: any // TextContent from types
    className?: string
    style?: React.CSSProperties
}

export function HeroText({ content, className = '', style = {} }: HeroTextProps) {
    if (!content || !content.text) return null

    const textClasses = generateTextClasses(content)
    const combinedClasses = [...textClasses, className].filter(Boolean).join(' ')

    const Tag = content.tag || 'p'

    return (
        <Tag
            className={combinedClasses}
            style={{ ...content.style, ...style }}
        >
            {content.text}
        </Tag>
    )
}

/**
 * Hero Button Component
 * 
 * Renders buttons with proper styling and accessibility
 */
interface HeroButtonProps {
    button: any // ButtonConfig from types
    className?: string
    style?: React.CSSProperties
    onClick?: () => void
}

export function HeroButton({ button, className = '', style = {}, onClick }: HeroButtonProps) {
    if (!button || !button.text) return null

    const buttonClasses = generateButtonClasses(button)
    const combinedClasses = [...buttonClasses, className].filter(Boolean).join(' ')

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault()
            onClick()
        }
    }

    return (
        <a
            href={button.url || '#'}
            target={button.target || '_self'}
            rel={button.rel}
            className={combinedClasses}
            style={style}
            onClick={handleClick}
            aria-label={button.ariaLabel || button.text}
        >
            {button.icon && button.iconPosition === 'left' && (
                <span className="mr-2">{button.icon}</span>
            )}
            {button.text}
            {button.icon && button.iconPosition === 'right' && (
                <span className="ml-2">{button.icon}</span>
            )}
        </a>
    )
}

/**
 * Hero Image Component
 * 
 * Renders images with optimization and responsive behavior
 */
interface HeroImageProps {
    media: any // MediaConfig from types
    className?: string
    style?: React.CSSProperties
    sizes?: string
    priority?: boolean
}

export function HeroImage({
    media,
    className = '',
    style = {},
    sizes = '100vw',
    priority = false
}: HeroImageProps) {
    if (!media || !media.url) return null

    const optimizedUrl = optimizeImageUrl(media, undefined, 85)
    const loading = priority ? 'eager' : (media.loading || 'lazy')

    const imageClasses = [
        'hero-image',
        media.objectFit && `object-${media.objectFit}`,
        className
    ].filter(Boolean).join(' ')

    return (
        <img
            src={optimizedUrl}
            alt={media.alt || ''}
            className={imageClasses}
            style={style}
            loading={loading}
            sizes={sizes}
            width={media.width}
            height={media.height}
        />
    )
}

/**
 * Hero Video Component
 * 
 * Renders videos with proper controls and accessibility
 */
interface HeroVideoProps {
    media: any // MediaConfig with video properties
    className?: string
    style?: React.CSSProperties
}

export function HeroVideo({ media, className = '', style = {} }: HeroVideoProps) {
    if (!media || !media.url || media.type !== 'video') return null

    const videoClasses = [
        'hero-video',
        media.objectFit && `object-${media.objectFit}`,
        className
    ].filter(Boolean).join(' ')

    return (
        <video
            className={videoClasses}
            style={style}
            autoPlay={media.autoplay}
            loop={media.loop}
            muted={media.muted}
            controls={media.controls}
            poster={media.poster}
            width={media.width}
            height={media.height}
        >
            <source src={media.url} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    )
}

/**
 * Hero Button Group Component
 * 
 * Renders multiple buttons with proper spacing
 */
interface HeroButtonGroupProps {
    buttons: any[] // ButtonConfig[]
    className?: string
    spacing?: 'sm' | 'md' | 'lg'
    direction?: 'row' | 'column'
}

export function HeroButtonGroup({
    buttons,
    className = '',
    spacing = 'md',
    direction = 'row'
}: HeroButtonGroupProps) {
    if (!buttons || buttons.length === 0) return null

    const spacingClasses = {
        sm: direction === 'row' ? 'space-x-2' : 'space-y-2',
        md: direction === 'row' ? 'space-x-4' : 'space-y-4',
        lg: direction === 'row' ? 'space-x-6' : 'space-y-6'
    }

    const directionClasses = {
        row: 'flex flex-row flex-wrap items-center justify-center',
        column: 'flex flex-col items-center'
    }

    const groupClasses = [
        'hero-button-group',
        directionClasses[direction],
        spacingClasses[spacing],
        className
    ].filter(Boolean).join(' ')

    return (
        <div className={groupClasses}>
            {buttons.map((button, index) => (
                <HeroButton key={index} button={button} />
            ))}
        </div>
    )
}

/**
 * Hero Feature List Component
 * 
 * Renders feature items with icons and descriptions
 */
interface HeroFeatureListProps {
    features: any[] // FeatureItem[]
    className?: string
    layout?: 'grid' | 'list' | 'inline'
    columns?: 1 | 2 | 3 | 4
}

export function HeroFeatureList({
    features,
    className = '',
    layout = 'grid',
    columns = 3
}: HeroFeatureListProps) {
    if (!features || features.length === 0) return null

    const layoutClasses = {
        grid: `grid grid-cols-1 md:grid-cols-${columns} gap-6`,
        list: 'space-y-4',
        inline: 'flex flex-wrap gap-4'
    }

    const listClasses = [
        'hero-feature-list',
        layoutClasses[layout],
        className
    ].filter(Boolean).join(' ')

    return (
        <div className={listClasses}>
            {features.map((feature, index) => (
                <div key={feature.id || index} className="hero-feature-item">
                    {feature.icon && (
                        <div className="feature-icon text-2xl mb-2">
                            {feature.icon}
                        </div>
                    )}
                    {feature.title && (
                        <h3 className="feature-title font-semibold mb-2">
                            {feature.title}
                        </h3>
                    )}
                    {feature.description && (
                        <p className="feature-description text-gray-600">
                            {feature.description}
                        </p>
                    )}
                </div>
            ))}
        </div>
    )
}

/**
 * Get preview mode styles for responsive testing
 */
function getPreviewModeStyles(previewMode: 'mobile' | 'tablet' | 'desktop') {
    switch (previewMode) {
        case 'mobile':
            return {
                maxWidth: '375px',
                margin: '0 auto'
            }
        case 'tablet':
            return {
                maxWidth: '768px',
                margin: '0 auto'
            }
        case 'desktop':
        default:
            return {
                width: '100%'
            }
    }
}

export default BaseHeroPreview