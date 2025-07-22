// Hero sections main exports
export * from './types'
export * from './utils'
export * from './registry'

// Base components
export * from './base/BaseHeroSection'
export * from './editors/BaseHeroEditor'
export * from './previews/BaseHeroPreview'

// Factory for dynamic component loading
export { HeroSectionFactory } from './factory'

// Hero Centered variant
export { HeroCentered } from './variants/HeroCentered'
export { HeroCenteredEditor } from './editors/HeroCenteredEditor'
export { HeroCenteredPreview } from './previews/HeroCenteredPreview'

// Re-export other variants when they're implemented
// export * from './variants'
// export * from './editors'
// export * from './previews'