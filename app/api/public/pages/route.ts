import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const slug = searchParams.get('slug')

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
        }

        const page = await prisma.page.findFirst({
            where: {
                slug,
                status: 'PUBLISHED'
            },
            include: {
                sections: {
                    include: {
                        sectionTemplate: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        })

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 })
        }

        // Parse JSON props for each section
        const sectionsWithParsedProps = page.sections.map(section => ({
            ...section,
            props: typeof section.props === 'string' ? JSON.parse(section.props) : section.props
        }))

        const pageWithParsedSections = {
            ...page,
            sections: sectionsWithParsedProps
        }

        return NextResponse.json({ page: pageWithParsedSections })
    } catch (error) {
        console.error('Error fetching public page:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}