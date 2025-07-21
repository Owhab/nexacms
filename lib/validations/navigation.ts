import { z } from 'zod'

// Enum schemas
export const MenuLocationSchema = z.enum([
    'HEADER_PRIMARY',
    'HEADER_SECONDARY',
    'FOOTER_PRIMARY',
    'FOOTER_SECONDARY',
    'SIDEBAR'
])

export const LinkTargetSchema = z.enum(['SELF', 'BLANK'])

// Navigation Menu schemas
export const CreateNavigationMenuSchema = z.object({
    name: z.string().min(1, 'Menu name is required').max(100, 'Menu name too long'),
    location: MenuLocationSchema,
    isActive: z.boolean().optional().default(true)
})

export const UpdateNavigationMenuSchema = z.object({
    name: z.string().min(1, 'Menu name is required').max(100, 'Menu name too long').optional(),
    location: MenuLocationSchema.optional(),
    isActive: z.boolean().optional()
})

// Navigation Item schemas
export const CreateNavigationItemSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
    url: z.string().url('Invalid URL').optional().nullable(),
    pageId: z.string().uuid('Invalid page ID').optional().nullable(),
    parentId: z.string().uuid('Invalid parent ID').optional().nullable(),
    target: LinkTargetSchema.optional().default('SELF'),
    order: z.number().int().min(0).optional(),
    isVisible: z.boolean().optional().default(true),
    cssClass: z.string().max(200, 'CSS class too long').optional().nullable(),
    icon: z.string().max(100, 'Icon name too long').optional().nullable()
}).refine(
    (data) => data.url || data.pageId,
    {
        message: "Either URL or page ID must be provided",
        path: ["url"]
    }
)

export const UpdateNavigationItemSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title too long').optional(),
    url: z.string().url('Invalid URL').optional().nullable(),
    pageId: z.string().uuid('Invalid page ID').optional().nullable(),
    parentId: z.string().uuid('Invalid parent ID').optional().nullable(),
    target: LinkTargetSchema.optional(),
    order: z.number().int().min(0).optional(),
    isVisible: z.boolean().optional(),
    cssClass: z.string().max(200, 'CSS class too long').optional().nullable(),
    icon: z.string().max(100, 'Icon name too long').optional().nullable()
})

export const ReorderNavigationItemsSchema = z.object({
    items: z.array(z.object({
        id: z.string().uuid('Invalid item ID'),
        order: z.number().int().min(0),
        parentId: z.string().uuid('Invalid parent ID').optional().nullable()
    }))
})

// Type exports
export type CreateNavigationMenuInput = z.infer<typeof CreateNavigationMenuSchema>
export type UpdateNavigationMenuInput = z.infer<typeof UpdateNavigationMenuSchema>
export type CreateNavigationItemInput = z.infer<typeof CreateNavigationItemSchema>
export type UpdateNavigationItemInput = z.infer<typeof UpdateNavigationItemSchema>
export type ReorderNavigationItemsInput = z.infer<typeof ReorderNavigationItemsSchema>