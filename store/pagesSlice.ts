import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface Page {
    id: string
    title: string
    slug: string
    status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED'
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    createdAt: string
    updatedAt: string
    publishedAt?: string
    sections: PageSection[]
}

interface PageSection {
    id: string
    pageId: string
    sectionTemplateId: string
    order: number
    props: any
    createdAt: string
    updatedAt: string
    sectionTemplate: SectionTemplate
}

interface SectionTemplate {
    id: string
    name: string
    componentName: string
    defaultProps: any
    description?: string
}

interface PagesState {
    pages: Page[]
    currentPage: Page | null
    sectionTemplates: SectionTemplate[]
    loading: boolean
    error: string | null
}

const initialState: PagesState = {
    pages: [],
    currentPage: null,
    sectionTemplates: [],
    loading: false,
    error: null
}

// Async thunks
export const fetchPages = createAsyncThunk(
    'pages/fetchPages',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/pages')
            if (response.ok) {
                const data = await response.json()
                return data.pages
            } else {
                return rejectWithValue('Failed to fetch pages')
            }
        } catch (error) {
            return rejectWithValue('Network error')
        }
    }
)

export const fetchPage = createAsyncThunk(
    'pages/fetchPage',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/pages/${id}`)
            if (response.ok) {
                const data = await response.json()
                return data.page
            } else {
                return rejectWithValue('Failed to fetch page')
            }
        } catch (error) {
            return rejectWithValue('Network error')
        }
    }
)

export const createPage = createAsyncThunk(
    'pages/createPage',
    async (pageData: { title: string; slug: string; seoTitle?: string; seoDescription?: string; seoKeywords?: string }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/pages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pageData),
            })

            if (response.ok) {
                const data = await response.json()
                return data.page
            } else {
                const errorData = await response.json()
                return rejectWithValue(errorData.error || 'Failed to create page')
            }
        } catch (error) {
            return rejectWithValue('Network error')
        }
    }
)

export const updatePage = createAsyncThunk(
    'pages/updatePage',
    async ({ id, ...pageData }: { id: string; title?: string; slug?: string; seoTitle?: string; seoDescription?: string; seoKeywords?: string; status?: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/pages/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pageData),
            })

            if (response.ok) {
                const data = await response.json()
                return data.page
            } else {
                const errorData = await response.json()
                return rejectWithValue(errorData.error || 'Failed to update page')
            }
        } catch (error) {
            return rejectWithValue('Network error')
        }
    }
)

export const deletePage = createAsyncThunk(
    'pages/deletePage',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/pages/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                return id
            } else {
                return rejectWithValue('Failed to delete page')
            }
        } catch (error) {
            return rejectWithValue('Network error')
        }
    }
)

export const fetchSectionTemplates = createAsyncThunk(
    'pages/fetchSectionTemplates',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/section-templates')
            if (response.ok) {
                const data = await response.json()
                return data.templates
            } else {
                return rejectWithValue('Failed to fetch section templates')
            }
        } catch (error) {
            return rejectWithValue('Network error')
        }
    }
)

export const addSection = createAsyncThunk(
    'pages/addSection',
    async ({ pageId, sectionTemplateId, props }: { pageId: string; sectionTemplateId: string; props?: any }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/pages/${pageId}/sections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sectionTemplateId, props }),
            })

            if (response.ok) {
                const data = await response.json()
                return data.section
            } else {
                const errorData = await response.json()
                return rejectWithValue(errorData.error || 'Failed to add section')
            }
        } catch (error) {
            return rejectWithValue('Network error')
        }
    }
)

export const updateSection = createAsyncThunk(
    'pages/updateSection',
    async ({ id, props, order }: { id: string; props?: any; order?: number }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/sections/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ props, order }),
            })

            if (response.ok) {
                const data = await response.json()
                return data.section
            } else {
                const errorData = await response.json()
                return rejectWithValue(errorData.error || 'Failed to update section')
            }
        } catch (error) {
            return rejectWithValue('Network error')
        }
    }
)

export const deleteSection = createAsyncThunk(
    'pages/deleteSection',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/sections/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                return id
            } else {
                return rejectWithValue('Failed to delete section')
            }
        } catch (error) {
            return rejectWithValue('Network error')
        }
    }
)

const pagesSlice = createSlice({
    name: 'pages',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        setCurrentPage: (state, action: PayloadAction<Page | null>) => {
            state.currentPage = action.payload
        }
    },
    extraReducers: (builder) => {
        // Fetch Pages
        builder
            .addCase(fetchPages.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPages.fulfilled, (state, action) => {
                state.loading = false
                state.pages = action.payload
                state.error = null
            })
            .addCase(fetchPages.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

        // Fetch Page
        builder
            .addCase(fetchPage.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPage.fulfilled, (state, action) => {
                state.loading = false
                state.currentPage = action.payload
                state.error = null
            })
            .addCase(fetchPage.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

        // Create Page
        builder
            .addCase(createPage.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createPage.fulfilled, (state, action) => {
                state.loading = false
                state.pages.unshift(action.payload)
                state.currentPage = action.payload
                state.error = null
            })
            .addCase(createPage.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

        // Update Page
        builder
            .addCase(updatePage.fulfilled, (state, action) => {
                const index = state.pages.findIndex(page => page.id === action.payload.id)
                if (index !== -1) {
                    state.pages[index] = action.payload
                }
                if (state.currentPage?.id === action.payload.id) {
                    state.currentPage = action.payload
                }
            })

        // Delete Page
        builder
            .addCase(deletePage.fulfilled, (state, action) => {
                state.pages = state.pages.filter(page => page.id !== action.payload)
                if (state.currentPage?.id === action.payload) {
                    state.currentPage = null
                }
            })

        // Fetch Section Templates
        builder
            .addCase(fetchSectionTemplates.fulfilled, (state, action) => {
                state.sectionTemplates = action.payload
            })

        // Add Section
        builder
            .addCase(addSection.fulfilled, (state, action) => {
                if (state.currentPage) {
                    state.currentPage.sections.push(action.payload)
                    state.currentPage.sections.sort((a, b) => a.order - b.order)
                }
            })

        // Update Section
        builder
            .addCase(updateSection.fulfilled, (state, action) => {
                if (state.currentPage) {
                    const index = state.currentPage.sections.findIndex(section => section.id === action.payload.id)
                    if (index !== -1) {
                        state.currentPage.sections[index] = action.payload
                        state.currentPage.sections.sort((a, b) => a.order - b.order)
                    }
                }
            })

        // Delete Section
        builder
            .addCase(deleteSection.fulfilled, (state, action) => {
                if (state.currentPage) {
                    state.currentPage.sections = state.currentPage.sections.filter(section => section.id !== action.payload)
                }
            })
    }
})

export const { clearError, setCurrentPage } = pagesSlice.actions
export default pagesSlice.reducer