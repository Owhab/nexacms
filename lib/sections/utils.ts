import { SECTION_REGISTRY, SectionConfig } from './registry'

// Utility functions for section management
export function validateSectionConfig(config: SectionConfig): string[] {
    const errors: string[] = []

    if (!config.id) errors.push('Section ID is required')
    if (!config.name) errors.push('Section name is required')
    if (!config.componentName) errors.push('Component name is required')
    if (!config.category) errors.push('Category is required')
    if (!config.description) errors.push('Description is required')
    if (!config.defaultProps) errors.push('Default props are required')
    if (!Array.isArray(config.tags)) errors.push('Tags must be an array')

    return errors
}

export function registerSection(config: SectionConfig): boolean {
    const errors = validateSectionConfig(config)

    if (errors.length > 0) {
        console.error('Section registration failed:', errors)
        return false
    }

    if (SECTION_REGISTRY[config.id]) {
        console.warn(`Section ${config.id} already exists, overwriting...`)
    }

    SECTION_REGISTRY[config.id] = config
    return true
}

export function unregisterSection(sectionId: string): boolean {
    if (!SECTION_REGISTRY[sectionId]) {
        console.warn(`Section ${sectionId} not found`)
        return false
    }

    delete SECTION_REGISTRY[sectionId]
    return true
}

export function updateSectionConfig(sectionId: string, updates: Partial<SectionConfig>): boolean {
    if (!SECTION_REGISTRY[sectionId]) {
        console.warn(`Section ${sectionId} not found`)
        return false
    }

    SECTION_REGISTRY[sectionId] = {
        ...SECTION_REGISTRY[sectionId],
        ...updates
    }

    return true
}

export function getSectionStats() {
    const sections = Object.values(SECTION_REGISTRY)
    const categories = new Set(sections.map(s => s.category))
    const activeSections = sections.filter(s => s.isActive)

    return {
        total: sections.length,
        active: activeSections.length,
        inactive: sections.length - activeSections.length,
        categories: categories.size,
        categoryBreakdown: Array.from(categories).map(category => ({
            category,
            count: sections.filter(s => s.category === category).length,
            active: sections.filter(s => s.category === category && s.isActive).length
        }))
    }
}

// Helper to create section template data for database seeding
export function createSectionTemplateData() {
    return Object.values(SECTION_REGISTRY)
        .filter(section => section.isActive)
        .map(section => ({
            id: section.id,
            name: section.name,
            componentName: section.componentName,
            defaultProps: JSON.stringify(section.defaultProps),
            description: section.description
        }))
}

// Development helper to log section registry info
export function logSectionRegistry() {
    const stats = getSectionStats()
    console.group('🎨 Section Registry Stats')
    console.log(`Total Sections: ${stats.total}`)
    console.log(`Active Sections: ${stats.active}`)
    console.log(`Inactive Sections: ${stats.inactive}`)
    console.log(`Categories: ${stats.categories}`)
    console.table(stats.categoryBreakdown)
    console.groupEnd()
}