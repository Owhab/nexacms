'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { MediaPicker } from '@/components/ui/MediaPicker'
import {
    HeroEditorProps,
    HeroProps,
    HeroPreviewProps,
    HeroVariant,
    EditorField as EditorFieldType,
    EditorSection,
    FieldType,
    ValidationRule
} from '../types'
import { heroSectionValidator } from '../validation'
import { HeroSectionErrorBoundary } from '../components/ErrorBoundary'
import { duplicateHeroSection } from '../duplication'
import { migrateHeroSection, validateMigrationCompatibility, MIGRATION_STRATEGIES } from '../migration'
import { HERO_SECTION_REGISTRY } from '../registry'
import { ResponsivePreviewController } from '../components/ResponsivePreviewController'

/**
 * Base Hero Editor Component
 * 
 * Provides common editor functionality for all hero section variants including:
 * - Form field rendering based on schema
 * - Validation handling
 * - Real-time preview updates
 * - Common UI elements
 */
interface BaseHeroEditorProps<T extends HeroProps = HeroProps> extends HeroEditorProps<T> {
    schema: {
        sections: EditorSection[]
        validation?: ValidationRule[]
    }
    children?: React.ReactNode
    previewComponent?: React.ComponentType<HeroPreviewProps<T>>
}

export function BaseHeroEditor<T extends HeroProps = HeroProps>({
    props,
    onSave,
    onCancel,
    onChange,
    isLoading = false,
    errors = {},
    schema,
    children,
    previewComponent: PreviewComponent
}: BaseHeroEditorProps<T>) {
    const [formData, setFormData] = useState<T>(props)
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>(errors)
    const [activeSection, setActiveSection] = useState<string>(schema.sections[0]?.id || '')
    const [showVariantSwitcher, setShowVariantSwitcher] = useState(false)
    const [showDuplicationOptions, setShowDuplicationOptions] = useState(false)
    const [migrationWarnings, setMigrationWarnings] = useState<string[]>([])

    // Get available hero variants for switching
    const availableVariants = useMemo(() => {
        return Object.values(HERO_SECTION_REGISTRY).filter(
            config => config.variant !== formData.variant && config.isActive
        )
    }, [formData.variant])

    // Handle field value changes
    const handleFieldChange = useCallback((fieldId: string, value: any) => {
        const newFormData = { ...formData }

        // Handle nested field paths (e.g., 'content.title.text')
        const fieldPath = fieldId.split('.')
        let current: any = newFormData

        for (let i = 0; i < fieldPath.length - 1; i++) {
            if (!current[fieldPath[i]]) {
                current[fieldPath[i]] = {}
            }
            current = current[fieldPath[i]]
        }

        current[fieldPath[fieldPath.length - 1]] = value

        setFormData(newFormData)
        onChange?.(newFormData)

        // Clear validation error for this field
        if (validationErrors[fieldId]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[fieldId]
                return newErrors
            })
        }
    }, [formData, onChange, validationErrors])

    // Get field value from nested object
    const getFieldValue = useCallback((fieldId: string) => {
        const fieldPath = fieldId.split('.')
        let current: any = formData

        for (const path of fieldPath) {
            if (current && typeof current === 'object') {
                current = current[path]
            } else {
                return undefined
            }
        }

        return current
    }, [formData])

    // Validate form data using comprehensive validation system
    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {}

        // Validate individual fields
        schema.sections.forEach(section => {
            section.fields.forEach(field => {
                const value = getFieldValue(field.id)
                const fieldErrors = heroSectionValidator.validateField(field, value, formData)

                if (fieldErrors.length > 0) {
                    newErrors[field.id] = fieldErrors[0].message
                }
            })
        })

        // Validate complete hero section
        const heroValidation = heroSectionValidator.validateHeroSection(formData)
        if (!heroValidation.isValid) {
            heroValidation.errors.forEach(error => {
                if (!newErrors[error.field]) {
                    newErrors[error.field] = error.message
                }
            })
        }

        setValidationErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [schema, getFieldValue, formData])

    // Handle save
    const handleSave = useCallback(() => {
        if (validateForm()) {
            onSave(formData)
        }
    }, [formData, onSave, validateForm])

    // Handle duplication
    const handleDuplicate = useCallback((options: {
        preserveMedia?: boolean
        preserveButtons?: boolean
        namePrefix?: string
    } = {}) => {
        const duplicatedProps = duplicateHeroSection(formData, {
            preserveMedia: options.preserveMedia ?? true,
            preserveButtons: options.preserveButtons ?? true,
            namePrefix: options.namePrefix ?? 'Copy of '
        })

        // Save the duplicated section
        onSave(duplicatedProps)
        setShowDuplicationOptions(false)
    }, [formData, onSave])

    // Handle variant switching
    const handleVariantSwitch = useCallback((targetVariant: HeroVariant, strategy: string = 'balanced') => {
        try {
            const migrationStrategy = MIGRATION_STRATEGIES[strategy] || MIGRATION_STRATEGIES.balanced
            const migrationResult = migrateHeroSection(formData, targetVariant, migrationStrategy)

            if (migrationResult.success) {
                setFormData(migrationResult.migratedProps as T)
                setMigrationWarnings(migrationResult.warnings)
                onChange?.(migrationResult.migratedProps as T)

                // Show migration report if there were warnings or data loss
                if (migrationResult.warnings.length > 0 || migrationResult.lostData.length > 0) {
                    console.log('Migration Report:', {
                        warnings: migrationResult.warnings,
                        lostData: migrationResult.lostData,
                        addedDefaults: migrationResult.addedDefaults
                    })
                }
            } else {
                console.error('Migration failed:', migrationResult.errors)
                setMigrationWarnings([`Migration failed: ${migrationResult.errors.join(', ')}`])
            }
        } catch (error) {
            console.error('Variant switch error:', error)
            setMigrationWarnings([`Failed to switch variant: ${error instanceof Error ? error.message : 'Unknown error'}`])
        }

        setShowVariantSwitcher(false)
    }, [formData, onChange])

    // Get variant compatibility info
    const getVariantCompatibility = useCallback((targetVariant: HeroVariant) => {
        return validateMigrationCompatibility(formData.variant, targetVariant)
    }, [formData.variant])

    // Render field based on type
    const renderField = useCallback((field: EditorFieldType) => {
        const value = getFieldValue(field.id)
        const error = validationErrors[field.id]

        return (
            <EditorFieldComponent
                key={field.id}
                field={field}
                value={value}
                onChange={(newValue) => handleFieldChange(field.id, newValue)}
                error={error}
            />
        )
    }, [getFieldValue, validationErrors, handleFieldChange])

    return (
        <HeroSectionErrorBoundary
            variant={formData.variant}
            showDetails={process.env.NODE_ENV === 'development'}
            enableRetry={true}
        >
            <div className="hero-editor grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Editor Panel */}
                <div className="editor-panel space-y-6 overflow-y-auto">
                    {/* Hero Section Toolbar */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">
                                {HERO_SECTION_REGISTRY[`hero-${formData.variant}`]?.name || formData.variant}
                            </span>
                            <span className="text-xs text-gray-500">
                                {HERO_SECTION_REGISTRY[`hero-${formData.variant}`]?.icon}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDuplicationOptions(true)}
                                className="text-xs"
                            >
                                📋 Duplicate
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowVariantSwitcher(true)}
                                className="text-xs"
                            >
                                🔄 Switch Variant
                            </Button>
                        </div>
                    </div>

                    {/* Migration Warnings */}
                    {migrationWarnings.length > 0 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <span className="text-yellow-400">⚠️</span>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        Migration Warnings
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <ul className="list-disc list-inside space-y-1">
                                            {migrationWarnings.map((warning, index) => (
                                                <li key={index}>{warning}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        onClick={() => setMigrationWarnings([])}
                                        className="mt-2 text-xs text-yellow-600 hover:text-yellow-800 underline"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section Tabs */}
                    {schema.sections.length > 1 && (
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                            {schema.sections.map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeSection === section.id
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {section.icon && <span className="mr-2">{section.icon}</span>}
                                    {section.title}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Active Section Fields */}
                    {schema.sections
                        .filter(section => section.id === activeSection)
                        .map(section => (
                            <div key={section.id} className="space-y-4">
                                {section.description && (
                                    <p className="text-sm text-gray-600">{section.description}</p>
                                )}

                                <div className="space-y-4">
                                    {section.fields.map(renderField)}
                                </div>
                            </div>
                        ))}

                    {/* Custom Children */}
                    {children}

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                {/* Advanced Preview Panel */}
                <div className="preview-panel">
                    <div className="sticky top-0">
                        {PreviewComponent ? (
                            <ResponsivePreviewController
                                heroProps={formData}
                                previewComponent={PreviewComponent}
                                onChange={(updates) => {
                                    const newFormData = { ...formData, ...updates }
                                    setFormData(newFormData)
                                    onChange?.(newFormData)
                                }}
                                showControls={true}
                                enableRealTimeUpdates={true}
                                className="border rounded-lg overflow-hidden"
                            />
                        ) : (
                            <div className="border rounded-lg bg-white">
                                <div className="bg-gray-50 p-3 border-b">
                                    <h3 className="text-sm font-medium text-gray-900">Preview</h3>
                                </div>
                                <div className="p-8 text-center text-gray-500">
                                    Preview not available
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Duplication Options Modal */}
            {showDuplicationOptions && (
                <DuplicationOptionsModal
                    onDuplicate={handleDuplicate}
                    onCancel={() => setShowDuplicationOptions(false)}
                />
            )}

            {/* Variant Switcher Modal */}
            {showVariantSwitcher && (
                <VariantSwitcherModal
                    currentVariant={formData.variant}
                    availableVariants={availableVariants}
                    onSwitch={handleVariantSwitch}
                    onCancel={() => setShowVariantSwitcher(false)}
                    getCompatibility={getVariantCompatibility}
                />
            )}
        </HeroSectionErrorBoundary>
    )
}

/**
 * Individual Editor Field Component
 */
interface EditorFieldComponentProps {
    field: EditorFieldType
    value: any
    onChange: (value: any) => void
    error?: string
}

function EditorFieldComponent({ field, value, onChange, error }: EditorFieldComponentProps) {
    const renderFieldInput = () => {
        switch (field.type) {
            case FieldType.TEXT:
                return (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300' : 'border-gray-300'
                            }`}
                    />
                )

            case FieldType.TEXTAREA:
                return (
                    <textarea
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300' : 'border-gray-300'
                            }`}
                    />
                )

            case FieldType.SELECT:
                return (
                    <select
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300' : 'border-gray-300'
                            }`}
                    >
                        {field.options?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )

            case FieldType.BOOLEAN:
                return (
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={value || false}
                            onChange={(e) => onChange(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{field.label}</span>
                    </label>
                )

            case FieldType.NUMBER:
                return (
                    <input
                        type="number"
                        value={value || ''}
                        onChange={(e) => onChange(Number(e.target.value))}
                        placeholder={field.placeholder}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300' : 'border-gray-300'
                            }`}
                    />
                )

            case FieldType.COLOR:
                return (
                    <div className="flex space-x-2">
                        <input
                            type="color"
                            value={value || '#000000'}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-12 h-10 border rounded cursor-pointer"
                        />
                        <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="#000000"
                            className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300' : 'border-gray-300'
                                }`}
                        />
                    </div>
                )

            case FieldType.IMAGE:
                return (
                    <MediaPicker
                        value={value ? {
                            id: value.id || 'media',
                            url: value.url || value,
                            type: 'IMAGE' as const,
                            fileName: value.fileName || 'image',
                            fileSize: value.fileSize || 0,
                            mimeType: value.mimeType || 'image/*'
                        } : undefined}
                        onChange={(media) => {
                            if (media && !Array.isArray(media)) {
                                onChange({
                                    id: media.id,
                                    url: media.url,
                                    type: 'image',
                                    alt: value?.alt || '',
                                    objectFit: value?.objectFit || 'cover',
                                    loading: value?.loading || 'lazy'
                                })
                            } else {
                                onChange(null)
                            }
                        }}
                        accept="image/*"
                        type="IMAGE"
                        placeholder={field.placeholder || "Select image"}
                    />
                )

            case FieldType.VIDEO:
                return (
                    <MediaPicker
                        value={value ? {
                            id: value.id || 'video',
                            url: value.url || value,
                            type: 'VIDEO' as const,
                            fileName: value.fileName || 'video',
                            fileSize: value.fileSize || 0,
                            mimeType: value.mimeType || 'video/*'
                        } : undefined}
                        onChange={(media) => {
                            if (media && !Array.isArray(media)) {
                                onChange({
                                    id: media.id,
                                    url: media.url,
                                    type: 'video',
                                    autoplay: value?.autoplay ?? true,
                                    loop: value?.loop ?? true,
                                    muted: value?.muted ?? true,
                                    controls: value?.controls ?? false,
                                    poster: value?.poster || '',
                                    objectFit: value?.objectFit || 'cover',
                                    loading: value?.loading || 'eager'
                                })
                            } else {
                                onChange(null)
                            }
                        }}
                        accept="video/*"
                        type="VIDEO"
                        placeholder={field.placeholder || "Select video"}
                        maxSize={50 * 1024 * 1024} // 50MB limit for videos
                    />
                )

            case FieldType.URL:
                return (
                    <input
                        type="url"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300' : 'border-gray-300'
                            }`}
                    />
                )

            case FieldType.SLIDER:
                return (
                    <div className="space-y-2">
                        <input
                            type="range"
                            value={value || field.min || 0}
                            onChange={(e) => onChange(Number(e.target.value))}
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            className="w-full"
                        />
                        <div className="text-sm text-gray-600 text-center">
                            {value || field.min || 0}
                        </div>
                    </div>
                )

            default:
                return (
                    <div className="p-3 bg-gray-100 rounded text-sm text-gray-600">
                        Field type &quot;{field.type}&quot; not implemented
                    </div>
                )
        }
    }

    return (
        <div className="space-y-2">
            {field.type !== FieldType.BOOLEAN && (
                <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {renderFieldInput()}

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            {field.helpText && !error && (
                <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
        </div>
    )
}

/**
 * Validate individual field
 */
function validateField(field: EditorFieldType, value: any): string[] {
    const errors: string[] = []

    if (!field.validation) return errors

    for (const rule of field.validation) {
        switch (rule.type) {
            case 'required':
                if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
                    errors.push(rule.message)
                }
                break

            case 'minLength':
                if (value && typeof value === 'string' && value.length < rule.value) {
                    errors.push(rule.message)
                }
                break

            case 'maxLength':
                if (value && typeof value === 'string' && value.length > rule.value) {
                    errors.push(rule.message)
                }
                break

            case 'pattern':
                if (value && typeof value === 'string' && !new RegExp(rule.value).test(value)) {
                    errors.push(rule.message)
                }
                break
        }
    }

    return errors
}

/**
 * Duplication Options Modal
 */
interface DuplicationOptionsModalProps {
    onDuplicate: (options: {
        preserveMedia?: boolean
        preserveButtons?: boolean
        namePrefix?: string
    }) => void
    onCancel: () => void
}

function DuplicationOptionsModal({ onDuplicate, onCancel }: DuplicationOptionsModalProps) {
    const [preserveMedia, setPreserveMedia] = useState(true)
    const [preserveButtons, setPreserveButtons] = useState(true)
    const [namePrefix, setNamePrefix] = useState('Copy of ')

    const handleDuplicate = () => {
        onDuplicate({
            preserveMedia,
            preserveButtons,
            namePrefix
        })
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Duplicate Hero Section
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name Prefix
                        </label>
                        <input
                            type="text"
                            value={namePrefix}
                            onChange={(e) => setNamePrefix(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Copy of "
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={preserveMedia}
                                onChange={(e) => setPreserveMedia(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                                Preserve media references
                            </span>
                        </label>
                        <p className="text-xs text-gray-500 ml-6">
                            Keep the same images and videos in the duplicated section
                        </p>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={preserveButtons}
                                onChange={(e) => setPreserveButtons(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                                Preserve button URLs
                            </span>
                        </label>
                        <p className="text-xs text-gray-500 ml-6">
                            Keep the same button links (uncheck to reset to #)
                        </p>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDuplicate}
                    >
                        Duplicate Section
                    </Button>
                </div>
            </div>
        </div>
    )
}

/**
 * Variant Switcher Modal
 */
interface VariantSwitcherModalProps {
    currentVariant: HeroVariant
    availableVariants: Array<{
        id: string
        variant: HeroVariant
        name: string
        description: string
        icon: string
    }>
    onSwitch: (targetVariant: HeroVariant, strategy: string) => void
    onCancel: () => void
    getCompatibility: (targetVariant: HeroVariant) => {
        isSupported: boolean
        compatibility: 'high' | 'medium' | 'low'
        warnings: string[]
        dataLossRisk: 'none' | 'low' | 'medium' | 'high'
        recommendations: string[]
    }
}

function VariantSwitcherModal({
    currentVariant,
    availableVariants,
    onSwitch,
    onCancel,
    getCompatibility
}: VariantSwitcherModalProps) {
    const [selectedVariant, setSelectedVariant] = useState<HeroVariant | null>(null)
    const [selectedStrategy, setSelectedStrategy] = useState('balanced')
    const [showCompatibilityInfo, setShowCompatibilityInfo] = useState(false)

    const compatibility = selectedVariant ? getCompatibility(selectedVariant) : null

    const handleSwitch = () => {
        if (selectedVariant) {
            onSwitch(selectedVariant, selectedStrategy)
        }
    }

    const getCompatibilityColor = (level: 'high' | 'medium' | 'low') => {
        switch (level) {
            case 'high': return 'text-green-600'
            case 'medium': return 'text-yellow-600'
            case 'low': return 'text-red-600'
            default: return 'text-gray-600'
        }
    }

    const getDataLossColor = (risk: 'none' | 'low' | 'medium' | 'high') => {
        switch (risk) {
            case 'none': return 'text-green-600'
            case 'low': return 'text-yellow-600'
            case 'medium': return 'text-orange-600'
            case 'high': return 'text-red-600'
            default: return 'text-gray-600'
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Switch Hero Variant
                </h3>

                <div className="space-y-6">
                    {/* Current Variant Info */}
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                            <strong>Current:</strong> {HERO_SECTION_REGISTRY[`hero-${currentVariant}`]?.name || currentVariant}
                        </p>
                    </div>

                    {/* Migration Strategy */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Migration Strategy
                        </label>
                        <select
                            value={selectedStrategy}
                            onChange={(e) => setSelectedStrategy(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Object.entries(MIGRATION_STRATEGIES).map(([key, strategy]) => (
                                <option key={key} value={key}>
                                    {strategy.name} - {strategy.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Available Variants */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select Target Variant
                        </label>
                        <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                            {availableVariants.map((variant) => {
                                const variantCompatibility = getCompatibility(variant.variant)
                                const isSelected = selectedVariant === variant.variant

                                return (
                                    <div
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant.variant)}
                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${isSelected
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg">{variant.icon}</span>
                                                    <h4 className="font-medium text-gray-900">
                                                        {variant.name}
                                                    </h4>
                                                    {variantCompatibility.isSupported && (
                                                        <span className={`text-xs px-2 py-1 rounded-full ${variantCompatibility.compatibility === 'high'
                                                            ? 'bg-green-100 text-green-800'
                                                            : variantCompatibility.compatibility === 'medium'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {variantCompatibility.compatibility} compatibility
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {variant.description}
                                                </p>
                                                {!variantCompatibility.isSupported && (
                                                    <p className="text-xs text-red-600 mt-1">
                                                        ⚠️ Limited migration support
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Compatibility Information */}
                    {selectedVariant && compatibility && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-gray-900">Migration Compatibility</h4>
                                <button
                                    onClick={() => setShowCompatibilityInfo(!showCompatibilityInfo)}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    {showCompatibilityInfo ? 'Hide Details' : 'Show Details'}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Compatibility:</span>
                                    <span className={`ml-2 font-medium ${getCompatibilityColor(compatibility.compatibility)}`}>
                                        {compatibility.compatibility.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Data Loss Risk:</span>
                                    <span className={`ml-2 font-medium ${getDataLossColor(compatibility.dataLossRisk)}`}>
                                        {compatibility.dataLossRisk.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {showCompatibilityInfo && (
                                <div className="mt-4 space-y-3">
                                    {compatibility.warnings.length > 0 && (
                                        <div>
                                            <h5 className="text-sm font-medium text-yellow-800 mb-1">Warnings:</h5>
                                            <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                                                {compatibility.warnings.map((warning, index) => (
                                                    <li key={index}>{warning}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {compatibility.recommendations.length > 0 && (
                                        <div>
                                            <h5 className="text-sm font-medium text-blue-800 mb-1">Recommendations:</h5>
                                            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                                                {compatibility.recommendations.map((rec, index) => (
                                                    <li key={index}>{rec}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSwitch}
                        disabled={!selectedVariant}
                    >
                        Switch Variant
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default BaseHeroEditor