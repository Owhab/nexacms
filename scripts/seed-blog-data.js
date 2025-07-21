const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedBlogData() {
    try {
        console.log('🌱 Seeding blog data...')

        // Create blog categories
        const techCategory = await prisma.blogCategory.create({
            data: {
                name: 'Technology',
                slug: 'technology',
                description: 'Posts about technology and programming',
                color: '#3b82f6'
            }
        })

        const designCategory = await prisma.blogCategory.create({
            data: {
                name: 'Design',
                slug: 'design',
                description: 'Posts about web design and UI/UX',
                color: '#8b5cf6'
            }
        })

        console.log('✅ Categories created')

        // Create blog tags
        const jsTag = await prisma.blogTag.create({
            data: {
                name: 'JavaScript',
                slug: 'javascript',
                color: '#f59e0b'
            }
        })

        const reactTag = await prisma.blogTag.create({
            data: {
                name: 'React',
                slug: 'react',
                color: '#06b6d4'
            }
        })

        const nextjsTag = await prisma.blogTag.create({
            data: {
                name: 'Next.js',
                slug: 'nextjs',
                color: '#000000'
            }
        })

        console.log('✅ Tags created')

        // Get the first user to be the author
        const author = await prisma.user.findFirst()
        if (!author) {
            throw new Error('No users found. Please create a user first.')
        }

        // Create blog posts
        const post1 = await prisma.blogPost.create({
            data: {
                title: 'Getting Started with Next.js',
                slug: 'getting-started-with-nextjs',
                excerpt: 'Learn how to build modern web applications with Next.js framework',
                content: `# Getting Started with Next.js

Next.js is a powerful React framework that enables you to build full-stack web applications. It provides many features out of the box including:

## Key Features

- **Server-Side Rendering (SSR)**: Render pages on the server for better SEO and performance
- **Static Site Generation (SSG)**: Pre-render pages at build time
- **API Routes**: Build API endpoints alongside your frontend code
- **File-based Routing**: Automatic routing based on file structure
- **Built-in CSS Support**: Support for CSS Modules, Sass, and CSS-in-JS

## Installation

To get started with Next.js, run:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Your First Page

Create a new file \`pages/about.js\`:

\`\`\`jsx
export default function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Welcome to our Next.js application!</p>
    </div>
  )
}
\`\`\`

That's it! Next.js will automatically create a route for this page at \`/about\`.

## Conclusion

Next.js makes it easy to build modern web applications with React. Its built-in features and optimizations help you create fast, SEO-friendly websites with minimal configuration.`,
                status: 'PUBLISHED',
                seoTitle: 'Getting Started with Next.js - Complete Guide',
                seoDescription: 'Learn Next.js from scratch with this comprehensive guide covering SSR, SSG, API routes, and more.',
                readingTime: 5,
                authorId: author.id,
                categoryId: techCategory.id,
                publishedAt: new Date(),
                tags: {
                    create: [
                        { tag: { connect: { id: jsTag.id } } },
                        { tag: { connect: { id: reactTag.id } } },
                        { tag: { connect: { id: nextjsTag.id } } }
                    ]
                }
            }
        })

        const post2 = await prisma.blogPost.create({
            data: {
                title: 'Modern Web Design Principles',
                slug: 'modern-web-design-principles',
                excerpt: 'Explore the fundamental principles of modern web design',
                content: `# Modern Web Design Principles

Creating effective web designs requires understanding and applying key design principles. Here are the most important ones:

## 1. Simplicity

Keep your design clean and uncluttered. Users should be able to find what they're looking for quickly and easily.

## 2. Visual Hierarchy

Use size, color, and spacing to guide users' attention to the most important elements first.

## 3. Consistency

Maintain consistent styling, spacing, and behavior throughout your website.

## 4. Responsive Design

Ensure your design works well on all devices and screen sizes.

## 5. Accessibility

Design for all users, including those with disabilities. Use proper contrast, alt text, and semantic HTML.

## 6. Performance

Optimize images, minimize code, and ensure fast loading times.

## Conclusion

Following these principles will help you create websites that are not only beautiful but also functional and user-friendly.`,
                status: 'PUBLISHED',
                seoTitle: 'Modern Web Design Principles - Best Practices Guide',
                seoDescription: 'Learn the essential principles of modern web design including simplicity, visual hierarchy, and accessibility.',
                readingTime: 3,
                authorId: author.id,
                categoryId: designCategory.id,
                publishedAt: new Date()
            }
        })

        const post3 = await prisma.blogPost.create({
            data: {
                title: 'Building a React Component Library',
                slug: 'building-react-component-library',
                excerpt: 'Learn how to create reusable React components for your projects',
                content: `# Building a React Component Library

Creating a component library helps maintain consistency across your applications and speeds up development.

## Planning Your Library

Before you start coding, plan out:
- What components you need
- Design system guidelines
- Documentation strategy

## Setting Up the Project

Use tools like Storybook for development and documentation:

\`\`\`bash
npx create-react-app my-components
cd my-components
npx storybook init
\`\`\`

## Creating Components

Focus on reusability and flexibility:

\`\`\`jsx
export const Button = ({ variant = 'primary', size = 'medium', children, ...props }) => {
  return (
    <button 
      className={\`btn btn-\${variant} btn-\${size}\`}
      {...props}
    >
      {children}
    </button>
  )
}
\`\`\`

## Documentation

Good documentation is crucial for adoption. Include:
- Usage examples
- Props documentation
- Design guidelines

## Publishing

Use npm to share your library:

\`\`\`bash
npm publish
\`\`\`

## Conclusion

A well-built component library is an investment that pays dividends in development speed and consistency.`,
                status: 'DRAFT',
                seoTitle: 'Building a React Component Library - Complete Guide',
                seoDescription: 'Step-by-step guide to creating, documenting, and publishing a React component library.',
                readingTime: 7,
                authorId: author.id,
                categoryId: techCategory.id,
                tags: {
                    create: [
                        { tag: { connect: { id: jsTag.id } } },
                        { tag: { connect: { id: reactTag.id } } }
                    ]
                }
            }
        })

        console.log('✅ Blog posts created')

        // Create some sample comments
        await prisma.blogComment.create({
            data: {
                content: 'Great article! Very helpful for beginners.',
                postId: post1.id,
                authorId: author.id,
                status: 'APPROVED'
            }
        })

        await prisma.blogComment.create({
            data: {
                content: 'Thanks for sharing these design principles. The visual hierarchy section was particularly useful.',
                postId: post2.id,
                authorId: author.id,
                status: 'APPROVED'
            }
        })

        console.log('✅ Comments created')

        console.log('\n🎉 Blog data seeded successfully!')
        console.log(`Created:
- ${2} categories
- ${3} tags  
- ${3} blog posts
- ${2} comments`)

    } catch (error) {
        console.error('❌ Error seeding blog data:', error)
    } finally {
        await prisma.$disconnect()
    }
}

seedBlogData()