'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { MediaPicker } from '@/components/ui/MediaPicker'
import {
    HeroEditorProps,
    HeroProps,
    EditorField as EditorFieldType,
    EditorSection,
    FieldType,
    ValidationRule,
    BackgroundConfig,
    ButtonConfig,
    MediaConfig
} from '../types'

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
    previewComponent?: React.ComponentType<{ props: T }>
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

    // Validate form data
    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {}

        schema.sections.forEach(section => {
            section.fields.forEach(field => {
                const value = getFieldValue(field.id)
                const fieldErrors = validateField(field, value)

                if (fieldErrors.length > 0) {
                    newErrors[field.id] = fieldErrors[0]
                }
            })
        })

        setValidationErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [schema, getFieldValue])

    // Handle save
    const handleSave = useCallback(() => {
        if (validateForm()) {
            onSave(formData)
        }
    }, [formData, onSave, validateForm])

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
        <div className="hero-editor grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Editor Panel */}
            <div className="editor-panel space-y-6 overflow-y-auto">
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

            {/* Preview Panel */}
            <div className="preview-panel">
                <div className="sticky top-0">
                    <div className="bg-gray-50 p-3 rounded-t-lg border-b">
                        <h3 className="text-sm font-medium text-gray-900">Preview</h3>
                    </div>
                    <div className="border rounded-b-lg overflow-hidden bg-white">
                        {PreviewComponent ? (
                            <PreviewComponent props={formData} />
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                Preview not available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
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

export default BaseHeroEditor