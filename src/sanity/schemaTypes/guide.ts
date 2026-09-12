import { defineField, defineType } from 'sanity'

export const guide = defineType({
    name: 'guide',
    title: 'Guide',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
            description: 'Short summary for listings, meta, and AI crawlers',
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'faqs',
            title: 'FAQs',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'question', type: 'string', title: 'Question' },
                        { name: 'answer', type: 'text', title: 'Answer', rows: 3 },
                    ],
                    preview: {
                        select: { title: 'question' },
                    },
                },
            ],
        }),
        defineField({
            name: 'relatedTruckBrands',
            title: 'Related Truck Brands',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Volvo', value: 'Volvo' },
                    { title: 'Freightliner', value: 'Freightliner' },
                    { title: 'Kenworth', value: 'Kenworth' },
                    { title: 'Peterbilt', value: 'Peterbilt' },
                    { title: 'Mack', value: 'Mack' },
                    { title: 'International', value: 'International' },
                    { title: 'Western Star', value: 'Western Star' },
                    { title: 'DAF', value: 'DAF' },
                ],
            },
        }),
        defineField({
            name: 'seoTitle',
            title: 'SEO Title',
            type: 'string',
            group: 'seo',
        }),
        defineField({
            name: 'seoDescription',
            title: 'SEO Description',
            type: 'text',
            rows: 3,
            group: 'seo',
        }),
        defineField({
            name: 'published',
            title: 'Published',
            type: 'boolean',
            initialValue: true,
        }),
    ],
    groups: [{ name: 'seo', title: 'SEO' }],
    preview: {
        select: { title: 'title', subtitle: 'excerpt' },
    },
})
