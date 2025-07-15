import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create admin user
    const adminEmail = 'admin@nexacms.com'
    const adminPassword = 'admin123'

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    })

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 12)

        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash: hashedPassword,
                role: 'ADMIN'
            }
        })

        console.log('✅ Admin user created:')
        console.log(`   Email: ${admin.email}`)
        console.log(`   Password: ${adminPassword}`)
        console.log(`   Role: ${admin.role}`)
    } else {
        console.log('ℹ️  Admin user already exists')
    }

    // Create section templates from registry
    const { createSectionTemplateData } = await import('../lib/sections/utils')
    const templates = createSectionTemplateData()

    for (const template of templates) {
        const existing = await prisma.sectionTemplate.findUnique({
            where: { id: template.id }
        })

        if (!existing) {
            await prisma.sectionTemplate.create({
                data: template
            })
            console.log(`✅ Created section template: ${template.name}`)
        }
    }

    console.log('🎉 Seeding completed!')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })