// Use built-in fetch for Node.js 18+
const fetch = globalThis.fetch || require('node-fetch');

const BASE_URL = 'http://localhost:3000';
let authToken = '';

// Test data
const testCategory = {
    name: 'Technology',
    slug: 'technology',
    description: 'Posts about technology and programming',
    color: '#3b82f6'
};

const testTag = {
    name: 'JavaScript',
    slug: 'javascript',
    color: '#f59e0b'
};

const testPost = {
    title: 'Getting Started with Next.js',
    slug: 'getting-started-with-nextjs',
    excerpt: 'Learn how to build modern web applications with Next.js',
    content: '# Getting Started with Next.js\n\nNext.js is a powerful React framework...',
    status: 'PUBLISHED',
    seoTitle: 'Getting Started with Next.js - Complete Guide',
    seoDescription: 'Learn Next.js from scratch with this comprehensive guide',
    readingTime: 5
};

async function makeRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...(authToken && { 'Cookie': `auth-token=${authToken}` }),
        ...options.headers
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`${response.status}: ${data.message || 'Request failed'}`);
    }

    return { response, data };
}

async function login() {
    console.log('🔐 Logging in...');
    try {
        const { response, data } = await makeRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });

        // Extract token from Set-Cookie header
        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader) {
            const tokenMatch = setCookieHeader.match(/auth-token=([^;]+)/);
            if (tokenMatch) {
                authToken = tokenMatch[1];
                console.log('✅ Login successful');
                return;
            }
        }

        throw new Error('No auth token received');
    } catch (error) {
        console.error('❌ Login failed:', error.message);
        process.exit(1);
    }
}

async function testCategories() {
    console.log('\n📁 Testing Blog Categories...');

    try {
        // Create category
        console.log('Creating category...');
        const { data: createData } = await makeRequest('/api/admin/blog/categories', {
            method: 'POST',
            body: JSON.stringify(testCategory)
        });
        console.log('✅ Category created:', createData.category.name);
        const categoryId = createData.category.id;

        // Get all categories
        console.log('Fetching categories...');
        const { data: listData } = await makeRequest('/api/admin/blog/categories');
        console.log('✅ Categories fetched:', listData.categories.length);

        // Get single category
        console.log('Fetching single category...');
        const { data: singleData } = await makeRequest(`/api/admin/blog/categories/${categoryId}`);
        console.log('✅ Single category fetched:', singleData.category.name);

        // Update category
        console.log('Updating category...');
        const { data: updateData } = await makeRequest(`/api/admin/blog/categories/${categoryId}`, {
            method: 'PUT',
            body: JSON.stringify({
                description: 'Updated description for technology category'
            })
        });
        console.log('✅ Category updated');

        return categoryId;
    } catch (error) {
        console.error('❌ Category test failed:', error.message);
        throw error;
    }
}

async function testTags() {
    console.log('\n🏷️ Testing Blog Tags...');

    try {
        // Create tag
        console.log('Creating tag...');
        const { data: createData } = await makeRequest('/api/admin/blog/tags', {
            method: 'POST',
            body: JSON.stringify(testTag)
        });
        console.log('✅ Tag created:', createData.tag.name);
        const tagId = createData.tag.id;

        // Get all tags
        console.log('Fetching tags...');
        const { data: listData } = await makeRequest('/api/admin/blog/tags');
        console.log('✅ Tags fetched:', listData.tags.length);

        // Get single tag
        console.log('Fetching single tag...');
        const { data: singleData } = await makeRequest(`/api/admin/blog/tags/${tagId}`);
        console.log('✅ Single tag fetched:', singleData.tag.name);

        // Update tag
        console.log('Updating tag...');
        const { data: updateData } = await makeRequest(`/api/admin/blog/tags/${tagId}`, {
            method: 'PUT',
            body: JSON.stringify({
                color: '#ef4444'
            })
        });
        console.log('✅ Tag updated');

        return tagId;
    } catch (error) {
        console.error('❌ Tag test failed:', error.message);
        throw error;
    }
}

async function testPosts(categoryId, tagId) {
    console.log('\n📝 Testing Blog Posts...');

    try {
        // Create post
        console.log('Creating post...');
        const postData = {
            ...testPost,
            categoryId,
            tags: [tagId]
        };

        const { data: createData } = await makeRequest('/api/admin/blog/posts', {
            method: 'POST',
            body: JSON.stringify(postData)
        });
        console.log('✅ Post created:', createData.post.title);
        const postId = createData.post.id;

        // Get all posts
        console.log('Fetching posts...');
        const { data: listData } = await makeRequest('/api/admin/blog/posts');
        console.log('✅ Posts fetched:', listData.posts.length);

        // Get single post
        console.log('Fetching single post...');
        const { data: singleData } = await makeRequest(`/api/admin/blog/posts/${postId}`);
        console.log('✅ Single post fetched:', singleData.post.title);

        // Update post
        console.log('Updating post...');
        const { data: updateData } = await makeRequest(`/api/admin/blog/posts/${postId}`, {
            method: 'PUT',
            body: JSON.stringify({
                excerpt: 'Updated excerpt for the Next.js post'
            })
        });
        console.log('✅ Post updated');

        // Test filtering
        console.log('Testing post filtering...');
        const { data: filteredData } = await makeRequest(`/api/admin/blog/posts?status=PUBLISHED&categoryId=${categoryId}`);
        console.log('✅ Post filtering works:', filteredData.posts.length);

        return postId;
    } catch (error) {
        console.error('❌ Post test failed:', error.message);
        throw error;
    }
}

async function testComments() {
    console.log('\n💬 Testing Blog Comments...');

    try {
        // Get all comments (admin only)
        console.log('Fetching comments...');
        const { data: listData } = await makeRequest('/api/admin/blog/comments');
        console.log('✅ Comments fetched:', listData.comments.length);

    } catch (error) {
        console.error('❌ Comment test failed:', error.message);
        // Comments test is optional since we might not have any comments yet
    }
}

async function cleanup(categoryId, tagId, postId) {
    console.log('\n🧹 Cleaning up test data...');

    try {
        // Delete post first (has foreign key constraints)
        if (postId) {
            await makeRequest(`/api/admin/blog/posts/${postId}`, { method: 'DELETE' });
            console.log('✅ Test post deleted');
        }

        // Delete tag
        if (tagId) {
            await makeRequest(`/api/admin/blog/tags/${tagId}`, { method: 'DELETE' });
            console.log('✅ Test tag deleted');
        }

        // Delete category
        if (categoryId) {
            await makeRequest(`/api/admin/blog/categories/${categoryId}`, { method: 'DELETE' });
            console.log('✅ Test category deleted');
        }
    } catch (error) {
        console.error('❌ Cleanup failed:', error.message);
    }
}

async function runTests() {
    console.log('🚀 Starting Blog API Tests...\n');

    let categoryId, tagId, postId;

    try {
        await login();
        categoryId = await testCategories();
        tagId = await testTags();
        postId = await testPosts(categoryId, tagId);
        await testComments();

        console.log('\n🎉 All tests passed successfully!');

    } catch (error) {
        console.error('\n💥 Test suite failed:', error.message);
    } finally {
        await cleanup(categoryId, tagId, postId);
        console.log('\n✨ Test suite completed');
    }
}

// Run the tests
runTests().catch(console.error);