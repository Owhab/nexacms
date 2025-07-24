import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { HeroMinimal } from '../HeroMinimal'
import { HeroMinimalEditor } from '../../editors/HeroMinimalEditor'
import { HeroMinimalPreview } from '../../previews/HeroMinimalPreview'
import {
    HeroMinimalProps,
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

describe('HeroMinimal Component', () => {
    const defaultProps: HeroMinimalProps = {
        id: 'test-hero-minimal',
        variant: HeroVariant.MINIMAL,
        theme: getDefaultThemeConfig(),
        responsive: getDefaultResponsiveConfig(),
        accessibility: getDefaultAccessibilityConfig(),
        title: {
            text: 'Simple. Clean. Effective.',
            tag: 'h1'
        },
        subtitle: {
            text: 'Sometimes less is more',
            tag: 'p'
        },
        button: {
            text: 'Get Started',
            url: '/get-started',
            style: 'primary',
            size: 'md',
            iconPosition: 'right',
            target: '_self'
        },
        background: {
            type: 'none',
            overlay: {
                enabled: false,
                color: '#ffffff',
                opacity: 0.8
            }
        },
        spacing: 'normal'
    }

    describe('Rendering', () => {
        it('renders with required props only', () => {
            const minimalProps: HeroMinimalProps = {
                ...defaultProps,
                subtitle: undefined,
                button: undefined
            }

            render(<HeroMinimal {...minimalProps} />)

            expect(screen.getByText('Simple. Clean. Effective.')).toBeTruthy()
            expect(screen.queryByText('Less is more')).toBeFalsy()
        })

        it('renders all content elements when provided', () => {
            render(<HeroMinimal {...defaultProps} />)

            expect(screen.getByText('Simple. Clean. Effective.')).toBeTruthy()
            expect(screen.getByText('Sometimes less is more')).toBeTruthy()
            expect(screen.getByText('Get Started')).toBeTruthy()
        })

        it('applies correct HTML tags to text elements', () => {
            render(<HeroMinimal {...defaultProps} />)

            const title = screen.getByRole('heading', { level: 1 })
            expect(title.textContent).toBe('Simple. Clean. Effective.')

            // Subtitle should be a paragraph, not a heading in minimal design
            const subtitle = screen.getByText('Sometimes less is more')
            expect(subtitle.tagName).toBe('P')
        })

        it('renders button with correct attributes', () => {
            render(<HeroMinimal {...defaultProps} />)

            const button = screen.getByRole('link', { name: 'Get Started' })
            expect(button.getAttribute('href')).toBe('/get-started')
            expect(button.getAttribute('target')).toBe('_self')
        })
    })

    describe('Typography and Minimal Design', () => {
        it('applies minimal typography classes to title', () => {
            render(<HeroMinimal {...defaultProps} />)

            const title = screen.getByRole('heading', { level: 1 })
            expect(title.className).toContain('font-light')
            expect(title.className).toContain('tracking-tight')
        })

        it('applies proper text sizing classes', () => {
            render(<HeroMinimal {...defaultProps} />)

            const title = screen.getByRole('heading', { level: 1 })
            expect(title.className).toContain('text-4xl', 'md:text-5xl', 'lg:text-6xl')

            const subtitle = screen.getByText('Sometimes less is more')
            expect(subtitle.className).toContain('text-lg', 'md:text-xl')
        })

        it('centers content properly', () => {
            render(<HeroMinimal {...defaultProps} />)

            const contentContainer = screen.getByText('Simple. Clean. Effective.').closest('.text-center')
            expect(contentContainer).toBeTruthy()
        })

        it('applies max-width constraint for readability', () => {
            render(<HeroMinimal {...defaultProps} />)

            const contentContainer = screen.getByText('Simple. Clean. Effective.').closest('.max-w-xl')
            expect(contentContainer).toBeTruthy()
        })
    })

    describe('Spacing Variants', () => {
        it('applies compact spacing', () => {
            const compactProps = { ...defaultProps, spacing: 'compact' as const }
            render(<HeroMinimal {...compactProps} />)

            const contentContainer = screen.getByText('Simple. Clean. Effective.').closest('.space-y-4')
            expect(contentContainer).toBeTruthy()

            const heroSection = screen.getByRole('region')
            expect(heroSection.querySelector('.py-12')).toBeTruthy()
        })

        it('applies normal spacing by default', () => {
            render(<HeroMinimal {...defaultProps} />)

            const contentContainer = screen.getByText('Simple. Clean. Effective.').closest('.space-y-6')
            expect(contentContainer).toBeTruthy()

            const heroSection = screen.getByRole('region')
            expect(heroSection.querySelector('.py-16')).toBeTruthy()
        })

        it('applies spacious spacing', () => {
            const spaciousProps = { ...defaultProps, spacing: 'spacious' as const }
            render(<HeroMinimal {...spaciousProps} />)

            const contentContainer = screen.getByText('Simple. Clean. Effective.').closest('.space-y-8')
            expect(contentContainer).toBeTruthy()

            const heroSection = screen.getByRole('region')
            expect(heroSection.querySelector('.py-24')).toBeTruthy()
        })
    })

    describe('Background Handling', () => {
        it('renders with no background by default', () => {
            render(<HeroMinimal {...defaultProps} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toBeTruthy()
        })

        it('renders subtle color background', () => {
            const colorBackgroundProps = {
                ...defaultProps,
                background: {
                    type: 'color' as const,
                    color: '#f8fafc'
                }
            }

            render(<HeroMinimal {...colorBackgroundProps} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toBeTruthy()
        })

        it('renders soft gradient background', () => {
            const gradientBackgroundProps = {
                ...defaultProps,
                background: {
                    type: 'gradient' as const,
                    gradient: {
                        type: 'linear' as const,
                        direction: '180deg',
                        colors: [
                            { color: '#ffffff', stop: 0 },
                            { color: '#f8fafc', stop: 100 }
                        ]
                    }
                }
            }

            render(<HeroMinimal {...gradientBackgroundProps} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toBeTruthy()
        })

        it('renders minimal image background with overlay', () => {
            const imageBackgroundProps = {
                ...defaultProps,
                background: {
                    type: 'image' as const,
                    image: {
                        id: 'bg-image',
                        url: '/minimal-bg.jpg',
                        type: 'image' as const,
                        alt: 'Minimal background',
                        objectFit: 'cover' as const,
                        loading: 'lazy' as const
                    },
                    overlay: {
                        enabled: true,
                        color: '#ffffff',
                        opacity: 0.9
                    }
                }
            }

            render(<HeroMinimal {...imageBackgroundProps} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection).toBeTruthy()
        })
    })

    describe('Accessibility', () => {
        it('has proper ARIA labels', () => {
            render(<HeroMinimal {...defaultProps} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection.getAttribute('aria-label')).toBeTruthy()
        })

        it('supports keyboard navigation', () => {
            render(<HeroMinimal {...defaultProps} />)

            const button = screen.getByRole('link', { name: 'Get Started' })
            expect(button.style.display).not.toBe("none")

            // Test keyboard focus
            button.focus()
            expect(document.activeElement).toBe(button)
        })

        it('has proper heading hierarchy', () => {
            render(<HeroMinimal {...defaultProps} />)

            const h1 = screen.getByRole('heading', { level: 1 })
            expect(h1).toBeTruthy()

            // In minimal design, subtitle should not be a heading
            expect(screen.queryByRole('heading', { level: 2 })).toBeFalsy()
        })

        it('provides meaningful text content', () => {
            render(<HeroMinimal {...defaultProps} />)

            const title = screen.getByRole('heading', { level: 1 })
            expect(title.textContent).toBe('Simple. Clean. Effective.')

            const subtitle = screen.getByText('Sometimes less is more')
            expect(subtitle).toBeTruthy()
        })
    })

    describe('Responsive Behavior', () => {
        it('applies responsive classes', () => {
            render(<HeroMinimal {...defaultProps} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection.className).toContain('hero-section')
            expect(heroSection.className).toContain('hero-section--minimal')
        })

        it('handles missing optional props gracefully', () => {
            const minimalProps: HeroMinimalProps = {
                id: 'minimal-hero',
                variant: HeroVariant.MINIMAL,
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
                spacing: 'normal'
            }

            render(<HeroMinimal {...minimalProps} />)

            expect(screen.getByText('Minimal Hero')).toBeTruthy()
            expect(screen.queryByText('Sometimes less is more')).toBeFalsy()
        })
    })

    describe('Minimal Design Principles', () => {
        it('maintains clean visual hierarchy', () => {
            render(<HeroMinimal {...defaultProps} />)

            const title = screen.getByRole('heading', { level: 1 })
            const subtitle = screen.getByText('Sometimes less is more')
            const button = screen.getByRole('link', { name: 'Get Started' })

            // Check that elements are properly spaced
            expect(title).toBeTruthy()
            expect(subtitle).toBeTruthy()
            expect(button).toBeTruthy()
        })

        it('uses appropriate whitespace', () => {
            render(<HeroMinimal {...defaultProps} />)

            const heroSection = screen.getByRole('region')
            expect(heroSection.querySelector('.min-h-\\[400px\\]')).toBeTruthy()
        })

        it('limits content width for readability', () => {
            render(<HeroMinimal {...defaultProps} />)

            const contentContainer = screen.getByText('Simple. Clean. Effective.').closest('.max-w-xl')
            expect(contentContainer).toBeTruthy()
        })
    })
})

describe('HeroMinimalEditor Component', () => {
    const mockOnSave = jest.fn()
    const mockOnCancel = jest.fn()
    const mockOnChange = jest.fn()

    const editorProps: HeroEditorProps<HeroMinimalProps> = {
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
            render(<HeroMinimalEditor {...editorProps} />)

            expect(screen.getByText('Content')).toBeTruthy()
            expect(screen.getByText('Call-to-Action')).toBeTruthy()
            expect(screen.getByText('Background')).toBeTruthy()
        })

        it('renders form fields with current values', () => {
            render(<HeroMinimalEditor {...editorProps} />)

            const titleInput = screen.getByDisplayValue('Simple. Clean. Effective.')
            expect(titleInput).toBeTruthy()

            const subtitleInput = screen.getByDisplayValue('Sometimes less is more')
            expect(subtitleInput).toBeTruthy()

            const buttonTextInput = screen.getByDisplayValue('Get Started')
            expect(buttonTextInput).toBeTruthy()
        })

        it('renders spacing control', () => {
            render(<HeroMinimalEditor {...editorProps} />)

            const spacingSelect = screen.getByDisplayValue('normal')
            expect(spacingSelect).toBeTruthy()
        })

        it('renders preview component', () => {
            render(<HeroMinimalEditor {...editorProps} />)

            expect(screen.getByText('Preview')).toBeTruthy()
        })
    })

    describe('Form Interactions', () => {
        it('calls onChange when title is updated', async () => {
            render(<HeroMinimalEditor {...editorProps} />)

            const titleInput = screen.getByDisplayValue('Simple. Clean. Effective.')
            fireEvent.change(titleInput, { target: { value: 'New Minimal Title' } })

            await waitFor(() => {
                expect(mockOnChange).toHaveBeenCalled()
            })
        })

        it('calls onChange when spacing is changed', async () => {
            render(<HeroMinimalEditor {...editorProps} />)

            const spacingSelect = screen.getByDisplayValue('normal')
            fireEvent.change(spacingSelect, { target: { value: 'spacious' } })

            await waitFor(() => {
                expect(mockOnChange).toHaveBeenCalled()
            })
        })

        it('calls onSave when save button is clicked', async () => {
            render(<HeroMinimalEditor {...editorProps} />)

            const saveButton = screen.getByText('Save Changes')
            fireEvent.click(saveButton)

            await waitFor(() => {
                expect(mockOnSave).toHaveBeenCalled()
            })
        })

        it('calls onCancel when cancel button is clicked', () => {
            render(<HeroMinimalEditor {...editorProps} />)

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

            render(<HeroMinimalEditor {...propsWithoutTitle} />)

            const saveButton = screen.getByText('Save Changes')
            fireEvent.click(saveButton)

            await waitFor(() => {
                expect(screen.getByText('Title is required')).toBeTruthy()
            })
        })

        it('validates title length for minimal design', async () => {
            const propsWithLongTitle = {
                ...editorProps,
                props: {
                    ...defaultProps,
                    title: { 
                        text: 'This is a very long title that exceeds the recommended character limit for minimal design principles and should trigger validation error',
                        tag: 'h1' as const 
                    }
                }
            }

            render(<HeroMinimalEditor {...propsWithLongTitle} />)

            const saveButton = screen.getByText('Save Changes')
            fireEvent.click(saveButton)

            await waitFor(() => {
                expect(screen.getByText('Title should be concise (max 80 characters)')).toBeTruthy()
            })
        })

        it('validates button text length', async () => {
            render(<HeroMinimalEditor {...editorProps} />)

            const buttonTextInput = screen.getByDisplayValue('Get Started')
            fireEvent.change(buttonTextInput, { target: { value: 'This is a very long button text that exceeds the limit' } })

            const saveButton = screen.getByText('Save Changes')
            fireEvent.click(saveButton)

            await waitFor(() => {
                expect(screen.getByText('Button text should be concise (max 25 characters)')).toBeTruthy()
            })
        })

        it('validates URL format for button', async () => {
            render(<HeroMinimalEditor {...editorProps} />)

            const urlInput = screen.getByDisplayValue('/get-started')
            fireEvent.change(urlInput, { target: { value: 'invalid-url' } })

            const saveButton = screen.getByText('Save Changes')
            fireEvent.click(saveButton)

            await waitFor(() => {
                expect(screen.getByText(/URL must start with/)).toBeTruthy()
            })
        })
    })

    describe('Field Dependencies', () => {
        it('shows button URL field when button text is provided', () => {
            render(<HeroMinimalEditor {...editorProps} />)

            const buttonText = screen.getByDisplayValue('Get Started')
            expect(buttonText).toBeTruthy()

            const buttonUrl = screen.getByDisplayValue('/get-started')
            expect(buttonUrl).toBeTruthy()
        })

        it('shows background color field when color type is selected', async () => {
            render(<HeroMinimalEditor {...editorProps} />)

            const backgroundTypeSelect = screen.getByDisplayValue('none')
            fireEvent.change(backgroundTypeSelect, { target: { value: 'color' } })

            await waitFor(() => {
                expect(screen.getByLabelText('Background Color')).toBeTruthy()
            })
        })

        it('shows overlay controls when background type is not none', async () => {
            render(<HeroMinimalEditor {...editorProps} />)

            const backgroundTypeSelect = screen.getByDisplayValue('none')
            fireEvent.change(backgroundTypeSelect, { target: { value: 'color' } })

            await waitFor(() => {
                expect(screen.getByLabelText('Enable Overlay')).toBeTruthy()
            })
        })
    })

    describe('Minimal Design Guidance', () => {
        it('provides helpful text for minimal design principles', () => {
            render(<HeroMinimalEditor {...editorProps} />)

            expect(screen.getByText('Keep it simple and impactful - this is the main focus')).toBeTruthy()
            expect(screen.getByText('Optional supporting text - keep it minimal')).toBeTruthy()
            expect(screen.getByText('Control the whitespace and breathing room')).toBeTruthy()
        })

        it('suggests appropriate default values for minimal design', () => {
            render(<HeroMinimalEditor {...editorProps} />)

            const backgroundTypeSelect = screen.getByDisplayValue('none')
            expect(backgroundTypeSelect).toBeTruthy()

            const spacingSelect = screen.getByDisplayValue('normal')
            expect(spacingSelect).toBeTruthy()
        })
    })
})

describe('HeroMinimalPreview Component', () => {
    describe('Rendering', () => {
        it('renders preview with default props', () => {
            render(<HeroMinimalPreview {...defaultProps} />)

            expect(screen.getByText('Simple. Clean. Effective.')).toBeTruthy()
            expect(screen.getByText('desktop')).toBeTruthy() // Preview mode indicator
        })

        it('renders in different preview modes', () => {
            const { rerender } = render(
                <HeroMinimalPreview {...defaultProps} previewMode="mobile" />
            )

            expect(screen.getByText('mobile')).toBeTruthy()

            rerender(<HeroMinimalPreview {...defaultProps} previewMode="tablet" />)
            expect(screen.getByText('tablet')).toBeTruthy()

            rerender(<HeroMinimalPreview {...defaultProps} previewMode="desktop" />)
            expect(screen.getByText('desktop')).toBeTruthy()
        })

        it('renders without preview mode indicator when not in preview', () => {
            render(<HeroMinimalPreview {...defaultProps} isPreview={false} />)

            expect(screen.queryByText('Preview Mode')).toBeFalsy()
        })
    })

    describe('Default Values', () => {
        it('provides default values for missing props', () => {
            const minimalProps = {
                id: 'test',
                variant: HeroVariant.MINIMAL,
                theme: getDefaultThemeConfig(),
                responsive: getDefaultResponsiveConfig(),
                accessibility: getDefaultAccessibilityConfig(),
                background: { type: 'none' as const },
                spacing: 'normal' as const
            }

            render(<HeroMinimalPreview {...minimalProps} />)

            expect(screen.getByText('Simple. Clean. Effective.')).toBeTruthy()
            expect(screen.getByText('Sometimes less is more')).toBeTruthy()
            expect(screen.getByText('Get Started')).toBeTruthy()
        })

        it('handles missing button gracefully', () => {
            const propsWithoutButton = {
                ...defaultProps,
                button: undefined
            }

            render(<HeroMinimalPreview {...propsWithoutButton} />)

            expect(screen.getByText('Simple. Clean. Effective.')).toBeTruthy()
            expect(screen.getByText('Get Started')).toBeTruthy() // Default button
        })
    })

    describe('Minimal Design Rendering', () => {
        it('applies minimal height constraint', () => {
            render(<HeroMinimalPreview {...defaultProps} />)

            const previewWrapper = screen.getByText('Simple. Clean. Effective.').closest('.preview-wrapper')
            expect(previewWrapper).toBeTruthy()
        })

        it('maintains clean typography in preview', () => {
            render(<HeroMinimalPreview {...defaultProps} />)

            const title = screen.getByRole('heading', { level: 1 })
            expect(title.className).toContain('font-light')
        })
    })
})

describe('Integration Tests', () => {
    it('editor updates are reflected in preview', async () => {
        const TestWrapper = () => {
            const [props, setProps] = React.useState(defaultProps)

            return (
                <div>
                    <HeroMinimalEditor
                        props={props}
                        onSave={jest.fn()}
                        onCancel={jest.fn()}
                        onChange={(newProps) => setProps({ ...props, ...newProps })}
                    />
                </div>
            )
        }

        render(<TestWrapper />)

        const titleInput = screen.getByDisplayValue('Simple. Clean. Effective.')
        fireEvent.change(titleInput, { target: { value: 'Updated Minimal Title' } })

        await waitFor(() => {
            expect(screen.getByText('Updated Minimal Title')).toBeTruthy()
        })
    })

    it('spacing changes are reflected in preview', async () => {
        const TestWrapper = () => {
            const [props, setProps] = React.useState(defaultProps)

            return (
                <div>
                    <HeroMinimalEditor
                        props={props}
                        onSave={jest.fn()}
                        onCancel={jest.fn()}
                        onChange={(newProps) => setProps({ ...props, ...newProps })}
                    />
                </div>
            )
        }

        render(<TestWrapper />)

        const spacingSelect = screen.getByDisplayValue('normal')
        fireEvent.change(spacingSelect, { target: { value: 'spacious' } })

        await waitFor(() => {
            // Check that the preview updates with new spacing
            const heroSection = screen.getByRole('region')
            expect(heroSection).toBeTruthy()
        })
    })

    it('handles theme integration correctly', () => {
        const customTheme = {
            ...getDefaultThemeConfig(),
            primaryColor: '#2563eb',
            backgroundColor: '#f8fafc',
            textColor: '#1e293b'
        }

        const themedProps = {
            ...defaultProps,
            theme: customTheme
        }

        render(<HeroMinimal {...themedProps} />)

        const heroSection = screen.getByRole('region')
        expect(heroSection).toBeTruthy()
    })

    it('maintains minimal design principles across all components', () => {
        render(
            <div>
                <HeroMinimal {...defaultProps} />
                <HeroMinimalPreview {...defaultProps} />
            </div>
        )

        const titles = screen.getAllByText('Simple. Clean. Effective.')
        expect(titles).toHaveLength(2)

        titles.forEach(title => {
            expect(title.className).toContain('font-light')
            expect(title.className).toContain('tracking-tight')
        })
    })
})