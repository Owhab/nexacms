'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { HeroProps, MediaConfig, BackgroundConfig, ButtonConfig } from '../types'

/**
 * Fallback configuration
 */
interface FallbackConfig {
    enableRetry: boolean
    maxRetries: number
    retryDelay: number
    fallbackData: Partial<HeroProps>
    gracefulDegradation: boolean
}

/**
 * API call state
 */
interface ApiCallState<T> {
    data: T | null
    loading: boolean
    error: Error | null
    retryCount: number
}

/**
 * Default fallback configuration
 */
const DEFAULT_FALLBACK_CONFIG: FallbackConfig = {
    enableRetry: true,
    maxRetries: 3,
    retryDelay: 1000,
    gracefulDegradation: true,
    fallbackData: {
        title: {
            text: 'Welcome to Our Website',
            tag: 'h1'
        },
        subtitle: {
            text: 'We\'re experiencing some technical difficulties, but we\'ll be back soon.',
            tag: 'p'
        },
        background: {
            type: 'color',
            color: '#f3f4f6'
        }
    }
}

/**
 * Hook for handling hero section fallbacks and error recovery
 */
export function useHeroFallbacks<T = any>(
    apiCall: () => Promise<T>,
    config: Partial<FallbackConfig> = {}
) {
    const fullConfig = { ...DEFAULT_FALLBACK_CONFIG, ...config }
    const [state, setState] = useState<ApiCallState<T>>({
        data: null,
        loading: false,
        error: null,
        retryCount: 0
    })

    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const abortControllerRef = useRef<AbortController | null>(null)

    // Execute API call with retry logic
    const executeCall = useCallback(async (isRetry = false) => {
        // Cancel any pending requests
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        abortControllerRef.current = new AbortController()

        setState(prev => ({
            ...prev,
            loading: true,
            error: isRetry ? prev.error : null
        }))

        try {
            const result = await apiCall()
            
            setState(prev => ({
                data: result,
                loading: false,
                error: null,
                retryCount: 0
            }))
        } catch (error) {
            const apiError = error instanceof Error ? error : new Error('Unknown error occurred')
            
            setState(prev => ({
                ...prev,
                loading: false,
                error: apiError,
                retryCount: isRetry ? prev.retryCount + 1 : 1
            }))

            // Schedule retry if enabled and within limits
            if (fullConfig.enableRetry && state.retryCount < fullConfig.maxRetries) {
                const delay = fullConfig.retryDelay * Math.pow(2, state.retryCount) // Exponential backoff
                
                retryTimeoutRef.current = setTimeout(() => {
                    executeCall(true)
                }, delay)
            }
        }
    }, [apiCall, fullConfig.enableRetry, fullConfig.maxRetries, fullConfig.retryDelay, state.retryCount])

    // Manual retry function
    const retry = useCallback(() => {
        if (state.retryCount < fullConfig.maxRetries) {
            executeCall(true)
        }
    }, [executeCall, state.retryCount, fullConfig.maxRetries])

    // Reset function
    const reset = useCallback(() => {
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current)
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        
        setState({
            data: null,
            loading: false,
            error: null,
            retryCount: 0
        })
    }, [])

    // Initial call
    useEffect(() => {
        executeCall()
        
        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current)
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [executeCall])

    return {
        ...state,
        retry,
        reset,
        canRetry: state.retryCount < fullConfig.maxRetries,
        isRetrying: state.loading && state.retryCount > 0
    }
}

/**
 * Hook for hero section data with comprehensive fallbacks
 */
export function useHeroSectionData(
    sectionId: string,
    config: Partial<FallbackConfig> = {}
) {
    const apiCall = useCallback(async () => {
        const response = await fetch(`/api/sections/${sectionId}`)
        if (!response.ok) {
            throw new Error(`Failed to fetch section data: ${response.statusText}`)
        }
        return response.json()
    }, [sectionId])

    const { data, loading, error, retry, reset, canRetry, isRetrying } = useHeroFallbacks(
        apiCall,
        config
    )

    // Apply fallbacks and graceful degradation
    const processedData = useMemo(() => {
        if (data) {
            return applyDataFallbacks(data, config.fallbackData)
        }
        
        if (error && config.gracefulDegradation !== false) {
            return config.fallbackData || DEFAULT_FALLBACK_CONFIG.fallbackData
        }
        
        return null
    }, [data, error, config.fallbackData, config.gracefulDegradation])

    return {
        data: processedData,
        loading,
        error,
        retry,
        reset,
        canRetry,
        isRetrying
    }
}

/**
 * Hook for media loading with fallbacks
 */
export function useMediaFallback(
    media: MediaConfig | undefined,
    fallbackUrl?: string
) {
    const [loadingState, setLoadingState] = useState<'loading' | 'loaded' | 'error'>('loading')
    const [currentUrl, setCurrentUrl] = useState<string>('')
    const [retryCount, setRetryCount] = useState(0)

    const maxRetries = 2
    const fallback = fallbackUrl || '/assets/placeholders/image-placeholder.svg'

    useEffect(() => {
        if (!media?.url) {
            setCurrentUrl(fallback)
            setLoadingState('error')
            return
        }

        setLoadingState('loading')
        setCurrentUrl(media.url)

        // Test if media URL is accessible
        const testMedia = () => {
            if (media.type === 'image') {
                const img = new Image()
                img.onload = () => setLoadingState('loaded')
                img.onerror = () => handleMediaError()
                img.src = media.url
            } else if (media.type === 'video') {
                const video = document.createElement('video')
                video.onloadeddata = () => setLoadingState('loaded')
                video.onerror = () => handleMediaError()
                video.src = media.url
            }
        }

        const handleMediaError = () => {
            if (retryCount < maxRetries) {
                setTimeout(() => {
                    setRetryCount(prev => prev + 1)
                    testMedia()
                }, 1000 * (retryCount + 1))
            } else {
                setCurrentUrl(fallback)
                setLoadingState('error')
            }
        }

        testMedia()
    }, [media?.url, media?.type, fallback, retryCount])

    return {
        url: currentUrl,
        isLoading: loadingState === 'loading',
        hasError: loadingState === 'error',
        isLoaded: loadingState === 'loaded',
        retryCount
    }
}

/**
 * Apply fallbacks to hero section data
 */
function applyDataFallbacks(
    data: Partial<HeroProps>,
    fallbackData?: Partial<HeroProps>
): HeroProps {
    const fallbacks = fallbackData || DEFAULT_FALLBACK_CONFIG.fallbackData

    return {
        // Required fields with fallbacks
        id: data.id || 'fallback-hero',
        variant: data.variant || 'centered',
        
        // Theme with fallbacks
        theme: {
            primaryColor: '#3b82f6',
            secondaryColor: '#64748b',
            accentColor: '#f59e0b',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            borderColor: '#e5e7eb',
            ...data.theme
        },

        // Responsive config with fallbacks
        responsive: {
            mobile: {
                layout: {
                    direction: 'column',
                    alignment: 'center',
                    justification: 'center',
                    gap: '1rem',
                    padding: '2rem',
                    margin: '0'
                },
                typography: {
                    fontSize: 'lg',
                    lineHeight: '1.5',
                    fontWeight: 'normal',
                    textAlign: 'center'
                },
                spacing: {
                    padding: { top: '2rem', right: '1rem', bottom: '2rem', left: '1rem' },
                    margin: { top: '0', right: '0', bottom: '0', left: '0' }
                }
            },
            tablet: {
                layout: {
                    direction: 'column',
                    alignment: 'center',
                    justification: 'center',
                    gap: '1.5rem',
                    padding: '3rem',
                    margin: '0'
                },
                typography: {
                    fontSize: 'xl',
                    lineHeight: '1.4',
                    fontWeight: 'normal',
                    textAlign: 'center'
                },
                spacing: {
                    padding: { top: '3rem', right: '2rem', bottom: '3rem', left: '2rem' },
                    margin: { top: '0', right: '0', bottom: '0', left: '0' }
                }
            },
            desktop: {
                layout: {
                    direction: 'column',
                    alignment: 'center',
                    justification: 'center',
                    gap: '2rem',
                    padding: '4rem',
                    margin: '0'
                },
                typography: {
                    fontSize: '2xl',
                    lineHeight: '1.3',
                    fontWeight: 'normal',
                    textAlign: 'center'
                },
                spacing: {
                    padding: { top: '4rem', right: '3rem', bottom: '4rem', left: '3rem' },
                    margin: { top: '0', right: '0', bottom: '0', left: '0' }
                }
            },
            ...data.responsive
        },

        // Accessibility config with fallbacks
        accessibility: {
            ariaLabels: {},
            altTexts: {},
            keyboardNavigation: true,
            screenReaderSupport: true,
            highContrast: false,
            reducedMotion: false,
            ...data.accessibility
        },

        // Apply specific fallbacks based on data structure
        ...applyVariantSpecificFallbacks(data, fallbacks)
    } as HeroProps
}

/**
 * Apply variant-specific fallbacks
 */
function applyVariantSpecificFallbacks(
    data: Partial<HeroProps>,
    fallbacks: Partial<HeroProps>
): Partial<HeroProps> {
    const result: any = { ...data }

    // Apply title fallback (check if property exists on this variant)
    if ('title' in result) {
        if (!result.title || (typeof result.title === 'object' && !result.title.text)) {
            result.title = (fallbacks as any).title || {
                text: 'Welcome to Our Website',
                tag: 'h1'
            }
        }
    }

    // Apply subtitle fallback (check if property exists on this variant)
    if ('subtitle' in result) {
        if (!result.subtitle || (typeof result.subtitle === 'object' && !result.subtitle.text)) {
            result.subtitle = (fallbacks as any).subtitle || {
                text: 'Experience something amazing',
                tag: 'p'
            }
        }
    }

    // Apply background fallback (check if property exists on this variant)
    if ('background' in result) {
        if (!result.background || !isValidBackground(result.background)) {
            result.background = (fallbacks as any).background || {
                type: 'color',
                color: '#f3f4f6'
            }
        }
    }

    // Apply button fallbacks (check if properties exist on this variant)
    if ('primaryButton' in result && result.primaryButton && !isValidButton(result.primaryButton)) {
        result.primaryButton = {
            text: 'Get Started',
            url: '#',
            style: 'primary',
            size: 'lg',
            iconPosition: 'right',
            target: '_self',
            ...result.primaryButton
        }
    }

    if ('secondaryButton' in result && result.secondaryButton && !isValidButton(result.secondaryButton)) {
        result.secondaryButton = {
            text: 'Learn More',
            url: '#',
            style: 'outline',
            size: 'lg',
            iconPosition: 'left',
            target: '_self',
            ...result.secondaryButton
        }
    }

    return result
}

/**
 * Validate background configuration
 */
function isValidBackground(background: any): background is BackgroundConfig {
    if (!background || typeof background !== 'object') return false
    
    const validTypes = ['none', 'color', 'gradient', 'image', 'video']
    if (!validTypes.includes(background.type)) return false

    switch (background.type) {
        case 'color':
            return !!background.color
        case 'gradient':
            return !!background.gradient && Array.isArray(background.gradient.colors)
        case 'image':
            return !!background.image && !!background.image.url
        case 'video':
            return !!background.video && !!background.video.url
        default:
            return true
    }
}

/**
 * Validate button configuration
 */
function isValidButton(button: any): button is ButtonConfig {
    return !!(
        button &&
        typeof button === 'object' &&
        button.text &&
        button.url
    )
}

/**
 * Create fallback hero props for emergency situations
 */
export function createEmergencyFallback(variant: string = 'centered'): any {
    const baseProps = {
        id: 'emergency-fallback',
        variant: variant as any,
        theme: {
            primaryColor: '#3b82f6',
            secondaryColor: '#64748b',
            accentColor: '#f59e0b',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            borderColor: '#e5e7eb'
        },
        responsive: {
            mobile: {
                layout: {
                    direction: 'column' as const,
                    alignment: 'center' as const,
                    justification: 'center' as const,
                    gap: '1rem',
                    padding: '2rem',
                    margin: '0'
                },
                typography: {
                    fontSize: 'lg',
                    lineHeight: '1.5',
                    fontWeight: 'normal',
                    textAlign: 'center' as const
                },
                spacing: {
                    padding: { top: '2rem', right: '1rem', bottom: '2rem', left: '1rem' },
                    margin: { top: '0', right: '0', bottom: '0', left: '0' }
                }
            },
            tablet: {
                layout: {
                    direction: 'column' as const,
                    alignment: 'center' as const,
                    justification: 'center' as const,
                    gap: '1.5rem',
                    padding: '3rem',
                    margin: '0'
                },
                typography: {
                    fontSize: 'xl',
                    lineHeight: '1.4',
                    fontWeight: 'normal',
                    textAlign: 'center' as const
                },
                spacing: {
                    padding: { top: '3rem', right: '2rem', bottom: '3rem', left: '2rem' },
                    margin: { top: '0', right: '0', bottom: '0', left: '0' }
                }
            },
            desktop: {
                layout: {
                    direction: 'column' as const,
                    alignment: 'center' as const,
                    justification: 'center' as const,
                    gap: '2rem',
                    padding: '4rem',
                    margin: '0'
                },
                typography: {
                    fontSize: '2xl',
                    lineHeight: '1.3',
                    fontWeight: 'normal',
                    textAlign: 'center' as const
                },
                spacing: {
                    padding: { top: '4rem', right: '3rem', bottom: '4rem', left: '3rem' },
                    margin: { top: '0', right: '0', bottom: '0', left: '0' }
                }
            }
        },
        accessibility: {
            ariaLabels: {
                'main': 'Main hero section'
            },
            altTexts: {},
            keyboardNavigation: true,
            screenReaderSupport: true,
            highContrast: false,
            reducedMotion: false
        }
    }

    // Add variant-specific properties
    switch (variant) {
        case 'centered':
            return {
                ...baseProps,
                title: {
                    text: 'Service Temporarily Unavailable',
                    tag: 'h1' as const
                },
                subtitle: {
                    text: 'We\'re working to restore service. Please try again in a few moments.',
                    tag: 'p' as const
                },
                background: {
                    type: 'color' as const,
                    color: '#f9fafb'
                },
                textAlign: 'center' as const
            }
        
        case 'minimal':
            return {
                ...baseProps,
                title: {
                    text: 'Service Unavailable',
                    tag: 'h1' as const
                },
                subtitle: {
                    text: 'Please try again later.',
                    tag: 'p' as const
                },
                background: {
                    type: 'color' as const,
                    color: '#f9fafb'
                },
                spacing: 'normal' as const
            }

        default:
            // Default to centered variant
            return {
                ...baseProps,
                title: {
                    text: 'Service Temporarily Unavailable',
                    tag: 'h1' as const
                },
                subtitle: {
                    text: 'We\'re working to restore service. Please try again in a few moments.',
                    tag: 'p' as const
                },
                background: {
                    type: 'color' as const,
                    color: '#f9fafb'
                },
                textAlign: 'center' as const
            }
    }
}

export default useHeroFallbacks