'use client'

import React from 'react'
import {
    BaseHeroProps,
    ThemeConfig,
    ResponsiveConfig,
    AnimationConfig,
    AccessibilityConfig
} from '../types'
import {
    generateCSSVariables,
    generateBackgroundStyles,
    generateBackgroundClasses,
    getResponsiveClasses,
    generateAnimationClasses,
    generateAccessibilityProps,
    generateAriaLabel
} from '../utils'

interface BaseHeroSectionProps extends BaseHeroProps {
    children: React.ReactNode
    containerClassName?: string
    contentClassName?: string
    style?: React.CSSProperties
}

/**
 * Base Hero Section Component
 * 
 * Provides common functionality for all hero section variants including:
 * - Theme integration with CSS variables
 * - Responsive design handling
 * - Background configuration
 * - Animation support
 * - Accessibility features
 */
export function BaseHeroSection({
    id,
    variant,
    theme,
    responsive,
    animation,
    accessibility,
    children,
    containerClassName = '',
    contentClassName = '',
    className = '',
    style = {},
    ...props
}: BaseHeroSectionProps) {
    // Generate CSS variables for theme integration
    const cssVariables = generateCSSVariables(theme)

    // Generate responsive classes
    const responsiveClasses = getResponsiveClasses(responsive, 'padding')

    // Generate animation classes
    const animationClasses = generateAnimationClasses(animation)

    // Generate accessibility props
    const accessibilityProps = generateAccessibilityProps(accessibility)

    // Generate ARIA label
    const ariaLabel = generateAriaLabel(variant, accessibilityProps['aria-label'])

    // Combine all CSS classes
    const containerClasses = [
        'hero-section',
        `hero-section--${variant}`,
        'relative',
        'overflow-hidden',
        responsiveClasses,
        ...animationClasses,
        containerClassName,
        className
    ].filter(Boolean).join(' ')

    const contentClasses = [
        'hero-content',
        'relative',
        'z-10',
        'w-full',
        'h-full',
        contentClassName
    ].filter(Boolean).join(' ')

    // Combine styles
    const combinedStyles = {
        ...cssVariables,
        ...style
    }

    return (
        <section
            id={id}
            className={containerClasses}
            style={combinedStyles}
            aria-label={ariaLabel}
            {...accessibilityProps}
            {...props}
        >
            <div className={contentClasses}>
                {children}
            </div>
        </section>
    )
}

/**
 * Hero Background Component
 * 
 * Handles different background types (color, gradient, image, video)
 * with overlay support
 */
interface HeroBackgroundProps {
    background: any // BackgroundConfig from types
    className?: string
}

export function HeroBackground({ background, className = '' }: HeroBackgroundProps) {
    if (!background || background.type === 'none') {
        return null
    }

    const backgroundStyles = generateBackgroundStyles(background)
    const backgroundClasses = generateBackgroundClasses(background)

    const classes = [
        'hero-background',
        'absolute',
        'inset-0',
        'z-0',
        ...backgroundClasses,
        className
    ].filter(Boolean).join(' ')

    return (
        <>
            {/* Background Layer */}
            <div
                className={classes}
                style={backgroundStyles}
                aria-hidden="true"
            />

            {/* Video Background */}
            {background.type === 'video' && background.video && (
                <video
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    autoPlay={background.video.autoplay}
                    loop={background.video.loop}
                    muted={background.video.muted}
                    controls={background.video.controls}
                    poster={background.video.poster}
                    aria-hidden="true"
                >
                    <source src={background.video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}

            {/* Overlay */}
            {background.overlay?.enabled && (
                <div
                    className="absolute inset-0 z-5"
                    style={{
                        backgroundColor: background.overlay.color,
                        opacity: background.overlay.opacity
                    }}
                    aria-hidden="true"
                />
            )}
        </>
    )
}

/**
 * Hero Content Container
 * 
 * Provides consistent content layout and spacing
 */
interface HeroContentContainerProps {
    children: React.ReactNode
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full'
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    textAlign?: 'left' | 'center' | 'right'
    className?: string
}

export function HeroContentContainer({
    children,
    maxWidth = '4xl',
    padding = 'lg',
    textAlign = 'center',
    className = ''
}: HeroContentContainerProps) {
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '4xl': 'max-w-4xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        full: 'max-w-full'
    }

    const paddingClasses = {
        none: '',
        sm: 'px-4 py-8',
        md: 'px-6 py-12',
        lg: 'px-8 py-16',
        xl: 'px-12 py-20'
    }

    const textAlignClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }

    const classes = [
        'hero-content-container',
        'mx-auto',
        'relative',
        'z-10',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        textAlignClasses[textAlign],
        className
    ].filter(Boolean).join(' ')

    return (
        <div className={classes}>
            {children}
        </div>
    )
}

export default BaseHeroSection