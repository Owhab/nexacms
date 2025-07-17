'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { UserPlusIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'

interface InvitationData {
    email: string
    role: string
    inviterName: string
    expiresAt: string
}

export default function InvitationPage({ params }: { params: { token: string } }) {
    const [invitation, setInvitation] = useState<InvitationData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [accepting, setAccepting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        confirmPassword: ''
    })
    const router = useRouter()

    useEffect(() => {
        fetchInvitation()
    }, [])

    const fetchInvitation = async () => {
        try {
            const response = await fetch(`/api/invite/${params.token}`)
            if (response.ok) {
                const data = await response.json()
                setInvitation(data.invitation)
            } else {
                const errorData = await response.json()
                setError(errorData.error || 'Invalid invitation')
            }
        } catch (err) {
            setError('Failed to load invitation')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleAcceptInvitation = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long')
            return
        }

        setAccepting(true)
        setError(null)

        try {
            const response = await fetch(`/api/invite/${params.token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    password: formData.password
                })
            })

            if (response.ok) {
                const data = await response.json()

                // Set auth cookie (this would normally be done by the API)
                document.cookie = `auth-token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`

                // Redirect to admin dashboard
                router.push('/admin?welcome=true')
            } else {
                const errorData = await response.json()
                setError(errorData.error || 'Failed to accept invitation')
            }
        } catch (err) {
            setError('Network error occurred')
        } finally {
            setAccepting(false)
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = '/api/auth/google'
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading invitation...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button onClick={() => router.push('/login')} variant="outline">
                        Go to Login
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <UserPlusIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Invited!</h1>
                    <p className="text-gray-600">
                        <strong>{invitation?.inviterName}</strong> has invited you to join NexaCMS as a{' '}
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {invitation?.role}
                        </span>
                    </p>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {invitation?.email}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        <strong>Expires:</strong> {invitation?.expiresAt ? new Date(invitation.expiresAt).toLocaleDateString() : 'Unknown'}
                    </p>
                </div>

                <form onSubmit={handleAcceptInvitation} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name (Optional)
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Create a password"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={accepting}>
                        {accepting ? 'Creating Account...' : 'Accept Invitation'}
                    </Button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-4"
                        onClick={handleGoogleLogin}
                        disabled={accepting}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </Button>
                </div>

                <div className="text-center mt-6">
                    <p className="text-xs text-gray-500">
                        By accepting this invitation, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    )
}