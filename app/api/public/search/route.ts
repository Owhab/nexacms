import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')

        if (!query || query.trim().length < 2) {
            return NextResponse.json({ results: [] })
        }

        // Search in published pages
        const pages = await prisma.page.findMany({
            where: {
                status: 'PUBLISHED',
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { seoTitle: { contains: query, mode: 'insensitive' } },
                    { seoDescription: { contains: query, mode: 'insensitive' } },
                    { seoKeywords: { contains: query, mode: 'insensitive' } },
                ]
            },
            include: {
                sections: {
                    select: {
                        props: true
                    },
                    take: 3 // Limit to first 3 sections for content search
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })

        // Process results to include content matches and excerpts
        const results = pages.map(page => {
            // Search in section content
            let matchCount = 0
            let excerpt = null

            // Check title match
            const titleMatch = page.title.toLowerCase().includes(query.toLowerCase())
            if (titleMatch) matchCount += 10

            // Check SEO fields match
            if (page.seoTitle?.toLowerCase().includes(query.toLowerCase())) matchCount += 5
            if (page.seoDescription?.toLowerCase().includes(query.toLowerCase())) matchCount += 3
            if (page.seoKeywords?.toLowerCase().includes(query.toLowerCase())) matchCount += 2

            // Search in section content
            for (const section of page.sections) {
                try {
                    const props = JSON.parse(section.props)

                    // Check for text content in different section types
                    const contentToSearch = [
                        props.content, // TextBlock, ImageText
                        props.title,   // Hero, ImageText
                        props.subtitle // Hero
                    ].filter(Boolean).join(' ').toLowerCase()

                    if (contentToSearch.includes(query.toLowerCase())) {
                        matchCount += 1

                        // Create excerpt with highlighted match if not already set
                        if (!excerpt) {
                            const contentText = props.content || ''
                            const index = contentText.toLowerCase().indexOf(query.toLowerCase())

                            if (index >= 0) {
                                // Get surrounding context (50 chars before and after)
                                const start = Math.max(0, index - 50)
                                const end = Math.min(contentText.length, index + query.length + 50)
                                let excerptText = contentText.substring(start, end)

                                // Add ellipsis if needed
                                if (start > 0) excerptText = '...' + excerptText
                                if (end < contentText.length) excerptText = excerptText + '...'

                                // Highlight the match
                                const regex = new RegExp(`(${query})`, 'gi')
                                excerpt = excerptText.replace(regex, '<strong class="bg-yellow-100">$1</strong>')
                            }
                        }
                    }
                } catch (e) {
                    // Skip invalid JSON
                    console.error('Error parsing section props:', e)
                }
            }

            return {
                id: page.id,
                title: page.title,
                slug: page.slug,
                seoDescription: page.seoDescription,
                updatedAt: page.updatedAt,
                excerpt,
                matchCount
            }
        })

        // Sort by match relevance
        results.sort((a, b) => (b.matchCount || 0) - (a.matchCount || 0))

        return NextResponse.json({ results })
    } catch (error) {
        console.error('Error searching pages:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}