import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedTemplates() {
    console.log('Seeding header and footer templates...')

    // Create default header templates
    const headerTemplates = [
        {
            id: 'modern-header',
            name: 'Modern Header',
            description: 'Clean and modern header with dropdown navigation',
            template: 'modern',
            config: {
                showLogo: true,
                showSearch: true,
                sticky: true,
                backgroundColor: '#ffffff',
                textColor: '#1f2937'
            }
        },
        {
            id: 'classic-header',
            name: 'Classic Header',
            description: 'Traditional header layout with centered logo',
            template: 'classic',
            config: {
                showLogo: true,
                logoPosition: 'center',
                showSearch: false,
                sticky: false,
                backgroundColor: '#f8fafc',
                textColor: '#374151'
            }
        },
        {
            id: 'minimal-header',
            name: 'Minimal Header',
            description: 'Simple and clean header with minimal elements',
            template: 'minimal',
            config: {
                showLogo: true,
                logoPosition: 'left',
                showSearch: false,
                sticky: true,
                backgroundColor: '#ffffff',
                textColor: '#111827'
            }
        }
    ]

    // Create default footer templates
    const footerTemplates = [
        {
            id: 'modern-footer',
            name: 'Modern Footer',
            description: 'Multi-column footer with social links and company info',
            template: 'modern',
            config: {
                columns: 4,
                showSocial: true,
                showNewsletter: true,
                backgroundColor: '#111827',
                textColor: '#ffffff'
            }
        },
        {
            id: 'simple-footer',
            name: 'Simple Footer',
            description: 'Single row footer with essential links',
            template: 'simple',
            config: {
                columns: 1,
                showSocial: true,
                showNewsletter: false,
                backgroundColor: '#f9fafb',
                textColor: '#374151'
            }
        },
        {
            id: 'corporate-footer',
            name: 'Corporate Footer',
            description: 'Professional footer with detailed company information',
            template: 'corporate',
            config: {
                columns: 5,
                showSocial: true,
                showNewsletter: true,
                showAddress: true,
                backgroundColor: '#1f2937',
                textColor: '#f9fafb'
            }
        }
    ]

    // Insert header templates
    for (const template of headerTemplates) {
        await prisma.headerTemplate.upsert({
            where: { id: template.id },
            update: template,
            create: template
        })
    }

    // Insert footer templates
    for (const template of footerTemplates) {
        await prisma.footerTemplate.upsert({
            where: { id: template.id },
            update: template,
            create: template
        })
    }

    // Create default navigation menus
    const headerMenu = await prisma.navigationMenu.upsert({
        where: { id: 'header-primary' },
        update: {},
        create: {
            id: 'header-primary',
            name: 'Header Primary Menu',
            location: 'HEADER_PRIMARY'
        }
    })

    const footerMenu = await prisma.navigationMenu.upsert({
        where: { id: 'footer-primary' },
        update: {},
        create: {
            id: 'footer-primary',
            name: 'Footer Primary Menu',
            location: 'FOOTER_PRIMARY'
        }
    })

    // Create default navigation items
    const defaultHeaderItems = [
        { title: 'Home', url: '/pages', order: 1 },
        { title: 'About', url: '/pages/about', order: 2 },
        { title: 'Services', url: '/pages/services', order: 3 },
        { title: 'Contact', url: '/pages/contact', order: 4 }
    ]

    const defaultFooterItems = [
        { title: 'Privacy Policy', url: '/pages/privacy', order: 1 },
        { title: 'Terms of Service', url: '/pages/terms', order: 2 },
        { title: 'Support', url: '/pages/support', order: 3 }
    ]

    // Insert header navigation items
    for (const item of defaultHeaderItems) {
        await prisma.navigationItem.upsert({
            where: {
                menuId_order: {
                    menuId: headerMenu.id,
                    order: item.order
                }
            },
            update: item,
            create: {
                ...item,
                menuId: headerMenu.id,
                target: 'SELF',
                isVisible: true
            }
        })
    }

    // Insert footer navigation items
    for (const item of defaultFooterItems) {
        await prisma.navigationItem.upsert({
            where: {
                menuId_order: {
                    menuId: footerMenu.id,
                    order: item.order
                }
            },
            update: item,
            create: {
                ...item,
                menuId: footerMenu.id,
                target: 'SELF',
                isVisible: true
            }
        })
    }

    console.log('Templates and navigation seeded successfully!')
}

seedTemplates()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })