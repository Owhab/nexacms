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

    // Create some sample section templates
    const templates = [
        {
            id: 'hero-section',
            name: 'Hero Section',
            componentName: 'HeroSection',
            defaultProps: JSON.stringify({
                title: 'Welcome to Your Website',
                subtitle: 'Build amazing experiences with our platform',
                buttonText: 'Get Started',
                buttonLink: '#',
                backgroundImage: '',
                textAlign: 'center'
            }),
            description: 'A hero section with title, subtitle, and call-to-action button'
        },
        {
            id: 'text-block',
            name: 'Text Block',
            componentName: 'TextBlock',
            defaultProps: JSON.stringify({
                content: '<p>Add your content here...</p>',
                textAlign: 'left',
                maxWidth: '800px'
            }),
            description: 'A simple text block with rich text editing'
        },
        {
            id: 'image-text',
            name: 'Image & Text',
            componentName: 'ImageText',
            defaultProps: JSON.stringify({
                image: '',
                imageAlt: '',
                title: 'Your Title Here',
                content: '<p>Your content here...</p>',
                layout: 'left', // left, right
                imageWidth: '50%'
            }),
            description: 'Image with text content side by side'
        }
    ]

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