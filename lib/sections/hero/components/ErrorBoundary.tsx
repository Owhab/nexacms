'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { HeroVariant } from '../types'

/**
 * Error boundary props
 */
interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
    variant?: HeroVariant
    showDetails?: boolean
    enableRetry?: boolean
}

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
    retryCount: number
}

/**
 * Error boundary for hero section components
 * 
 * Catches JavaScript errors anywhere in the hero section component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */
export class HeroSectionErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    private maxRetries = 3

    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0
        }
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error details
        console.error('Hero Section Error Boundary caught an error:', error, errorInfo)

        // Update state with error info
        this.setState({
            error,
            errorInfo
        })

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo)
        }

        // Send error to monitoring service
        this.reportError(error, errorInfo)
    }

    /**
     * Report error to monitoring service
     */
    private reportError(error: Error, errorInfo: ErrorInfo) {
        // In a real application, you would send this to your error monitoring service
        // like Sentry, Bugsnag, or similar
        const errorReport = {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            variant: this.props.variant,
            timestamp: new Date().toISOString(),
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
            url: typeof window !== 'undefined' ? window.location.href : 'unknown'
        }

        // Example: Send to monitoring service
        // errorMonitoringService.captureException(error, { extra: errorReport })
        
        console.warn('Error report:', errorReport)
    }

    /**
     * Retry rendering the component
     */
    private handleRetry = () => {
        if (this.state.retryCount < this.maxRetries) {
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
                retryCount: this.state.retryCount + 1
            })
        }
    }

    /**
     * Reset error boundary state
     */
    private handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0
        })
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI provided
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Default fallback UI
            return (
                <HeroErrorFallback
                    error={this.state.error}
                    errorInfo={this.state.errorInfo}
                    variant={this.props.variant}
                    showDetails={this.props.showDetails}
                    enableRetry={this.props.enableRetry && this.state.retryCount < this.maxRetries}
                    retryCount={this.state.retryCount}
                    maxRetries={this.maxRetries}
                    onRetry={this.handleRetry}
                    onReset={this.handleReset}
                />
            )
        }

        return this.props.children
    }
}

/**
 * Default error fallback component
 */
interface HeroErrorFallbackProps {
    error: Error | null
    errorInfo: ErrorInfo | null
    variant?: HeroVariant
    showDetails?: boolean
    enableRetry?: boolean
    retryCount: number
    maxRetries: number
    onRetry: () => void
    onReset: () => void
}

function HeroErrorFallback({
    error,
    errorInfo,
    variant,
    showDetails = false,
    enableRetry = true,
    retryCount,
    maxRetries,
    onRetry,
    onReset
}: HeroErrorFallbackProps) {
    const variantName = variant ? variant.replace('-', ' ') : 'hero section'

    return (
        <div className="hero-error-boundary min-h-[400px] flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center p-8 max-w-md">
                {/* Error Icon */}
                <div className="mb-4">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                    </svg>
                </div>

                {/* Error Message */}
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Something went wrong
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                    The {variantName} encountered an error and couldn&apos;t be displayed properly.
                </p>

                {/* Error Details (Development Mode) */}
                {showDetails && error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-left">
                        <h4 className="text-sm font-medium text-red-800 mb-2">Error Details:</h4>
                        <p className="text-xs text-red-700 font-mono break-all">
                            {error.message}
                        </p>
                        {error.stack && (
                            <details className="mt-2">
                                <summary className="text-xs text-red-600 cursor-pointer">
                                    Stack Trace
                                </summary>
                                <pre className="text-xs text-red-700 mt-1 whitespace-pre-wrap">
                                    {error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {enableRetry && (
                        <Button
                            onClick={onRetry}
                            variant="outline"
                            size="sm"
                            disabled={retryCount >= maxRetries}
                        >
                            {retryCount >= maxRetries 
                                ? `Max retries reached (${maxRetries})`
                                : `Retry (${retryCount}/${maxRetries})`
                            }
                        </Button>
                    )}
                    
                    <Button
                        onClick={onReset}
                        variant="outline"
                        size="sm"
                    >
                        Reset Component
                    </Button>
                </div>

                {/* Help Text */}
                <p className="text-xs text-gray-500 mt-4">
                    If this problem persists, please contact support or try refreshing the page.
                </p>
            </div>
        </div>
    )
}

/**
 * Higher-order component to wrap hero sections with error boundary
 */
export function withHeroErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    options: {
        variant?: HeroVariant
        fallback?: ReactNode
        onError?: (error: Error, errorInfo: ErrorInfo) => void
        showDetails?: boolean
        enableRetry?: boolean
    } = {}
) {
    const WrappedComponent = (props: P) => (
        <HeroSectionErrorBoundary
            variant={options.variant}
            fallback={options.fallback}
            onError={options.onError}
            showDetails={options.showDetails}
            enableRetry={options.enableRetry}
        >
            <Component {...props} />
        </HeroSectionErrorBoundary>
    )

    WrappedComponent.displayName = `withHeroErrorBoundary(${Component.displayName || Component.name})`
    
    return WrappedComponent
}

/**
 * Hook for handling errors in functional components
 */
export function useHeroErrorHandler(variant?: HeroVariant) {
    const [error, setError] = React.useState<Error | null>(null)

    const handleError = React.useCallback((error: Error) => {
        console.error(`Hero Section Error (${variant}):`, error)
        setError(error)

        // Report error to monitoring service
        const errorReport = {
            message: error.message,
            stack: error.stack,
            variant,
            timestamp: new Date().toISOString(),
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
            url: typeof window !== 'undefined' ? window.location.href : 'unknown'
        }

        console.warn('Error report:', errorReport)
    }, [variant])

    const clearError = React.useCallback(() => {
        setError(null)
    }, [])

    // Throw error to be caught by error boundary
    if (error) {
        throw error
    }

    return { handleError, clearError }
}

/**
 * Custom error classes for hero sections
 */
export class HeroSectionError extends Error {
    constructor(
        message: string,
        public variant?: HeroVariant,
        public code?: string,
        public recoverable: boolean = true
    ) {
        super(message)
        this.name = 'HeroSectionError'
    }
}

export class HeroMediaError extends HeroSectionError {
    constructor(
        message: string,
        public mediaUrl?: string,
        variant?: HeroVariant
    ) {
        super(message, variant, 'MEDIA_ERROR', true)
        this.name = 'HeroMediaError'
    }
}

export class HeroValidationError extends HeroSectionError {
    constructor(
        message: string,
        public field?: string,
        variant?: HeroVariant
    ) {
        super(message, variant, 'VALIDATION_ERROR', true)
        this.name = 'HeroValidationError'
    }
}

export class HeroRenderError extends HeroSectionError {
    constructor(
        message: string,
        variant?: HeroVariant,
        public componentName?: string
    ) {
        super(message, variant, 'RENDER_ERROR', false)
        this.name = 'HeroRenderError'
    }
}

/**
 * Error boundary context for sharing error state
 */
export const HeroErrorContext = React.createContext<{
    hasError: boolean
    error: Error | null
    reportError: (error: Error) => void
    clearError: () => void
}>({
    hasError: false,
    error: null,
    reportError: () => {},
    clearError: () => {}
})

/**
 * Provider for hero error context
 */
export function HeroErrorProvider({ children }: { children: ReactNode }) {
    const [error, setError] = React.useState<Error | null>(null)

    const reportError = React.useCallback((error: Error) => {
        setError(error)
        console.error('Hero Error Context:', error)
    }, [])

    const clearError = React.useCallback(() => {
        setError(null)
    }, [])

    const value = React.useMemo(() => ({
        hasError: !!error,
        error,
        reportError,
        clearError
    }), [error, reportError, clearError])

    return (
        <HeroErrorContext.Provider value={value}>
            {children}
        </HeroErrorContext.Provider>
    )
}

/**
 * Hook to use hero error context
 */
export function useHeroError() {
    const context = React.useContext(HeroErrorContext)
    if (!context) {
        throw new Error('useHeroError must be used within a HeroErrorProvider')
    }
    return context
}

export default HeroSectionErrorBoundary