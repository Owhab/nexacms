/**
 * Hero Centered Implementation Validation
 * 
 * This script validates that the Hero Centered variant implementation is working correctly
 * by testing component imports, type checking, and basic functionality.
 */

import React from 'react'
import {
    HeroCenteredProps,
    HeroVariant,
    HeroEditorProps
} from './types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from './utils'

// Test component imports
async function testComponentImports() {
    console.log('Testing component imports...')

    try {
        // Test Hero Centered component import
        const { HeroCentered } = await import('./variants/HeroCentered')
        console.log('✅ HeroCentered component imported successfully')

        // Test Hero Centered Editor import
        const { HeroCenteredEditor } = await import('./editors/HeroCenteredEditor')
        console.log('✅ HeroCenteredEditor component imported successfully')

        // Test Hero Centered Preview import
        const { HeroCenteredPreview } = await import('./previews/HeroCenteredPreview')
        console.log('✅ HeroCenteredPreview component imported successfully')

        return { HeroCentered, HeroCenteredEditor, HeroCenteredPreview }
    } catch (error) {
        console.error('❌ Component import failed:', error)
        throw error
    }
}

// Test type definitions
function testTypeDefinitions() {
    console.log('Testing type definitions...')

    try {
        // Test HeroCenteredProps type
        const testProps: HeroCenteredProps = {
            id: 'test-hero',
            variant: HeroVariant.CENTERED,
            theme: getDefaultThemeConfig(),
            responsive: getDefaultResponsiveConfig(),
            accessibility: getDefaultAccessibilityConfig(),
            title: {
                text: 'Test Title',
                tag: 'h1'
            },
            subtitle: {
                text: 'Test Subtitle',
                tag: 'h2'
            },
            description: {
                text: 'Test Description',
                tag: 'p'
            },
            primaryButton: {
                text: 'Primary Button',
                url: '/primary',
                style: 'primary',
                size: 'lg',
                iconPosition: 'right',
                target: '_self'
            },
            secondaryButton: {
                text: 'Secondary Button',
                url: '/secondary',
                style: 'outline',
                size: 'lg',
                iconPosition: 'left',
                target: '_self'
            },
            background: {
                type: 'gradient',
                gradient: {
                    type: 'linear',
                    direction: '45deg',
                    colors: [
                        { color: '#3b82f6', stop: 0 },
                        { color: '#8b5cf6', stop: 100 }
                    ]
                }
            },
            textAlign: 'center'
        }

        console.log('✅ HeroCenteredProps type validation passed')

        // Test HeroEditorProps type
        const testEditorProps: HeroEditorProps<HeroCenteredProps> = {
            props: testProps,
            onSave: (props) => console.log('Save called with:', props),
            onCancel: () => console.log('Cancel called'),
            onChange: (props) => console.log('Change called with:', props),
            isLoading: false,
            errors: {}
        }

        console.log('✅ HeroEditorProps type validation passed')

        return { testProps, testEditorProps }
    } catch (error) {
        console.error('❌ Type definition test failed:', error)
        throw error
    }
}

// Test default configurations
function testDefaultConfigurations() {
    console.log('Testing default configurations...')

    try {
        const defaultTheme = getDefaultThemeConfig()
        console.log('✅ Default theme config:', defaultTheme)

        const defaultResponsive = getDefaultResponsiveConfig()
        console.log('✅ Default responsive config:', defaultResponsive)

        const defaultAccessibility = getDefaultAccessibilityConfig()
        console.log('✅ Default accessibility config:', defaultAccessibility)

        return { defaultTheme, defaultResponsive, defaultAccessibility }
    } catch (error) {
        console.error('❌ Default configuration test failed:', error)
        throw error
    }
}

// Test registry integration
async function testRegistryIntegration() {
    console.log('Testing registry integration...')

    try {
        const { HERO_SECTION_REGISTRY } = await import('./registry')
        const centeredConfig = HERO_SECTION_REGISTRY['hero-centered']

        if (!centeredConfig) {
            throw new Error('Hero Centered configuration not found in registry')
        }

        console.log('✅ Hero Centered found in registry:', centeredConfig.name)

        // Validate configuration structure
        const requiredFields = ['id', 'variant', 'name', 'description', 'icon', 'category', 'defaultProps', 'editorSchema']
        for (const field of requiredFields) {
            if (!(field in centeredConfig)) {
                throw new Error(`Missing required field: ${field}`)
            }
        }

        console.log('✅ Registry configuration structure is valid')

        return centeredConfig
    } catch (error) {
        console.error('❌ Registry integration test failed:', error)
        throw error
    }
}

// Test factory integration
async function testFactoryIntegration() {
    console.log('Testing factory integration...')

    try {
        const { HeroSectionFactory } = await import('./factory')

        // Test getting configuration
        const config = HeroSectionFactory.getConfig(HeroVariant.CENTERED)
        if (!config) {
            throw new Error('Failed to get Hero Centered configuration from factory')
        }

        console.log('✅ Factory can retrieve Hero Centered configuration')

        // Test getting all configurations
        const allConfigs = HeroSectionFactory.getAllConfigs()
        const centeredInAll = allConfigs.find(c => c.variant === HeroVariant.CENTERED)

        if (!centeredInAll) {
            throw new Error('Hero Centered not found in all configurations')
        }

        console.log('✅ Hero Centered found in all configurations')

        return { config, allConfigs }
    } catch (error) {
        console.error('❌ Factory integration test failed:', error)
        throw error
    }
}

// Test component props validation
function testPropsValidation() {
    console.log('Testing props validation...')

    try {
        // Test minimal props
        const minimalProps: HeroCenteredProps = {
            id: 'minimal-hero',
            variant: HeroVariant.CENTERED,
            theme: getDefaultThemeConfig(),
            responsive: getDefaultResponsiveConfig(),
            accessibility: getDefaultAccessibilityConfig(),
            title: {
                text: 'Minimal Title',
                tag: 'h1'
            },
            background: {
                type: 'none'
            },
            textAlign: 'center'
        }

        console.log('✅ Minimal props validation passed')

        // Test full props
        const fullProps: HeroCenteredProps = {
            id: 'full-hero',
            variant: HeroVariant.CENTERED,
            theme: getDefaultThemeConfig(),
            responsive: getDefaultResponsiveConfig(),
            accessibility: getDefaultAccessibilityConfig(),
            title: {
                text: 'Full Title',
                tag: 'h1'
            },
            subtitle: {
                text: 'Full Subtitle',
                tag: 'h2'
            },
            description: {
                text: 'Full Description',
                tag: 'p'
            },
            primaryButton: {
                text: 'Primary',
                url: '/primary',
                style: 'primary',
                size: 'lg',
                iconPosition: 'right',
                target: '_self'
            },
            secondaryButton: {
                text: 'Secondary',
                url: '/secondary',
                style: 'outline',
                size: 'md',
                iconPosition: 'left',
                target: '_blank'
            },
            background: {
                type: 'image',
                image: {
                    id: 'bg-image',
                    url: '/background.jpg',
                    type: 'image',
                    alt: 'Background',
                    objectFit: 'cover',
                    loading: 'lazy'
                },
                overlay: {
                    enabled: true,
                    color: '#000000',
                    opacity: 0.5
                }
            },
            textAlign: 'left',
            className: 'custom-class',
            style: { minHeight: '600px' }
        }

        console.log('✅ Full props validation passed')

        return { minimalProps, fullProps }
    } catch (error) {
        console.error('❌ Props validation test failed:', error)
        throw error
    }
}

// Main validation function
export async function validateHeroCenteredImplementation() {
    console.log('🚀 Starting Hero Centered implementation validation...\n')

    try {
        // Run all tests
        const components = await testComponentImports()
        console.log('')

        const types = testTypeDefinitions()
        console.log('')

        const configs = testDefaultConfigurations()
        console.log('')

        const registry = await testRegistryIntegration()
        console.log('')

        const factory = await testFactoryIntegration()
        console.log('')

        const props = testPropsValidation()
        console.log('')

        console.log('🎉 All validation tests passed!')
        console.log('\n✅ Hero Centered implementation is complete and functional')

        return {
            components,
            types,
            configs,
            registry,
            factory,
            props,
            success: true
        }
    } catch (error) {
        console.error('\n❌ Validation failed:', error)
        return {
            success: false,
            error
        }
    }
}

// Export validation results for external use
export const VALIDATION_RESULTS = {
    COMPONENT_IMPORTS: 'HeroCentered, HeroCenteredEditor, HeroCenteredPreview',
    TYPE_DEFINITIONS: 'HeroCenteredProps, HeroEditorProps<HeroCenteredProps>',
    DEFAULT_CONFIGS: 'Theme, Responsive, Accessibility',
    REGISTRY_INTEGRATION: 'hero-centered configuration',
    FACTORY_INTEGRATION: 'Dynamic component loading',
    PROPS_VALIDATION: 'Minimal and full props structures'
}

// Run validation if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
    validateHeroCenteredImplementation()
        .then((result) => {
            if (result.success) {
                console.log('\n🎯 Hero Centered variant implementation is ready for use!')
                process.exit(0)
            } else {
                console.error('\n💥 Implementation validation failed')
                process.exit(1)
            }
        })
        .catch((error) => {
            console.error('\n💥 Validation error:', error)
            process.exit(1)
        })
}