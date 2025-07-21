import { z } from 'zod'

// Blog Post schemas
export const CreateBlogPostSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
    slug: z.string().min(1, 'Slug is required').max(255, 'Slug is too long'),
    excerpt: z.string().max(500, 'Excerpt is too long').optional().nullable(),
    content: z.string().min(1, 'Content is required'),
    featuredImage: z.string().url('Invalid image URL').optional().nullable(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).default('DRAFT'),
    seoTitle: z.string().max(60, 'SEO title should be under 60 characters').optional().nullable(),
    seoDescription: z.string().max(160, 'SEO description should be under 160 characters').optional().nullable(),
    seoKeywords: z.string().max(200, 'SEO keywords are too long').optional().nullable(),
    categoryId: z.string().uuid('Invalid category ID').optional().nullable(),
    tags: z.array(z.string().uuid('Invalid tag ID')).optional().default([]),
    publishedAt: z.string().datetime().optional().nullable(),
    readingTime: z.number().int().min(1).optional().nullable(),
})

export const UpdateBlogPostSchema = CreateBlogPostSchema.partial()

// Blog Category schemas
export const BlogCategorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    slug: z.string().min(1, 'Slug is required').max(100, 'Slug is too long'),
    description: z.string().max(500, 'Description is too long').optional().nullable(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional().nullable(),
    isActive: z.boolean().optional().default(true),
})

export const UpdateBlogCategorySchema = BlogCategorySchema.partial()

// Blog Tag schemas
export const BlogTagSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
    slug: z.string().min(1, 'Slug is required').max(50, 'Slug is too long'),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional().nullable(),
})

export const UpdateBlogTagSchema = BlogTagSchema.partial()

// Blog Comment schemas
export const BlogCommentSchema = z.object({
    content: z.string().min(1, 'Comment is required').max(2000, 'Comment is too long'),
    postId: z.string().uuid('Invalid post ID'),
    parentId: z.string().uuid('Invalid parent comment ID').optional().nullable(),
})

export const UpdateBlogCommentSchema = z.object({
    content: z.string().min(1, 'Comment is required').max(2000, 'Comment is too long').optional(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SPAM']).optional(),
})

// Type exports
export type CreateBlogPostInput = z.infer<typeof CreateBlogPostSchema>
export type UpdateBlogPostInput = z.infer<typeof UpdateBlogPostSchema>
export type BlogCategoryInput = z.infer<typeof BlogCategorySchema>
export type UpdateBlogCategoryInput = z.infer<typeof UpdateBlogCategorySchema>
export type BlogTagInput = z.infer<typeof BlogTagSchema>
export type UpdateBlogTagInput = z.infer<typeof UpdateBlogTagSchema>
export type BlogCommentInput = z.infer<typeof BlogCommentSchema>
export type UpdateBlogCommentInput = z.infer<typeof UpdateBlogCommentSchema>