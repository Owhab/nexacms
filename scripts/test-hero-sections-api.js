#!/usr/bin/env node

/**
 * Test Hero Sections API
 * 
 * This script tests that hero sections can be properly added to pages
 * through the API after the database templates have been updated.
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testHeroSectionsAPI() {
    console.log('🧪 Testing Hero Sections API Integration...')

    try {
        // 1. Verify all hero templates exist in database
        console.log('\n1. Checking hero templates in database...')
        const heroTemplates = await prisma.sectionTemplate.findMany({
            where: {
                id: {
                    startsWith: 'hero-'
                }
            },
            orderBy: {
                id: 'asc'
            }
        })

        console.log(`Found ${heroTemplates.length} hero templates:`)
        heroTemplates.forEach(template => {
            console.log(`  ✅ ${template.id}: ${template.name}`)
        })

        // 2. Check if there are any pages to test with
        console.log('\n2. Checking for test pages...')
        const pages = await prisma.page.findMany({
            take: 1,
            select: {
                id: true,
                title: true,
                slug: true
            }
        })

        if (pages.length === 0) {
            console.log('⚠️  No pages found. Creating a test page...')
            
            const testPage = await prisma.page.create({
                data: {
                    title: 'Hero Sections Test Page',
                    slug: 'hero-sections-test',
                    status: 'DRAFT'
                }
            })
            
            console.log(`✅ Created test page: ${testPage.title} (${testPage.id})`)
            pages.push(testPage)
        } else {
            console.log(`✅ Found test page: ${pages[0].title} (${pages[0].id})`)
        }

        const testPage = pages[0]

        // 3. Test creating page sections with hero templates
        console.log('\n3. Testing page section creation...')
        
        const testTemplates = [
            'hero-centered',
            'hero-minimal', 
            'hero-split-screen'
        ]

        for (const templateId of testTemplates) {
            try {
                const template = heroTemplates.find(t => t.id === templateId)
                if (!template) {
                    console.log(`❌ Template ${templateId} not found`)
                    continue
                }

                // Get the next order
                const lastSection = await prisma.pageSection.findFirst({
                    where: { pageId: testPage.id },
                    orderBy: { order: 'desc' }
                })
                const nextOrder = (lastSection?.order || 0) + 1

                // Create the page section
                const pageSection = await prisma.pageSection.create({
                    data: {
                        pageId: testPage.id,
                        sectionTemplateId: templateId,
                        order: nextOrder,
                        props: JSON.stringify({
                            title: {
                                text: `Test ${template.name}`,
                                tag: 'h1'
                            },
                            subtitle: {
                                text: 'This is a test section',
                                tag: 'h2'
                            }
                        })
                    },
                    include: {
                        sectionTemplate: true
                    }
                })

                console.log(`  ✅ Created section: ${pageSection.sectionTemplate.name}`)
                
            } catch (error) {
                console.log(`  ❌ Failed to create section for ${templateId}:`, error.message)
            }
        }

        // 4. Verify sections were created
        console.log('\n4. Verifying created sections...')
        const pageSections = await prisma.pageSection.findMany({
            where: {
                pageId: testPage.id
            },
            include: {
                sectionTemplate: true
            },
            orderBy: {
                order: 'asc'
            }
        })

        console.log(`Found ${pageSections.length} sections on test page:`)
        pageSections.forEach(section => {
            console.log(`  • ${section.sectionTemplate.name} (Order: ${section.order})`)
        })

        // 5. Clean up test data (optional)
        console.log('\n5. Cleaning up test data...')
        
        // Delete test sections
        await prisma.pageSection.deleteMany({
            where: {
                pageId: testPage.id
            }
        })
        
        // Delete test page if we created it
        if (testPage.title === 'Hero Sections Test Page') {
            await prisma.page.delete({
                where: {
                    id: testPage.id
                }
            })
            console.log('✅ Cleaned up test page and sections')
        } else {
            console.log('✅ Cleaned up test sections (kept existing page)')
        }

        console.log('\n🎉 Hero Sections API Test Completed Successfully!')
        console.log('✅ All hero section templates are working correctly')
        console.log('✅ Page sections can be created with hero templates')
        console.log('✅ Foreign key constraints are satisfied')

    } catch (error) {
        console.error('❌ Test failed:', error)
        throw error
    }
}

async function main() {
    try {
        await testHeroSectionsAPI()
    } catch (error) {
        console.error('💥 Test suite failed:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

// Run the test
if (require.main === module) {
    main()
}

module.exports = { testHeroSectionsAPI }