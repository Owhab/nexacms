import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { HeroCentered } from '../HeroCentered'
import { HeroCenteredEditor } from '../../editors/HeroCenteredEditor'
import { HeroCenteredPreview } from '../../previews/HeroCenteredPreview'
import {
    HeroCenteredProps,
    HeroVariant,
    HeroEditorProps
} from '../../types'
import {
    getDefaultThemeConfig,
    getDefaultResponsiveConfig,
    getDefaultAccessibilityConfig
} from '../../utils'

// Mock the MediaPicker component
jest.mock('@/components/ui/MediaPicker', () => ({
    MediaPicker: ({ onChange, value, placeholder }: any) => (
        <div data-testid="media-picker">
            <input
                type="file"
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                        onChange({
                            id: 'test-media',
                            url: URL.createObjectURL(file),
                            type: 'IMAGE',
                            fileName: file.name,
                            fileSize: file.size,
                            mimeType: file.type
                        })
                    }
                }}
                data-testid="file-input"
            />
            {value && <div data-testid="selected-media">{value.url}</div>}
            <div>{placeholder}</div>
        </div>
    )
}))

// Mock the Button component
jest.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, disabled, variant }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            data-variant={variant}
            data-testid="button"
        >
            {children}
        </button>
    )
}))

describe('HeroCentered Component', () => {
    const defaultProps: HeroCenteredProps = {
        id: 'test-hero',
        variant: HeroVariant.CENTERED,
        theme: getDefaultThemeConfig(),
        responsive: getDefaultResponsiveConfig(),
        accessibility: getDefaultAccessibilityConfig(),
        title: {
            text: 'Test Hero Title',
            tag: 'h1'
        },
        subtitle: {
            text: 'Test Hero Subtitle',
            tag: 'h2'
        },
        description: {
            text: 'Test hero description content',
            tag: 'p'
        },
        primaryButton: {
            text: 'Get Started',
            url: '/get-started',
            style: 'primary',
            size: 'lg',
            iconPosition: 'right',
            target: '_self'
        },
        secondaryButton: {
            text: 'Learn More',
            url: '/learn-more',
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

    describe('Rendering', () => {
        it('renders with required props', () => {
            const minimalProps: HeroCenteredProps = {
                ...defaultProps,
                subtitle: undefined,
                description: undefined,
                secondaryButton: undefined
            }

            render(<HeroCentered {...minimalProps} />)

            expect(screen.getByText('Test Hero Title')).toBeInTheDocument()
            expect(screen.getByText('Get Started')).toBeInTheDocument()
        })

        it('renders all content elements when provided', () => {
            render(<HeroCentered {...defaultProps} />)

            expect(screen.getByText('Test Hero Title')).toBeInTheDocument()
            expect(screen.getByText('Test Hero Subtitle')).toBeInTheDocument()
            expect(screen.getByText('Test hero description content')).toBeInTheDocument()
            expect(screen.getByText('Get Started')).toBeInTheDocument()
            expect(screen.getByText('Learn More')).toBeInTheDocument()
        })

        it('applies correct HTML tags to text elements', () => {
            render(<HeroCentered {...defaultProps} />)

            const title = screen.getByRole('heading', { level: 1 })
            expect(title).toHaveTextContent('Test Hero Title')

            const subtitle = screen.getByRole('heading', { level: 2 })
            expect(subtitle).toHaveTextContent('Test Hero Subtitle')
        })

        it('renders buttons with correct attributes', () => {
            render(<HeroCentered {...defaultProps} />)

            const primaryButton = screen.getByRole('link', { name: 'Get Started' })
            expect(primaryButton).toHaveAttribute('href', '/get-started')
            expect(primaryButton).toHaveAttribute('target', '_self')

            const secondaryButton = screen.getByRole('link', { name: 'Learn More' })
            expect(secondaryButton).toHaveAttribute('href', '/learn-more')
            expect(secondaryButton).toHaveAttribute('target', '_self')
        })
    })

    describe('Text Alignment', () => {
        it('applies center alignment by default', () => {
            render(<HeroCentered {...defaultProps} />)

            const contentContainer = screen.getByText('Test Hero Title').closest('.space-y-6')
            expect(contentContainer).toHaveClass('text-center')
        })

        it('applies left alignment when specified', () => {
            const leftAlignedProps = { ...defaultProps, textAlign: 'left' as const }
            render(<HeroCentered {...leftAlignedProps} />)

            const contentContainer = screen.getByText('Test Hero Title').closest('.space-y-6')
            expect(contentContainer).toHaveClass('text-left')
        })

        it('applies right alignment when specified', () => {
            const rightAlignedProps = { ...defaultProps, textAlign: 'right' as const }
            render(<HeroCentered {...rightAlignedProps} />)

            const contentContainer = screen.getByText('Test Hero Title').closest('.space-y-6')
            expect(contentContainer).toHaveClass('text-right')
        })
    })

    describe('Background Handling', () => {
        it('renders gradient background', () => {
            render(<HeroCentered {...defaultProps} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toBeInTheDocument()
        })

        it('renders color background', () => {
            const colorBackgroundProps = {
                ...defaultProps,
                background: {
                    type: 'color' as const,
                    color: '#ff0000'
                }
            }

            render(<HeroCentered {...colorBackgroundProps} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toBeInTheDocument()
        })

        it('renders image background', () => {
            const imageBackgroundProps = {
                ...defaultProps,
                background: {
                    type: 'image' as const,
                    image: {
                        id: 'bg-image',
                        url: '/test-image.jpg',
                        type: 'image' as const,
                        alt: 'Background image',
                        objectFit: 'cover' as const,
                        loading: 'lazy' as const
                    }
                }
            }

            render(<HeroCentered {...imageBackgroundProps} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toBeInTheDocument()
        })
    })

    describe('Accessibility', () => {
        it('has proper ARIA labels', () => {
            render(<HeroCentered {...defaultProps} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toHaveAttribute('aria-label')
        })

        it('supports keyboard navigation', () => {
            render(<HeroCentered {...defaultProps} />)

            const primaryButton = screen.getByRole('link', { name: 'Get Started' })
            expect(primaryButton).toBeVisible()

            // Test keyboard focus
            primaryButton.focus()
            expect(document.activeElement).toBe(primaryButton)
        })

        it('has proper heading hierarchy', () => {
            render(<HeroCentered {...defaultProps} />)

            const h1 = screen.getByRole('heading', { level: 1 })
            const h2 = screen.getByRole('heading', { level: 2 })

            expect(h1).toBeInTheDocument()
            expect(h2).toBeInTheDocument()
        })
    })

    describe('Responsive Behavior', () => {
        it('applies responsive classes', () => {
            render(<HeroCentered {...defaultProps} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toHaveClass('hero-section')
        })

        it('handles missing optional props gracefully', () => {
            const minimalProps: HeroCenteredProps = {
                id: 'minimal-hero',
                variant: HeroVariant.CENTERED,
                theme: getDefaultThemeConfig(),
                responsive: getDefaultResponsiveConfig(),
                accessibility: getDefaultAccessibilityConfig(),
                title: {
                    text: 'Minimal Hero',
                    tag: 'h1'
                },
                background: {
                    type: 'none'
                },
                textAlign: 'center'
            }

            render(<HeroCentered {...minimalProps} />)

            expect(screen.getByText('Minimal Hero')).toBeInTheDocument()
            expect(screen.queryByRole('link')).not.toBeInTheDocument()
        })
    })
})

describe('HeroCenteredEditor Component', () => {
    const mockOnSave = jest.fn()
    const mockOnCancel = jest.fn()
    const mockOnChange = jest.fn()

    const editorProps: HeroEditorProps<HeroCenteredProps> = {
        props: defaultProps,
        onSave: mockOnSave,
        onCancel: mockOnCancel,
        onChange: mockOnChange,
        isLoading: false,
        errors: {}
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Rendering', () => {
        it('renders editor sections', () => {
            render(<HeroCenteredEditor {...editorProps} />)

            expect(screen.getByText('Content')).toBeInTheDocument()
            expect(screen.getByText('Call-to-Action Buttons')).toBeInTheDocument()
            expect(screen.getByText('Background')).toBeInTheDocument()
        })

        it('renders form fields with current values', () => {
            render(<HeroCenteredEditor {...editorProps} />)

            const titleInput = screen.getByDisplayValue('Test Hero Title')
            expect(titleInput).toBeInTheDocument()

            const subtitleInput = screen.getByDisplayValue('Test Hero Subtitle')
            expect(subtitleInput).toBeInTheDocument()
        })

        it('renders preview component', () => {
            render(<HeroCenteredEditor {...editorProps} />)

            expect(screen.getByText('Preview')).toBeInTheDocument()
        })
    })

    describe('Form Interactions', () => {
        it('calls onChange when title is updated', async () => {
            render(<HeroCenteredEditor {...editorProps} />)

            const titleInput = screen.getByDisplayValue('Test Hero Title')
            fireEvent.change(titleInput, { target: { value: 'Updated Title' } })

            await waitFor(() => {
                expect(mockOnChange).toHaveBeenCalled()
            })
        })

        it('calls onSave when save button is clicked', async () => {
            render(<HeroCenteredEditor {...editorProps} />)

            const saveButton = screen.getByText('Save Changes')
            fireEvent.click(saveButton)

            await waitFor(() => {
                expect(mockOnSave).toHaveBeenCalled()
            })
        })

        it('calls onCancel when cancel button is clicked', () => {
            render(<HeroCenteredEditor {...editorProps} />)

            const cancelButton = screen.getByText('Cancel')
            fireEvent.click(cancelButton)

            expect(mockOnCancel).toHaveBeenCalled()
        })
    })

    describe('Validation', () => {
        it('shows validation errors for required fields', async () => {
            const propsWithoutTitle = {
                ...editorProps,
                props: {
                    ...defaultProps,
                    title: { text: '', tag: 'h1' as const }
                }
            }

            render(<HeroCenteredEditor {...propsWithoutTitle} />)

            const saveButton = screen.getByText('Save Changes')
            fireEvent.click(saveButton)

            await waitFor(() => {
                expect(screen.getByText('Title is required')).toBeInTheDocument()
            })
        })

        it('validates URL format for buttons', async () => {
            render(<HeroCenteredEditor {...editorProps} />)

            const urlInput = screen.getByDisplayValue('/get-started')
            fireEvent.change(urlInput, { target: { value: 'invalid-url' } })

            const saveButton = screen.getByText('Save Changes')
            fireEvent.click(saveButton)

            await waitFor(() => {
                expect(screen.getByText(/URL must start with/)).toBeInTheDocument()
            })
        })
    })

    describe('Field Dependencies', () => {
        it('shows button URL field when button text is provided', () => {
            render(<HeroCenteredEditor {...editorProps} />)

            const primaryButtonText = screen.getByDisplayValue('Get Started')
            expect(primaryButtonText).toBeInTheDocument()

            const primaryButtonUrl = screen.getByDisplayValue('/get-started')
            expect(primaryButtonUrl).toBeInTheDocument()
        })

        it('shows background color field when color type is selected', async () => {
            render(<HeroCenteredEditor {...editorProps} />)

            const backgroundTypeSelect = screen.getByDisplayValue('gradient')
            fireEvent.change(backgroundTypeSelect, { target: { value: 'color' } })

            await waitFor(() => {
                expect(screen.getByLabelText('Background Color')).toBeInTheDocument()
            })
        })
    })
})

describe('HeroCenteredPreview Component', () => {
    describe('Rendering', () => {
        it('renders preview with default props', () => {
            render(<HeroCenteredPreview {...defaultProps} />)

            expect(screen.getByText('Test Hero Title')).toBeInTheDocument()
            expect(screen.getByText('desktop')).toBeInTheDocument() // Preview mode indicator
        })

        it('renders in different preview modes', () => {
            const { rerender } = render(
                <HeroCenteredPreview {...defaultProps} previewMode="mobile" />
            )

            expect(screen.getByText('mobile')).toBeInTheDocument()

            rerender(<HeroCenteredPreview {...defaultProps} previewMode="tablet" />)
            expect(screen.getByText('tablet')).toBeInTheDocument()

            rerender(<HeroCenteredPreview {...defaultProps} previewMode="desktop" />)
            expect(screen.getByText('desktop')).toBeInTheDocument()
        })

        it('renders without preview mode indicator when not in preview', () => {
            render(<HeroCenteredPreview {...defaultProps} isPreview={false} />)

            expect(screen.queryByText('desktop')).not.toBeInTheDocument()
        })
    })

    describe('Default Values', () => {
        it('provides default values for missing props', () => {
            const minimalProps = {
                id: 'test',
                variant: HeroVariant.CENTERED,
                theme: getDefaultThemeConfig(),
                responsive: getDefaultResponsiveConfig(),
                accessibility: getDefaultAccessibilityConfig(),
                background: { type: 'none' as const },
                textAlign: 'center' as const
            }

            render(<HeroCenteredPreview {...minimalProps} />)

            expect(screen.getByText('Welcome to Your Website')).toBeInTheDocument()
            expect(screen.getByText('Get Started')).toBeInTheDocument()
        })
    })
})

describe('Integration Tests', () => {
    it('editor updates are reflected in preview', async () => {
        const TestWrapper = () => {
            const [props, setProps] = React.useState(defaultProps)

            return (
                <div>
                    <HeroCenteredEditor
                        props={props}
                        onSave={jest.fn()}
                        onCancel={jest.fn()}
                        onChange={(newProps) => setProps({ ...props, ...newProps })}
                    />
                </div>
            )
        }

        render(<TestWrapper />)

        const titleInput = screen.getByDisplayValue('Test Hero Title')
        fireEvent.change(titleInput, { target: { value: 'Updated Hero Title' } })

        await waitFor(() => {
            expect(screen.getByText('Updated Hero Title')).toBeInTheDocument()
        })
    })

    it('handles theme integration correctly', () => {
        const customTheme = {
            ...getDefaultThemeConfig(),
            primaryColor: '#ff0000',
            backgroundColor: '#000000'
        }

        const themedProps = {
            ...defaultProps,
            theme: customTheme
        }

        render(<HeroCentered {...themedProps} />)

        const heroSection = screen.getByRole('region')
        expect(heroSection).toBeInTheDocument()
    })
})