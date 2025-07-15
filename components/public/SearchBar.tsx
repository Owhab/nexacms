'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchBar() {
    const [query, setQuery] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/pages/search?q=${encodeURIComponent(query.trim())}`)
            setQuery('')
            setIsExpanded(false)
        }
    }

    return (
        <div className="relative">
            <form onSubmit={handleSearch} className="flex items-center">
                {isExpanded ? (
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search pages..."
                        className="w-full sm:w-64 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                        onBlur={() => {
                            if (!query) setIsExpanded(false)
                        }}
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                        aria-label="Search"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                )}
            </form>
        </div>
    )
}