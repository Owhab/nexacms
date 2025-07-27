#!/usr/bin/env node

/**
 * Update Section Templates Script
 * 
 * This script updates the database with all section templates from the registry,
 * including the new hero section variants.
 */

import { PrismaClient } from '@prisma/client'
import { createSectionTemplateData } from '../lib/sections/utils'

const prisma = new PrismaClient()

async function updateSectionTemplates() {
    console.log('🔄 Updating section templates in database...')

    try {
        // Get all section templates from the registry
        const templates = createSectionTemplateData()
        
        console.log(`Found ${templates.length} section templates in registry`)
        
        let created = 0
        let updated = 0
        let skipped = 0

        for (const template of templates) {
            try {
                // Check if template already exists
                const existing = await prisma.sectionTemplate.findUnique({
                    where: { id: template.id }
                })

                if (existing) {
                    // Update existing template
                    await prisma.sectionTemplate.update({
                        where: { id: template.id },
                        data: {
                            name: template.name,
                            componentName: template.componentName,
                            defaultProps: template.defaultProps,
                            description: template.description
                        }
                    })
                    console.log(`✅ Updated: ${template.name} (${template.id})`)
                    updated++
                } else {
                    // Create new template
                    await prisma.sectionTemplate.create({
                        data: template
                    })
                    console.log(`🆕 Created: ${template.name} (${template.id})`)
                    created++
                }
            } catch (error) {
                console.error(`❌ Failed to process ${template.id}:`, error)
                skipped++
            }
        }

        console.log('\n📊 Update Summary:')
        console.log(`Created: ${created}`)
        console.log(`Updated: ${updated}`)
        console.log(`Skipped: ${skipped}`)
        console.log(`Total: ${templates.length}`)

        // Verify hero sections are present
        console.log('\n🎯 Verifying hero sections...')
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

        console.log(`Found ${heroTemplates.length} hero section templates:`)
        heroTemplates.forEach(template => {
            console.log(`  • ${template.name} (${template.id})`)
        })

        if (heroTemplates.length >= 10) {
            console.log('\n✅ All hero section variants are now available in the database!')
        } else {
            console.log('\n⚠️  Some hero section variants may be missing')
        }

    } catch (error) {
        console.error('❌ Failed to update section templates:', error)
        throw error
    }
}

async function main() {
    try {
        await updateSectionTemplates()
        console.log('\n🎉 Section templates update completed successfully!')
    } catch (error) {
        console.error('💥 Update failed:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

// Run the script
if (require.main === module) {
    main()
}

export { updateSectionTemplates }