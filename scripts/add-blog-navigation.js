const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addBlogNavigation() {
    try {
        console.log('🔗 Adding Blog navigation item...')

        // First, check if we have a header navigation menu
        let headerMenu = await prisma.navigationMenu.findFirst({
            where: {
                location: 'HEADER_PRIMARY',
                isActive: true
            },
            include: {
                items: true
            }
        })

        // If no header menu exists, create one
        if (!headerMenu) {
            console.log('Creating new header navigation menu...')
            headerMenu = await prisma.navigationMenu.create({
                data: {
                    name: 'Main Navigation',
                    location: 'HEADER_PRIMARY',
                    isActive: true
                },
                include: {
                    items: true
                }
            })
        }

        // Check if Blog navigation item already exists
        const existingBlogItem = await prisma.navigationItem.findFirst({
            where: {
                menuId: headerMenu.id,
                title: 'Blog'
            }
        })

        if (existingBlogItem) {
            console.log('✅ Blog navigation item already exists')
            return
        }

        // Get the highest order number to add the new item at the end
        const highestOrder = await prisma.navigationItem.findFirst({
            where: {
                menuId: headerMenu.id,
                parentId: null
            },
            orderBy: {
                order: 'desc'
            }
        })

        const newOrder = (highestOrder?.order || 0) + 1

        // Create the Blog navigation item
        const blogNavItem = await prisma.navigationItem.create({
            data: {
                menuId: headerMenu.id,
                title: 'Blog',
                url: '/blogs',
                target: 'SELF',
                order: newOrder,
                isVisible: true
            }
        })

        console.log('✅ Blog navigation item created successfully')
        console.log(`   - Title: ${blogNavItem.title}`)
        console.log(`   - URL: ${blogNavItem.url}`)
        console.log(`   - Order: ${blogNavItem.order}`)

        // Also add some other common navigation items if they don't exist
        const commonItems = [
            { title: 'Home', url: '/', order: 1 },
            { title: 'About', url: '/about', order: 2 },
            { title: 'Services', url: '/services', order: 3 },
            { title: 'Contact', url: '/contact', order: 5 } // Blog will be order 4
        ]

        for (const item of commonItems) {
            const existing = await prisma.navigationItem.findFirst({
                where: {
                    menuId: headerMenu.id,
                    title: item.title
                }
            })

            if (!existing && item.order < newOrder) {
                await prisma.navigationItem.create({
                    data: {
                        menuId: headerMenu.id,
                        title: item.title,
                        url: item.url,
                        target: 'SELF',
                        order: item.order,
                        isVisible: true
                    }
                })
                console.log(`✅ Added ${item.title} navigation item`)
            }
        }

        console.log('\n🎉 Navigation setup completed!')

    } catch (error) {
        console.error('❌ Error adding blog navigation:', error)
    } finally {
        await prisma.$disconnect()
    }
}

addBlogNavigation()