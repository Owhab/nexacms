// Server-side validation for hero sections

import { NextRequest } from 'next/server'
import {
    HeroProps,
    MediaConfig,
    BackgroundConfig,
    ButtonConfig
} from './types'
import { ValidationError } from './validation'

/**
 * Server-side validation configuration
 */
export interface ServerValidationConfig {
    maxFileSize: number // in bytes
    allowedImageTypes: string[]
    allowedVideoTypes: string[]
    maxImageDimensions: { width: number; height: number }
    maxVideoDuration: number // in seconds
    contentSecurityPolicy: {
        allowedDomains: string[]
        blockMaliciousContent: boolean
    }
}

/**
 * Default server validation configuration
 */
export const DEFAULT_SERVER_CONFIG: ServerValidationConfig = {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedImageTypes: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml'
    ],
    allowedVideoTypes: [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/quicktime',
        'video/x-msvideo'
    ],
    maxImageDimensions: {
        width: 4000,
        height: 4000
    },
    maxVideoDuration: 300, // 5 minutes
    contentSecurityPolicy: {
        allowedDomains: [
            'localhost',
            'your-domain.com',
            'cdn.your-domain.com',
            'images.unsplash.com',
            'via.placeholder.com'
        ],
        blockMaliciousContent: true
    }
}

/**
 * Server-side validation result
 */
export interface ServerValidationResult {
    isValid: boolean
    errors: ValidationError[]
    warnings: ValidationError[]
    sanitizedData?: any
}

/**
 * Server-side validator for hero sections
 */
export class HeroServerValidator {
    private config: ServerValidationConfig

    constructor(config: ServerValidationConfig = DEFAULT_SERVER_CONFIG) {
        this.config = config
    }

    /**
     * Validate hero section data from API request
     */
    async validateHeroSectionRequest(request: NextRequest): Promise<ServerValidationResult> {
        try {
            const body = await request.json()
            return this.validateHeroSectionData(body)
        } catch (error) {
            return {
                isValid: false,
                errors: [{
                    field: 'request',
                    message: 'Invalid JSON in request body',
                    type: 'error',
                    code: 'INVALID_JSON'
                }],
                warnings: []
            }
        }
    }

    /**
     * Validate complete hero section data
     */
    validateHeroSectionData(data: any): ServerValidationResult {
        const errors: ValidationError[] = []
        const warnings: ValidationError[] = []
        let sanitizedData = { ...data }

        // Validate basic structure
        if (!data || typeof data !== 'object') {
            return {
                isValid: false,
                errors: [{
                    field: 'data',
                    message: 'Hero section data must be an object',
                    type: 'error',
                    code: 'INVALID_DATA_TYPE'
                }],
                warnings: []
            }
        }

        // Validate required fields
        const requiredFields = ['id', 'variant']
        for (const field of requiredFields) {
            if (!data[field]) {
                errors.push({
                    field,
                    message: `${field} is required`,
                    type: 'error',
                    code: 'REQUIRED_FIELD'
                })
            }
        }

        // Sanitize and validate content
        sanitizedData = this.sanitizeContent(sanitizedData)

        // Validate media configurations
        const mediaValidation = this.validateAllMedia(data)
        errors.push(...mediaValidation.errors)
        warnings.push(...mediaValidation.warnings)

        // Validate URLs
        const urlValidation = this.validateAllUrls(data)
        errors.push(...urlValidation.errors)
        warnings.push(...urlValidation.warnings)

        // Validate content security
        const securityValidation = this.validateContentSecurity(data)
        errors.push(...securityValidation.errors)
        warnings.push(...securityValidation.warnings)

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            sanitizedData
        }
    }

    /**
     * Validate media upload
     */
    async validateMediaUpload(
        file: File,
        mediaType: 'image' | 'video'
    ): Promise<ServerValidationResult> {
        const errors: ValidationError[] = []
        const warnings: ValidationError[] = []

        // Check file size
        if (file.size > this.config.maxFileSize) {
            errors.push({
                field: 'file',
                message: `File size exceeds maximum allowed size of ${this.formatFileSize(this.config.maxFileSize)}`,
                type: 'error',
                code: 'FILE_TOO_LARGE'
            })
        }

        // Check file type
        const allowedTypes = mediaType === 'image'
            ? this.config.allowedImageTypes
            : this.config.allowedVideoTypes

        if (!allowedTypes.includes(file.type)) {
            errors.push({
                field: 'file',
                message: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
                type: 'error',
                code: 'INVALID_FILE_TYPE'
            })
        }

        // Additional validation for images
        if (mediaType === 'image' && file.type.startsWith('image/')) {
            const imageValidation = await this.validateImageFile(file)
            errors.push(...imageValidation.errors)
            warnings.push(...imageValidation.warnings)
        }

        // Additional validation for videos
        if (mediaType === 'video' && file.type.startsWith('video/')) {
            const videoValidation = await this.validateVideoFile(file)
            errors.push(...videoValidation.errors)
            warnings.push(...videoValidation.warnings)
        }

        // Check for malicious content
        const malwareValidation = await this.scanForMalware(file)
        errors.push(...malwareValidation.errors)
        warnings.push(...malwareValidation.warnings)

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        }
    }

    /**
     * Validate image file
     */
    private async validateImageFile(file: File): Promise<ServerValidationResult> {
        const errors: ValidationError[] = []
        const warnings: ValidationError[] = []

        try {
            // Create image element to check dimensions
            const imageUrl = URL.createObjectURL(file)
            const img = new Image()

            await new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = reject
                img.src = imageUrl
            })

            // Check dimensions
            if (img.width > this.config.maxImageDimensions.width ||
                img.height > this.config.maxImageDimensions.height) {
                warnings.push({
                    field: 'dimensions',
                    message: `Image dimensions (${img.width}x${img.height}) exceed recommended maximum (${this.config.maxImageDimensions.width}x${this.config.maxImageDimensions.height})`,
                    type: 'warning',
                    code: 'LARGE_DIMENSIONS'
                })
            }

            // Check aspect ratio for common use cases
            const aspectRatio = img.width / img.height
            if (aspectRatio < 0.5 || aspectRatio > 3) {
                warnings.push({
                    field: 'aspectRatio',
                    message: 'Unusual aspect ratio detected. Consider using images with more standard proportions for better display.',
                    type: 'warning',
                    code: 'UNUSUAL_ASPECT_RATIO'
                })
            }

            URL.revokeObjectURL(imageUrl)
        } catch (error) {
            errors.push({
                field: 'file',
                message: 'Unable to process image file. File may be corrupted.',
                type: 'error',
                code: 'CORRUPTED_FILE'
            })
        }

        return { isValid: errors.length === 0, errors, warnings }
    }

    /**
     * Validate video file
     */
    private async validateVideoFile(file: File): Promise<ServerValidationResult> {
        const errors: ValidationError[] = []
        const warnings: ValidationError[] = []

        try {
            // Create video element to check properties
            const videoUrl = URL.createObjectURL(file)
            const video = document.createElement('video')

            await new Promise((resolve, reject) => {
                video.onloadedmetadata = resolve
                video.onerror = reject
                video.src = videoUrl
            })

            // Check duration
            if (video.duration > this.config.maxVideoDuration) {
                warnings.push({
                    field: 'duration',
                    message: `Video duration (${Math.round(video.duration)}s) exceeds recommended maximum (${this.config.maxVideoDuration}s)`,
                    type: 'warning',
                    code: 'LONG_DURATION'
                })
            }

            // Check dimensions
            if (video.videoWidth > this.config.maxImageDimensions.width ||
                video.videoHeight > this.config.maxImageDimensions.height) {
                warnings.push({
                    field: 'dimensions',
                    message: `Video dimensions (${video.videoWidth}x${video.videoHeight}) exceed recommended maximum`,
                    type: 'warning',
                    code: 'LARGE_DIMENSIONS'
                })
            }

            URL.revokeObjectURL(videoUrl)
        } catch (error) {
            errors.push({
                field: 'file',
                message: 'Unable to process video file. File may be corrupted or in an unsupported format.',
                type: 'error',
                code: 'CORRUPTED_FILE'
            })
        }

        return { isValid: errors.length === 0, errors, warnings }
    }

    /**
     * Scan file for malware (placeholder - integrate with actual scanning service)
     */
    private async scanForMalware(file: File): Promise<ServerValidationResult> {
        const errors: ValidationError[] = []
        const warnings: ValidationError[] = []

        if (!this.config.contentSecurityPolicy.blockMaliciousContent) {
            return { isValid: true, errors, warnings }
        }

        // Basic file name checks
        const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com']
        const fileName = file.name.toLowerCase()

        for (const ext of suspiciousExtensions) {
            if (fileName.includes(ext)) {
                errors.push({
                    field: 'file',
                    message: 'File contains suspicious content and cannot be uploaded',
                    type: 'error',
                    code: 'MALICIOUS_CONTENT'
                })
                break
            }
        }

        // TODO: Integrate with actual malware scanning service
        // This is where you would call an external service like VirusTotal, ClamAV, etc.

        return { isValid: errors.length === 0, errors, warnings }
    }

    /**
     * Validate all media configurations in hero section data
     */
    private validateAllMedia(data: any): ServerValidationResult {
        const errors: ValidationError[] = []
        const warnings: ValidationError[] = []

        // Recursively find and validate media configurations
        this.findAndValidateMedia(data, '', errors, warnings)

        return { isValid: errors.length === 0, errors, warnings }
    }

    /**
     * Recursively find and validate media configurations
     */
    private findAndValidateMedia(
        obj: any,
        path: string,
        errors: ValidationError[],
        warnings: ValidationError[]
    ): void {
        if (!obj || typeof obj !== 'object') return

        // Check if this object looks like a MediaConfig
        if (obj.url && obj.type && (obj.type === 'image' || obj.type === 'video')) {
            const mediaValidation = this.validateMediaConfig(obj as MediaConfig, path)
            errors.push(...mediaValidation.errors)
            warnings.push(...mediaValidation.warnings)
        }

        // Recursively check nested objects
        for (const [key, value] of Object.entries(obj)) {
            const newPath = path ? `${path}.${key}` : key
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    this.findAndValidateMedia(item, `${newPath}[${index}]`, errors, warnings)
                })
            } else if (value && typeof value === 'object') {
                this.findAndValidateMedia(value, newPath, errors, warnings)
            }
        }
    }

    /**
     * Validate media configuration
     */
    private validateMediaConfig(media: MediaConfig, path: string): ServerValidationResult {
        const errors: ValidationError[] = []
        const warnings: ValidationError[] = []

        // Validate URL
        if (!this.isValidUrl(media.url)) {
            errors.push({
                field: `${path}.url`,
                message: 'Invalid media URL',
                type: 'error',
                code: 'INVALID_URL'
            })
        } else if (!this.isAllowedDomain(media.url)) {
            errors.push({
                field: `${path}.url`,
                message: 'Media URL from unauthorized domain',
                type: 'error',
                code: 'UNAUTHORIZED_DOMAIN'
            })
        }

        // Validate alt text for images
        if (media.type === 'image' && !media.alt) {
            warnings.push({
                field: `${path}.alt`,
                message: 'Alt text is recommended for images for better accessibility',
                type: 'warning',
                code: 'MISSING_ALT_TEXT'
            })
        }

        return { isValid: errors.length === 0, errors, warnings }
    }

    /**
     * Validate all URLs in hero section data
     */
    private validateAllUrls(data: any): ServerValidationResult {
        const errors: ValidationError[] = []
        const warnings: ValidationError[] = []

        this.findAndValidateUrls(data, '', errors, warnings)

        return { isValid: errors.length === 0, errors, warnings }
    }

    /**
     * Recursively find and validate URLs
     */
    private findAndValidateUrls(
        obj: any,
        path: string,
        errors: ValidationError[],
        warnings: ValidationError[]
    ): void {
        if (!obj || typeof obj !== 'object') return

        for (const [key, value] of Object.entries(obj)) {
            const newPath = path ? `${path}.${key}` : key

            if (key === 'url' && typeof value === 'string') {
                if (!this.isValidUrl(value)) {
                    errors.push({
                        field: newPath,
                        message: 'Invalid URL format',
                        type: 'error',
                        code: 'INVALID_URL'
                    })
                } else if (value.startsWith('http://') && !value.includes('localhost')) {
                    warnings.push({
                        field: newPath,
                        message: 'Consider using HTTPS for better security',
                        type: 'warning',
                        code: 'INSECURE_URL'
                    })
                }
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    this.findAndValidateUrls(item, `${newPath}[${index}]`, errors, warnings)
                })
            } else if (value && typeof value === 'object') {
                this.findAndValidateUrls(value, newPath, errors, warnings)
            }
        }
    }

    /**
     * Validate content security
     */
    private validateContentSecurity(data: any): ServerValidationResult {
        const errors: ValidationError[] = []
        const warnings: ValidationError[] = []

        // Check for potentially malicious content
        const suspiciousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe\b[^>]*>/gi
        ]

        this.scanForSuspiciousContent(data, '', suspiciousPatterns, errors, warnings)

        return { isValid: errors.length === 0, errors, warnings }
    }

    /**
     * Scan for suspicious content patterns
     */
    private scanForSuspiciousContent(
        obj: any,
        path: string,
        patterns: RegExp[],
        errors: ValidationError[],
        warnings: ValidationError[]
    ): void {
        if (typeof obj === 'string') {
            for (const pattern of patterns) {
                if (pattern.test(obj)) {
                    errors.push({
                        field: path,
                        message: 'Content contains potentially malicious code',
                        type: 'error',
                        code: 'MALICIOUS_CONTENT'
                    })
                    break
                }
            }
        } else if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                this.scanForSuspiciousContent(item, `${path}[${index}]`, patterns, errors, warnings)
            })
        } else if (obj && typeof obj === 'object') {
            for (const [key, value] of Object.entries(obj)) {
                const newPath = path ? `${path}.${key}` : key
                this.scanForSuspiciousContent(value, newPath, patterns, errors, warnings)
            }
        }
    }

    /**
     * Sanitize content to remove potentially harmful elements
     */
    private sanitizeContent(data: any): any {
        if (typeof data === 'string') {
            // Remove script tags and event handlers
            return data
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
                .replace(/javascript:/gi, '')
        } else if (Array.isArray(data)) {
            return data.map(item => this.sanitizeContent(item))
        } else if (data && typeof data === 'object') {
            const sanitized: any = {}
            for (const [key, value] of Object.entries(data)) {
                sanitized[key] = this.sanitizeContent(value)
            }
            return sanitized
        }

        return data
    }

    /**
     * Check if URL is valid
     */
    private isValidUrl(url: string): boolean {
        try {
            if (url.startsWith('/') || url.startsWith('#')) {
                return true
            }
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    /**
     * Check if URL domain is allowed
     */
    private isAllowedDomain(url: string): boolean {
        if (url.startsWith('/') || url.startsWith('#')) {
            return true
        }

        try {
            const urlObj = new URL(url)
            const domain = urlObj.hostname

            return this.config.contentSecurityPolicy.allowedDomains.some(allowedDomain => {
                return domain === allowedDomain || domain.endsWith(`.${allowedDomain}`)
            })
        } catch {
            return false
        }
    }

    /**
     * Format file size for display
     */
    private formatFileSize(bytes: number): string {
        const units = ['B', 'KB', 'MB', 'GB']
        let size = bytes
        let unitIndex = 0

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024
            unitIndex++
        }

        return `${Math.round(size * 100) / 100} ${units[unitIndex]}`
    }
}

/**
 * Default server validator instance
 */
export const heroServerValidator = new HeroServerValidator()

/**
 * Middleware function for validating hero section API requests
 */
export async function validateHeroSectionMiddleware(
    request: NextRequest,
    config?: Partial<ServerValidationConfig>
): Promise<ServerValidationResult> {
    const validator = config
        ? new HeroServerValidator({ ...DEFAULT_SERVER_CONFIG, ...config })
        : heroServerValidator

    return validator.validateHeroSectionRequest(request)
}

/**
 * Utility function for validating media uploads in API routes
 */
export async function validateMediaUploadMiddleware(
    file: File,
    mediaType: 'image' | 'video',
    config?: Partial<ServerValidationConfig>
): Promise<ServerValidationResult> {
    const validator = config
        ? new HeroServerValidator({ ...DEFAULT_SERVER_CONFIG, ...config })
        : heroServerValidator

    return validator.validateMediaUpload(file, mediaType)
}