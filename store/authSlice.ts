import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User, UserRole } from '@/lib/types'

interface AuthState {
    user: User | null
    loading: boolean
    error: string | null
    isAuthenticated: boolean
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false
}

// Async thunks for API calls
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/auth/me')
            if (response.ok) {
                const data = await response.json()
                return data.user
            } else {
                return rejectWithValue('Not authenticated')
            }
        } catch (error) {
            return rejectWithValue('Auth check failed')
        }
    }
)

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            if (response.ok) {
                const data = await response.json()
                return data.user
            } else {
                const errorData = await response.json()
                return rejectWithValue(errorData.error || 'Login failed')
            }
        } catch (error) {
            return rejectWithValue('Network error')
        }
    }
)

export const register = createAsyncThunk(
    'auth/register',
    async ({ email, password, role }: { email: string; password: string; role?: UserRole }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role }),
            })

            if (response.ok) {
                const data = await response.json()
                return data.user
            } else {
                const errorData = await response.json()
                return rejectWithValue(errorData.error || 'Registration failed')
            }
        } catch (error) {
            return rejectWithValue('Network error')
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            return null
        } catch (error) {
            return rejectWithValue('Logout failed')
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        }
    },
    extraReducers: (builder) => {
        // Check Auth
        builder
            .addCase(checkAuth.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
                state.isAuthenticated = !!action.payload
                state.error = null
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.loading = false
                state.user = null
                state.isAuthenticated = false
                state.error = action.payload as string
            })

        // Login
        builder
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
                state.isAuthenticated = true
                state.error = null
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.user = null
                state.isAuthenticated = false
                state.error = action.payload as string
            })

        // Register
        builder
            .addCase(register.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
                state.isAuthenticated = true
                state.error = null
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false
                state.user = null
                state.isAuthenticated = false
                state.error = action.payload as string
            })

        // Logout
        builder
            .addCase(logout.pending, (state) => {
                state.loading = true
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false
                state.user = null
                state.isAuthenticated = false
                state.error = null
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export const { clearError, setLoading } = authSlice.actions
export default authSlice.reducer