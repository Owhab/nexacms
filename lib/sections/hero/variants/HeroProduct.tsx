'use client'

import React from 'react'
import {
    HeroProductProps,
    HeroVariant,
    ProductItem
} from '../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../utils'
import {
    BaseHeroSection,
    HeroBackground,
    HeroContentContainer
} from '../base/BaseHeroSection'
import {
    HeroText,
    HeroButton,
    HeroButtonGroup,
    HeroImage
} from '../previews/BaseHeroPreview'

/**
 * Hero Product Component
 * 
 * Product showcase hero section with gallery functionality and e-commerce features.
 * Displays product information, pricing, image gallery, and feature highlighting.
 */
export function HeroProduct({
    id = 'hero-product',
    variant = HeroVariant.PRODUCT,
    theme = getDefaultThemeConfig(),
    responsive = getDefaultResponsiveConfig(),
    accessibility = getDefaultAccessibilityConfig(),
    product,
    layout = 'left',
    showGallery = true,
    showFeatures = true,
    showPricing = true,
    background,
    primaryButton,
    secondaryButton,
    className = '',
    style = {},
    ...props
}: HeroProductProps) {
    // Prepare buttons array
    const buttons = [primaryButton, secondaryButton].filter(Boolean)

    // Get layout classes based on layout type
    const getLayoutClasses = () => {
        switch (layout) {
            case 'left':
                return 'lg:grid-cols-2 lg:gap-12'
            case 'right':
                return 'lg:grid-cols-2 lg:gap-12'
            case 'center':
                return 'lg:grid-cols-1 text-center'
            default:
                return 'lg:grid-cols-2 lg:gap-12'
        }
    }

    const layoutClasses = getLayoutClasses()
    const isReversed = layout === 'right'

    return (
        <BaseHeroSection
            id={id}
            variant={variant}
            theme={theme}
            responsive={responsive}
            accessibility={accessibility}
            className={className}
            style={style}
            {...props}
        >
            {/* Background */}
            <HeroBackground background={background} />

            {/* Content Container */}
            <HeroContentContainer
                maxWidth="7xl"
                padding="lg"
                textAlign={layout === 'center' ? 'center' : 'left'}
                className="flex flex-col justify-center min-h-[600px]"
            >
                <div className={`grid grid-cols-1 ${layoutClasses} items-center`}>
                    {/* Product Content */}
                    <div className={`space-y-6 ${isReversed ? 'lg:order-2' : ''}`}>
                        {/* Product Badge */}
                        {product?.badge && (
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                                {product.badge}
                            </div>
                        )}

                        {/* Product Name */}
                        {product?.name && (
                            <h1 className="hero-title text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                                {product.name}
                            </h1>
                        )}

                        {/* Product Description */}
                        {product?.description && (
                            <p className="hero-description text-lg text-muted-foreground leading-relaxed max-w-2xl">
                                {product.description}
                            </p>
                        )}

                        {/* Pricing */}
                        {showPricing && (product?.price || product?.originalPrice) && (
                            <div className="flex items-center space-x-4">
                                {product.price && (
                                    <span className="text-3xl font-bold text-foreground">
                                        {product.currency || '$'}{product.price}
                                    </span>
                                )}
                                {product.originalPrice && product.originalPrice !== product.price && (
                                    <span className="text-xl text-muted-foreground line-through">
                                        {product.currency || '$'}{product.originalPrice}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Product Features */}
                        {showFeatures && product?.features && product.features.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-foreground">Key Features:</h3>
                                <ul className="space-y-2">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <span className="text-primary mt-1">✓</span>
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {buttons.length > 0 && (
                            <div className="hero-buttons pt-4">
                                <HeroButtonGroup
                                    buttons={buttons}
                                    spacing="md"
                                    direction="row"
                                    className={layout === 'center' ? 'justify-center' : 'justify-start'}
                                />
                            </div>
                        )}
                    </div>

                    {/* Product Gallery */}
                    {layout !== 'center' && showGallery && product?.images && product.images.length > 0 && (
                        <div className={`${isReversed ? 'lg:order-1' : ''}`}>
                            <ProductGallery
                                images={product.images}
                                productName={product.name}
                            />
                        </div>
                    )}
                </div>

                {/* Centered Gallery (for center layout) */}
                {layout === 'center' && showGallery && product?.images && product.images.length > 0 && (
                    <div className="mt-12">
                        <ProductGallery
                            images={product.images}
                            productName={product.name}
                            centered
                        />
                    </div>
                )}
            </HeroContentContainer>
        </BaseHeroSection>
    )
}

/**
 * Product Gallery Component
 * 
 * Image gallery with main image and thumbnails
 */
interface ProductGalleryProps {
    images: any[] // MediaConfig[]
    productName?: string
    centered?: boolean
}

function ProductGallery({ images, productName, centered = false }: ProductGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)
    const selectedImage = images[selectedImageIndex]

    if (!images || images.length === 0) return null

    return (
        <div className={`product-gallery space-y-4 ${centered ? 'max-w-2xl mx-auto' : ''}`}>
            {/* Main Image */}
            <div className="main-image-container relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                {selectedImage && (
                    <HeroImage
                        media={selectedImage}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        priority={selectedImageIndex === 0}
                    />
                )}
                
                {/* Navigation Arrows (if multiple images) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => setSelectedImageIndex(prev => 
                                prev === 0 ? images.length - 1 : prev - 1
                            )}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                            aria-label="Previous image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setSelectedImageIndex(prev => 
                                prev === images.length - 1 ? 0 : prev + 1
                            )}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                            aria-label="Next image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                        {selectedImageIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
                <div className="thumbnail-gallery">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {images.map((image, index) => (
                            <button
                                key={image.id || index}
                                onClick={() => setSelectedImageIndex(index)}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                    index === selectedImageIndex
                                        ? 'border-primary shadow-md'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                aria-label={`View image ${index + 1}`}
                            >
                                <HeroImage
                                    media={image}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default HeroProduct