'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
    getActiveSections,
    getSectionsByCategory,
    searchSections,
    getAllCategories,
    SECTION_CATEGORIES
} from '@/lib/sections/registry'
import { SearchIcon, XIcon, PlusIcon } from 'lucide-react'

interface SectionLibraryProps {
    isOpen: boolean
    onClose: () => void
    onAddSection: (sectionId: string) => void
}

export function SectionLibrary({ isOpen, onClose, onAddSection }: SectionLibraryProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    const sections = useMemo(() => {
        if (searchQuery) {
            return searchSections(searchQuery)
        }

        if (selectedCategory === 'all') {
            return getActiveSections()
        }

        return getSectionsByCategory(selectedCategory)
    }, [searchQuery, selectedCategory])

    const categories = getAllCategories()

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Section Library</h2>
                            <p className="text-sm text-gray-500">Choose a section to add to your page</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <XIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="p-6 border-b border-gray-200 space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search sections..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <XIcon className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedCategory === 'all'
                                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All Sections
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedCategory === category
                                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Section Grid */}
                    <div className="flex-1 overflow-auto p-6">
                        {sections.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No sections found</h3>
                                <p className="text-gray-500">
                                    {searchQuery
                                        ? `No sections match "${searchQuery}"`
                                        : `No sections available in ${selectedCategory} category`
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sections.map((section) => (
                                    <div
                                        key={section.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
                                        onClick={() => {
                                            onAddSection(section.id)
                                            onClose()
                                        }}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="text-2xl">{section.icon}</div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <PlusIcon className="h-5 w-5 text-blue-600" />
                                            </div>
                                        </div>

                                        <h3 className="font-medium text-gray-900 mb-2">{section.name}</h3>
                                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{section.description}</p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                                {section.category}
                                            </span>
                                            {!section.isActive && (
                                                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                                                    Coming Soon
                                                </span>
                                            )}
                                        </div>

                                        {/* Tags */}
                                        {section.tags.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {section.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {section.tags.length > 3 && (
                                                    <span className="text-xs text-gray-400">
                                                        +{section.tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>
                                Showing {sections.length} of {getActiveSections().length} available sections
                            </span>
                            <span>
                                More sections coming soon!
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}