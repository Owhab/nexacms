// Hero Section Validation System

import {
    ValidationRule,
    EditorField,
    MediaConfig,
    ButtonConfig,
    BackgroundConfig,
    HeroProps,
    FieldType
} from './types'

/**
 * Validation error interface
 */
export interface ValidationError {
    field: string
    message: string
    type: 'error' | 'warning'
    code?: string
}

/**
 * Validation result interface
 */
export interface ValidationResult {
    isValid: boolean
    errors: ValidationError[]
    warnings: ValidationError[]
}

/**
 * Field validation context
 */
export interface ValidationContext {
    fieldId: string
    value: any
    allValues: Record<string, any>
    field: EditorField
}

/**
 * Custom validation function type
 */
export type CustomValidator = (context: ValidationContext) => ValidationError[]

/**
 * Main validation class for hero sections
 */
export class HeroSectionValidator {
    private customValidators: Map<string, CustomValidator> = new Map()

    /**
     * Register a custom validator for a specific field type or field ID
     */
    registerValidator(key: string, validator: CustomValidator): void {
        this.customValidators.set(key, validator)
    }

    /**
     * Validate a complete hero section configuration
     */
    validateHeroSection(props: HeroProps): ValidationResult {
        const errors: ValidationError[] = []
        const warnings: ValidationError[] = []

        // Validate required base properties
        if (!props.id) {
            errors.push({
                field: 'id',
                message: 'Hero section ID is required',
                type: 'error',
                code: 'REQUIRED_FIELD'
            })
        }

        if (!props.variant) {
            errors.push({
                field: 'variant',
                message: 'Hero section variant is required',
                type: 'error',
                code: 'REQUIRED_FIELD'
            })
        }

        // Validate accessibility configuration
        const accessibilityErrors = this.validateAccessibility(props.accessibility)
        errors.push(...accessibilityErrors)

        // Validate theme configuration
        const themeErrors = this.validateTheme(props.theme)
        errors.push(...themeErrors)

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        }
    }

    /**
     * Validate a single field based on its configuration and rules
     */
    validateField(field: EditorField, value: any, allValues: Record<string, any> = {}): ValidationError[] {
        const errors: ValidationError[] = []
        const context: ValidationContext = {
            fieldId: field.id,
            value,
            allValues,
            field
        }

        // Run built-in validation rules
        if (field.validation) {
            for (const rule of field.validation) {
                const ruleErrors = this.validateRule(rule, value, field)
                errors.push(...ruleErrors)
            }
        }

        // Run field type specific validation
        const typeErrors = this.validateFieldType(field.type, value, field)
        errors.push(...typeErrors)

        // Run custom validators
        const customValidator = this.customValidators.get(field.id) || this.customValidators.get(field.type)
        if (customValidator) {
            const customErrors = customValidator(context)
            errors.push(...customErrors)
        }

        return errors
    }

    /**
     * Validate a single validation rule
     */
    private validateRule(rule: ValidationRule, value: any, field: EditorField): ValidationError[] {
        const errors: ValidationError[] = []

        switch (rule.type) {
            case 'required':
                if (this.isEmpty(value)) {
                    errors.push({
                        field: field.id,
                        message: rule.message,
                        type: 'error',
                        code: 'REQUIRED_FIELD'
                    })
                }
                break

            case 'minLength':
                if (value && typeof value === 'string' && value.length < rule.value) {
                    errors.push({
                        field: field.id,
                        message: rule.message,
                        type: 'error',
                        code: 'MIN_LENGTH'
                    })
                }
                break

            case 'maxLength':
                if (value && typeof value === 'string' && value.length > rule.value) {
                    errors.push({
                        field: field.id,
                        message: rule.message,
                        type: 'error',
                        code: 'MAX_LENGTH'
                    })
                }
                break

            case 'pattern':
                if (value && typeof value === 'string') {
                    const regex = new RegExp(rule.value)
                    if (!regex.test(value)) {
                        errors.push({
                            field: field.id,
                            message: rule.message,
                            type: 'error',
                            code: 'PATTERN_MISMATCH'
                        })
                    }
                }
                break

            case 'custom':
                // Custom validation will be handled by registered validators
                break
        }

        return errors
    }

    /**
     * Validate field based on its type
     */
    private validateFieldType(type: FieldType, value: any, field: EditorField): ValidationError[] {
        const errors: ValidationError[] = []

        switch (type) {
            case FieldType.URL:
                if (value && !this.isValidUrl(value)) {
                    errors.push({
                        field: field.id,
                        message: 'Please enter a valid URL',
                        type: 'error',
                        code: 'INVALID_URL'
                    })
                }
                break

            case FieldType.COLOR:
                if (value && !this.isValidColor(value)) {
                    errors.push({
                        field: field.id,
                        message: 'Please enter a valid color (hex, rgb, or named color)',
                        type: 'error',
                        code: 'INVALID_COLOR'
                    })
                }
                break

            case FieldType.NUMBER:
                if (value !== undefined && value !== null && value !== '') {
                    const numValue = Number(value)
                    if (isNaN(numValue)) {
                        errors.push({
                            field: field.id,
                            message: 'Please enter a valid number',
                            type: 'error',
                            code: 'INVALID_NUMBER'
                        })
                    } else {
                        if (field.min !== undefined && numValue < field.min) {
                            errors.push({
                                field: field.id,
                                message: `Value must be at least ${field.min}`,
                                type: 'error',
                                code: 'MIN_VALUE'
                            })
                        }
                        if (field.max !== undefined && numValue > field.max) {
                            errors.push({
                                field: field.id,
                                message: `Value must be at most ${field.max}`,
                                type: 'error',
                                code: 'MAX_VALUE'
                            })
                        }
                    }
                }
                break

            case FieldType.IMAGE:
            case FieldType.VIDEO:
                if (value) {
                    const mediaErrors = this.validateMediaConfig(value as MediaConfig)
                    errors.push(...mediaErrors.map(error => ({
                        ...error,
                        field: field.id
                    })))
                }
                break
        }

        return errors
    }

    /**
     * Validate media configuration
     */
    validateMediaConfig(media: MediaConfig): ValidationError[] {
        const errors: ValidationError[] = []

        if (!media.url) {
            errors.push({
                field: 'url',
                message: 'Media URL is required',
                type: 'error',
                code: 'REQUIRED_FIELD'
            })
        } else if (!this.isValidUrl(media.url)) {
            errors.push({
                field: 'url',
                message: 'Please enter a valid media URL',
                type: 'error',
                code: 'INVALID_URL'
            })
        }

        if (media.type === 'image' && !media.alt) {
            errors.push({
                field: 'alt',
                message: 'Alt text is required for images (accessibility)',
                type: 'error',
                code: 'ACCESSIBILITY_VIOLATION'
            })
        }

        if (media.type === 'video') {
            const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi']
            const hasValidExtension = videoExtensions.some(ext => 
                media.url.toLowerCase().includes(ext)
            )
            
            if (!hasValidExtension) {
                errors.push({
                    field: 'url',
                    message: 'Video must be in a supported format (MP4, WebM, OGG, MOV, AVI)',
                    type: 'error',
                    code: 'INVALID_FORMAT'
                })
            }
        }

        return errors
    }

    /**
     * Validate button configuration
     */
    validateButtonConfig(button: ButtonConfig): ValidationError[] {
        const errors: ValidationError[] = []

        if (!button.text || button.text.trim() === '') {
            errors.push({
                field: 'text',
                message: 'Button text is required',
                type: 'error',
                code: 'REQUIRED_FIELD'
            })
        }

        if (!button.url || button.url.trim() === '') {
            errors.push({
                field: 'url',
                message: 'Button URL is required',
                type: 'error',
                code: 'REQUIRED_FIELD'
            })
        } else if (!this.isValidUrl(button.url)) {
            errors.push({
                field: 'url',
                message: 'Please enter a valid URL',
                type: 'error',
                code: 'INVALID_URL'
            })
        }

        // Accessibility check for button text length
        if (button.text && button.text.length > 30) {
            errors.push({
                field: 'text',
                message: 'Button text should be concise (under 30 characters) for better accessibility',
                type: 'warning',
                code: 'ACCESSIBILITY_WARNING'
            })
        }

        return errors
    }

    /**
     * Validate background configuration
     */
    validateBackgroundConfig(background: BackgroundConfig): ValidationError[] {
        const errors: ValidationError[] = []

        switch (background.type) {
            case 'color':
                if (!background.color) {
                    errors.push({
                        field: 'color',
                        message: 'Background color is required when type is color',
                        type: 'error',
                        code: 'REQUIRED_FIELD'
                    })
                } else if (!this.isValidColor(background.color)) {
                    errors.push({
                        field: 'color',
                        message: 'Please enter a valid color',
                        type: 'error',
                        code: 'INVALID_COLOR'
                    })
                }
                break

            case 'gradient':
                if (!background.gradient) {
                    errors.push({
                        field: 'gradient',
                        message: 'Gradient configuration is required when type is gradient',
                        type: 'error',
                        code: 'REQUIRED_FIELD'
                    })
                } else {
                    if (!background.gradient.colors || background.gradient.colors.length < 2) {
                        errors.push({
                            field: 'gradient.colors',
                            message: 'At least 2 colors are required for a gradient',
                            type: 'error',
                            code: 'INSUFFICIENT_DATA'
                        })
                    }
                }
                break

            case 'image':
                if (!background.image) {
                    errors.push({
                        field: 'image',
                        message: 'Background image is required when type is image',
                        type: 'error',
                        code: 'REQUIRED_FIELD'
                    })
                } else {
                    const imageErrors = this.validateMediaConfig(background.image)
                    errors.push(...imageErrors.map(error => ({
                        ...error,
                        field: `image.${error.field}`
                    })))
                }
                break

            case 'video':
                if (!background.video) {
                    errors.push({
                        field: 'video',
                        message: 'Background video is required when type is video',
                        type: 'error',
                        code: 'REQUIRED_FIELD'
                    })
                } else {
                    const videoErrors = this.validateMediaConfig(background.video)
                    errors.push(...videoErrors.map(error => ({
                        ...error,
                        field: `video.${error.field}`
                    })))
                }
                break
        }

        return errors
    }

    /**
     * Validate accessibility configuration
     */
    private validateAccessibility(accessibility: any): ValidationError[] {
        const errors: ValidationError[] = []

        if (!accessibility) {
            errors.push({
                field: 'accessibility',
                message: 'Accessibility configuration is required',
                type: 'error',
                code: 'REQUIRED_FIELD'
            })
            return errors
        }

        if (!accessibility.ariaLabels || Object.keys(accessibility.ariaLabels).length === 0) {
            errors.push({
                field: 'accessibility.ariaLabels',
                message: 'ARIA labels should be provided for better accessibility',
                type: 'warning',
                code: 'ACCESSIBILITY_WARNING'
            })
        }

        return errors
    }

    /**
     * Validate theme configuration
     */
    private validateTheme(theme: any): ValidationError[] {
        const errors: ValidationError[] = []

        if (!theme) {
            errors.push({
                field: 'theme',
                message: 'Theme configuration is required',
                type: 'error',
                code: 'REQUIRED_FIELD'
            })
            return errors
        }

        const requiredColors = ['primaryColor', 'secondaryColor', 'backgroundColor', 'textColor']
        for (const colorKey of requiredColors) {
            if (!theme[colorKey]) {
                errors.push({
                    field: `theme.${colorKey}`,
                    message: `${colorKey} is required in theme configuration`,
                    type: 'error',
                    code: 'REQUIRED_FIELD'
                })
            } else if (!this.isValidColor(theme[colorKey])) {
                errors.push({
                    field: `theme.${colorKey}`,
                    message: `${colorKey} must be a valid color`,
                    type: 'error',
                    code: 'INVALID_COLOR'
                })
            }
        }

        return errors
    }

    /**
     * Check if a value is empty
     */
    private isEmpty(value: any): boolean {
        if (value === null || value === undefined) return true
        if (typeof value === 'string') return value.trim() === ''
        if (Array.isArray(value)) return value.length === 0
        if (typeof value === 'object') return Object.keys(value).length === 0
        return false
    }

    /**
     * Validate URL format
     */
    private isValidUrl(url: string): boolean {
        try {
            // Allow relative URLs starting with / or #
            if (url.startsWith('/') || url.startsWith('#')) {
                return true
            }
            
            // Validate absolute URLs
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    /**
     * Validate color format (hex, rgb, rgba, hsl, hsla, or named colors)
     */
    private isValidColor(color: string): boolean {
        // Hex colors
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
            return true
        }

        // RGB/RGBA colors
        if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/.test(color)) {
            return true
        }

        // HSL/HSLA colors
        if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/.test(color)) {
            return true
        }

        // Named colors (basic check)
        const namedColors = [
            'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
            'pink', 'brown', 'gray', 'grey', 'transparent', 'currentColor'
        ]
        if (namedColors.includes(color.toLowerCase())) {
            return true
        }

        return false
    }
}

/**
 * Default validator instance
 */
export const heroSectionValidator = new HeroSectionValidator()

/**
 * Register common custom validators
 */
heroSectionValidator.registerValidator('primaryButton', (context) => {
    const errors: ValidationError[] = []
    const button = context.value as ButtonConfig

    if (button && button.text && !button.url) {
        errors.push({
            field: context.fieldId,
            message: 'Button URL is required when button text is provided',
            type: 'error',
            code: 'DEPENDENT_FIELD_REQUIRED'
        })
    }

    return errors
})

heroSectionValidator.registerValidator('secondaryButton', (context) => {
    const errors: ValidationError[] = []
    const button = context.value as ButtonConfig

    if (button && button.text && !button.url) {
        errors.push({
            field: context.fieldId,
            message: 'Button URL is required when button text is provided',
            type: 'error',
            code: 'DEPENDENT_FIELD_REQUIRED'
        })
    }

    return errors
})

/**
 * Utility functions for validation
 */
export const ValidationUtils = {
    /**
     * Format validation errors for display
     */
    formatErrors(errors: ValidationError[]): Record<string, string> {
        const formatted: Record<string, string> = {}
        errors.forEach(error => {
            if (error.type === 'error') {
                formatted[error.field] = error.message
            }
        })
        return formatted
    },

    /**
     * Get validation warnings
     */
    getWarnings(errors: ValidationError[]): ValidationError[] {
        return errors.filter(error => error.type === 'warning')
    },

    /**
     * Check if validation result has errors
     */
    hasErrors(result: ValidationResult): boolean {
        return !result.isValid || result.errors.length > 0
    },

    /**
     * Merge validation results
     */
    mergeResults(...results: ValidationResult[]): ValidationResult {
        const allErrors: ValidationError[] = []
        const allWarnings: ValidationError[] = []

        results.forEach(result => {
            allErrors.push(...result.errors)
            allWarnings.push(...result.warnings)
        })

        return {
            isValid: allErrors.length === 0,
            errors: allErrors,
            warnings: allWarnings
        }
    }
}