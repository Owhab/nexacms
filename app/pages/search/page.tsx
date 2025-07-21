'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface SearchResult {
    id: string
    title: string
    slug: string
    seoDescription?: string
    updatedAt: string
    excerpt?: string
    matchCount?: number
}

function SearchContent() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''

    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return

            setLoading(true)
            setError(null)

            try {
                const response = await fetch(`/api/public/search?q=${encodeURIComponent(query)}`)
                if (response.ok) {
                    const data = await response.json()
                    setResults(data.results)
                } else {
                    setError('Failed to fetch search results')
                }
            } catch (err) {
                setError('An error occurred while searching')
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [query])

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
                    <p className="text-gray-600">
                        {query ? `Showing results for "${query}"` : 'Enter a search term to find pages'}
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                ) : results.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            No results found
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {query
                                ? `We couldn't find any pages matching "${query}". Please try a different search term.`
                                : 'Enter a search term to find pages.'}
                        </p>
                        <Link
                            href="/pages"
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <p className="text-sm text-gray-500">
                            Found {results.length} {results.length === 1 ? 'result' : 'results'}
                        </p>

                        {results.map((result) => (
                            <div
                                key={result.id}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                                <Link href={`/pages${result.slug}`}>
                                    <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800 mb-2">
                                        {result.title}
                                    </h2>
                                </Link>

                                {result.excerpt && (
                                    <div
                                        className="text-gray-700 mb-3 prose-sm"
                                        dangerouslySetInnerHTML={{ __html: result.excerpt }}
                                    />
                                )}

                                {result.seoDescription && !result.excerpt && (
                                    <p className="text-gray-700 mb-3">{result.seoDescription}</p>
                                )}

                                <div className="flex items-center justify-between text-sm">
                                    <Link
                                        href={`/pages${result.slug}`}
                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        Read more
                                    </Link>
                                    <span className="text-gray-500">
                                        {new Date(result.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    )
}