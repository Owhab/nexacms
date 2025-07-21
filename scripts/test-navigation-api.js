#!/usr/bin/env node

/**
 * Test script for Navigation Management API endpoints
 * This script tests the basic CRUD operations for navigation menus and items
 */

const BASE_URL = 'http://localhost:3000'

// Mock auth token - in real usage, this would come from authentication
const AUTH_TOKEN = 'test-token'

async function makeRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `auth-token=${AUTH_TOKEN}`,
            ...options.headers
        },
        ...options
    })

    const data = await response.json()
    return { status: response.status, data }
}

async function testNavigationAPI() {
    console.log('🧪 Testing Navigation Management API...\n')

    try {
        // Test 1: Create a navigation menu
        console.log('1. Creating navigation menu...')
        const createMenuResult = await makeRequest('/api/admin/navigation', {
            method: 'POST',
            body: JSON.stringify({
                name: 'Test Header Menu',
                location: 'HEADER_PRIMARY',
                isActive: true
            })
        })

        if (createMenuResult.status === 201) {
            console.log('✅ Menu created successfully')
            console.log(`   Menu ID: ${createMenuResult.data.menu.id}`)
        } else {
            console.log('❌ Failed to create menu:', createMenuResult.data)
            return
        }

        const menuId = createMenuResult.data.menu.id

        // Test 2: Get all navigation menus
        console.log('\n2. Fetching all navigation menus...')
        const getMenusResult = await makeRequest('/api/admin/navigation')

        if (getMenusResult.status === 200) {
            console.log('✅ Menus fetched successfully')
            console.log(`   Found ${getMenusResult.data.menus.length} menu(s)`)
        } else {
            console.log('❌ Failed to fetch menus:', getMenusResult.data)
        }

        // Test 3: Create navigation items
        console.log('\n3. Creating navigation items...')

        // Create a page link item
        const createItemResult1 = await makeRequest(`/api/admin/navigation/${menuId}/items`, {
            method: 'POST',
            body: JSON.stringify({
                title: 'Home',
                url: '/',
                target: 'SELF',
                isVisible: true,
                order: 1
            })
        })

        if (createItemResult1.status === 201) {
            console.log('✅ First navigation item created')
        } else {
            console.log('❌ Failed to create first item:', createItemResult1.data)
        }

        // Create another item
        const createItemResult2 = await makeRequest(`/api/admin/navigation/${menuId}/items`, {
            method: 'POST',
            body: JSON.stringify({
                title: 'About',
                url: '/about',
                target: 'SELF',
                isVisible: true,
                order: 2
            })
        })

        if (createItemResult2.status === 201) {
            console.log('✅ Second navigation item created')
        } else {
            console.log('❌ Failed to create second item:', createItemResult2.data)
        }

        // Test 4: Get navigation items
        console.log('\n4. Fetching navigation items...')
        const getItemsResult = await makeRequest(`/api/admin/navigation/${menuId}/items`)

        if (getItemsResult.status === 200) {
            console.log('✅ Navigation items fetched successfully')
            console.log(`   Found ${getItemsResult.data.items.length} item(s)`)
        } else {
            console.log('❌ Failed to fetch items:', getItemsResult.data)
        }

        // Test 5: Test reordering (if we have items)
        if (getItemsResult.status === 200 && getItemsResult.data.items.length >= 2) {
            console.log('\n5. Testing item reordering...')
            const items = getItemsResult.data.items

            const reorderResult = await makeRequest(`/api/admin/navigation/${menuId}/items/reorder`, {
                method: 'POST',
                body: JSON.stringify({
                    items: [
                        { id: items[1].id, order: 1, parentId: null },
                        { id: items[0].id, order: 2, parentId: null }
                    ]
                })
            })

            if (reorderResult.status === 200) {
                console.log('✅ Items reordered successfully')
            } else {
                console.log('❌ Failed to reorder items:', reorderResult.data)
            }
        }

        // Test 6: Update menu
        console.log('\n6. Updating navigation menu...')
        const updateMenuResult = await makeRequest(`/api/admin/navigation/${menuId}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: 'Updated Header Menu',
                isActive: false
            })
        })

        if (updateMenuResult.status === 200) {
            console.log('✅ Menu updated successfully')
        } else {
            console.log('❌ Failed to update menu:', updateMenuResult.data)
        }

        // Test 7: Delete menu (cleanup)
        console.log('\n7. Cleaning up - deleting test menu...')
        const deleteMenuResult = await makeRequest(`/api/admin/navigation/${menuId}`, {
            method: 'DELETE'
        })

        if (deleteMenuResult.status === 200) {
            console.log('✅ Menu deleted successfully')
            console.log(`   Deleted ${deleteMenuResult.data.deletedItemsCount} associated items`)
        } else {
            console.log('❌ Failed to delete menu:', deleteMenuResult.data)
        }

        console.log('\n🎉 All API tests completed!')
        console.log('\n📋 Frontend Integration Notes:')
        console.log('   • Navigation management is available in Admin > Settings > Navigation')
        console.log('   • Users can create multiple menus for different locations')
        console.log('   • Drag-and-drop reordering is supported with up/down buttons')
        console.log('   • Nested navigation items are supported')
        console.log('   • Items can link to pages or external URLs')
        console.log('   • Visibility and target window options are available')

    } catch (error) {
        console.error('❌ Test failed with error:', error.message)
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    testNavigationAPI()
}

module.exports = { testNavigationAPI }