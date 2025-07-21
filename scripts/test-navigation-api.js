const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testNavigationAPI() {
    console.log('🧪 Testing Navigation API...\n');

    try {
        // Test fetching navigation menus
        console.log('1. Testing navigation menu fetch...');
        const response = await fetch(`${BASE_URL}/api/admin/navigation?location=HEADER_PRIMARY`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Navigation API response received');

        if (data.menus && data.menus.length > 0) {
            const headerMenu = data.menus.find(menu => menu.location === 'HEADER_PRIMARY' && menu.isActive);

            if (headerMenu) {
                console.log(`✅ Found active header menu: "${headerMenu.name}"`);
                console.log(`   - Menu ID: ${headerMenu.id}`);
                console.log(`   - Location: ${headerMenu.location}`);
                console.log(`   - Items count: ${headerMenu.items.length}`);

                // Check if Blog navigation item exists
                const blogItem = headerMenu.items.find(item => item.title === 'Blog');
                if (blogItem) {
                    console.log('✅ Blog navigation item found:');
                    console.log(`   - Title: ${blogItem.title}`);
                    console.log(`   - URL: ${blogItem.url}`);
                    console.log(`   - Order: ${blogItem.order}`);
                    console.log(`   - Visible: ${blogItem.isVisible}`);
                } else {
                    console.log('❌ Blog navigation item not found');
                }

                // List all navigation items
                console.log('\n📋 All navigation items:');
                headerMenu.items
                    .filter(item => !item.parentId) // Only top-level items
                    .sort((a, b) => a.order - b.order)
                    .forEach(item => {
                        console.log(`   ${item.order}. ${item.title} → ${item.url || item.page?.slug || '#'}`);
                    });
            } else {
                console.log('❌ No active header menu found');
            }
        } else {
            console.log('❌ No navigation menus found');
        }

    } catch (error) {
        console.error('❌ Navigation API test failed:', error.message);
    }

    console.log('\n🎉 Navigation API test completed');
}

// Test if server is running first
async function checkServer() {
    try {
        const response = await fetch(`${BASE_URL}/api/admin/navigation`);
        return response.status !== undefined;
    } catch (error) {
        return false;
    }
}

async function runTest() {
    const serverRunning = await checkServer();

    if (!serverRunning) {
        console.log('❌ Server is not running on http://localhost:3000');
        console.log('   Please start the development server with: npm run dev');
        return;
    }

    await testNavigationAPI();
}

runTest().catch(console.error);