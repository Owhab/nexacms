// Hero sections main exports
export * from './types'
export * from './utils'
export * from './registry'
export * from './performance'

// Base components (always loaded)
export * from './base/BaseHeroSection'
export * from './editors/BaseHeroEditor'
export * from './previews/BaseHeroPreview'

// Factory for dynamic component loading with performance optimization
export { HeroSectionFactory, useHeroSection, useHeroPreloader } from './factory'

// Lazy-loaded components (use factory for dynamic loading)
// Components are now loaded on-demand for better performance

// Performance-optimized components
export * from './components/LazyImage'
export * from './components/LazyVideo'

// For backward compatibility, provide lazy-loaded exports
export const HeroCentered = () => import('./variants/HeroCentered').then(m => m.HeroCentered)
export const HeroSplitScreen = () => import('./variants/HeroSplitScreen').then(m => m.HeroSplitScreen)
export const HeroVideo = () => import('./variants/HeroVideo').then(m => m.HeroVideo)
export const HeroMinimal = () => import('./variants/HeroMinimal').then(m => m.HeroMinimal)
export const HeroFeature = () => import('./variants/HeroFeature').then(m => m.HeroFeature)
export const HeroTestimonial = () => import('./variants/HeroTestimonial').then(m => m.HeroTestimonial)
export const HeroProduct = () => import('./variants/HeroProduct').then(m => m.HeroProduct)
export const HeroService = () => import('./variants/HeroService').then(m => m.HeroService)
export const HeroCTA = () => import('./variants/HeroCTA').then(m => m.HeroCTA)
export const HeroGallery = () => import('./variants/HeroGallery').then(m => m.HeroGallery)