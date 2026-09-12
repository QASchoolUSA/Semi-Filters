import { defineField, defineType } from 'sanity'

export const category = defineType({
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
        }),
        defineField({
            name: 'seoTitle',
            title: 'SEO Title',
            type: 'string',
            description: 'Custom title for category landing pages',
        }),
        defineField({
            name: 'seoDescription',
            title: 'SEO Description',
            type: 'text',
            rows: 3,
            description: 'Meta description for /filters/[slug] landings',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'image',
        },
    },
})
