import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { HeroCenteredEditor } from '../HeroCenteredEditor'
import { HeroEditorProps, HeroCenteredProps, HeroVariant } from '../../types'
import {
  getDefaultThemeConfig,
  getDefaultResponsiveConfig,
  getDefaultAccessibilityConfig
} from '../../utils'

describe('HeroCenteredEditor', () => {
  const mockOnSave = vi.fn()
  const mockOnCancel = vi.fn()
  const mockOnChange = vi.fn()

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

  const editorProps: HeroEditorProps<HeroCenteredProps> = {
    props: defaultProps,
    onSave: mockOnSave,
    onCancel: mockOnCancel,
    onChange: mockOnChange,
    isLoading: false,
    errors: {}
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders all editor sections', () => {
      render(<HeroCenteredEditor {...editorProps} />)

      expect(screen.getByText('Content')).toBeInTheDocument()
      expect(screen.getByText('Call-to-Action Buttons')).toBeInTheDocument()
      expect(screen.getByText('Background')).toBeInTheDocument()
      expect(screen.getByText('Layout')).toBeInTheDocument()
    })

    it('renders form fields with current values', () => {
      render(<HeroCenteredEditor {...editorProps} />)

      expect(screen.getByDisplayValue('Test Hero Title')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Hero Subtitle')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test hero description content')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Get Started')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Learn More')).toBeInTheDocument()
    })

    it('renders action buttons', () => {
      render(<HeroCenteredEditor {...editorProps} />)

      expect(screen.getByText('Save Changes')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('shows loading state when isLoading is true', () => {
      render(<HeroCenteredEditor {...editorProps} isLoading={true} />)

      const saveButton = screen.getByText('Save Changes')
      expect(saveButton).toBeDisabled()
    })
  })

  describe('Form Interactions', () => {
    it('calls onChange when title is updated', async () => {
      const user = userEvent.setup()
      render(<HeroCenteredEditor {...editorProps} />)

      const titleInput = screen.getByDisplayValue('Test Hero Title')
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Title')

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            title: expect.objectContaining({
              text: 'Updated Title'
            })
          })
        )
      })
    })

    it('calls onChange when subtitle is updated', async () => {
      const user = userEvent.setup()
      render(<HeroCenteredEditor {...editorProps} />)

      const subtitleInput = screen.getByDisplayValue('Test Hero Subtitle')
      await user.clear(subtitleInput)
      await user.type(subtitleInput, 'Updated Subtitle')

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            subtitle: expect.objectContaining({
              text: 'Updated Subtitle'
            })
          })
        )
      })
    })

    it('calls onChange when description is updated', async () => {
      const user = userEvent.setup()
      render(<HeroCenteredEditor {...editorProps} />)

      const descriptionInput = screen.getByDisplayValue('Test hero description content')
      await user.clear(descriptionInput)
      await user.type(descriptionInput, 'Updated description')

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            description: expect.objectContaining({
              text: 'Updated description'
            })
          })
        )
      })
    })

    it('calls onChange when primary button text is updated', async () => {
      const user = userEvent.setup()
      render(<HeroCenteredEditor {...editorProps} />)

      const buttonInput = screen.getByDisplayValue('Get Started')
      await user.clear(buttonInput)
      await user.type(buttonInput, 'Start Now')

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            primaryButton: expect.objectContaining({
              text: 'Start Now'
            })
          })
        )
      })
    })

    it('calls onChange when text alignment is changed', async () => {
      const user = userEvent.setup()
      render(<HeroCenteredEditor {...editorProps} />)

      const alignmentSelect = screen.getByDisplayValue('center')
      await user.selectOptions(alignmentSelect, 'left')

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            textAlign: 'left'
          })
        )
      })
    })

    it('calls onSave when save button is clicked', async () => {
      const user = userEvent.setup()
      render(<HeroCenteredEditor {...editorProps} />)

      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      expect(mockOnSave).toHaveBeenCalledWith(defaultProps)
    })

    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<HeroCenteredEditor {...editorProps} />)

      const cancelButton = screen.getByText('Cancel')
      await user.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalled()
    })
  })

  describe('Background Configuration', () => {
    it('shows color picker when background type is color', async () => {
      const user = userEvent.setup()
      const colorBackgroundProps = {
        ...editorProps,
        props: {
          ...defaultProps,
          background: {
            type: 'color' as const,
            color: '#ff0000'
          }
        }
      }

      render(<HeroCenteredEditor {...colorBackgroundProps} />)

      const backgroundTypeSelect = screen.getByDisplayValue('color')
      expect(backgroundTypeSelect).toBeInTheDocument()
      expect(screen.getByLabelText('Background Color')).toBeInTheDocument()
    })

    it('shows gradient controls when background type is gradient', () => {
      render(<HeroCenteredEditor {...editorProps} />)

      const backgroundTypeSelect = screen.getByDisplayValue('gradient')
      expect(backgroundTypeSelect).toBeInTheDocument()
      expect(screen.getByText('Gradient Colors')).toBeInTheDocument()
    })

    it('shows image picker when background type is image', async () => {
      const user = userEvent.setup()
      const imageBackgroundProps = {
        ...editorProps,
        props: {
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
      }

      render(<HeroCenteredEditor {...imageBackgroundProps} />)

      const backgroundTypeSelect = screen.getByDisplayValue('image')
      expect(backgroundTypeSelect).toBeInTheDocument()
      expect(screen.getByTestId('media-picker')).toBeInTheDocument()
    })
  })

  describe('Validation', () => {
    it('shows validation errors', () => {
      const propsWithErrors = {
        ...editorProps,
        errors: {
          'title.text': 'Title is required',
          'primaryButton.url': 'Invalid URL format'
        }
      }

      render(<HeroCenteredEditor {...propsWithErrors} />)

      expect(screen.getByText('Title is required')).toBeInTheDocument()
      expect(screen.getByText('Invalid URL format')).toBeInTheDocument()
    })

    it('validates required fields on save', async () => {
      const user = userEvent.setup()
      const propsWithoutTitle = {
        ...editorProps,
        props: {
          ...defaultProps,
          title: { text: '', tag: 'h1' as const }
        }
      }

      render(<HeroCenteredEditor {...propsWithoutTitle} />)

      const saveButton = screen.getByText('Save Changes')
      await user.click(saveButton)

      // Should not call onSave if validation fails
      expect(mockOnSave).not.toHaveBeenCalled()
    })
  })

  describe('Button Configuration', () => {
    it('shows secondary button fields when secondary button exists', () => {
      render(<HeroCenteredEditor {...editorProps} />)

      expect(screen.getByDisplayValue('Learn More')).toBeInTheDocument()
      expect(screen.getByDisplayValue('/learn-more')).toBeInTheDocument()
    })

    it('allows removing secondary button', async () => {
      const user = userEvent.setup()
      render(<HeroCenteredEditor {...editorProps} />)

      const removeSecondaryButton = screen.getByText('Remove Secondary Button')
      await user.click(removeSecondaryButton)

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            secondaryButton: undefined
          })
        )
      })
    })

    it('allows adding secondary button when not present', async () => {
      const user = userEvent.setup()
      const propsWithoutSecondary = {
        ...editorProps,
        props: {
          ...defaultProps,
          secondaryButton: undefined
        }
      }

      render(<HeroCenteredEditor {...propsWithoutSecondary} />)

      const addSecondaryButton = screen.getByText('Add Secondary Button')
      await user.click(addSecondaryButton)

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            secondaryButton: expect.objectContaining({
              text: 'Learn More',
              style: 'outline'
            })
          })
        )
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(<HeroCenteredEditor {...editorProps} />)

      expect(screen.getByLabelText('Title')).toBeInTheDocument()
      expect(screen.getByLabelText('Subtitle')).toBeInTheDocument()
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
      expect(screen.getByLabelText('Primary Button Text')).toBeInTheDocument()
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<HeroCenteredEditor {...editorProps} />)

      const titleInput = screen.getByLabelText('Title')
      await user.tab()
      
      expect(document.activeElement).toBe(titleInput)
    })

    it('has proper ARIA attributes', () => {
      render(<HeroCenteredEditor {...editorProps} />)

      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('aria-label', 'Hero Section Editor')
    })
  })
})