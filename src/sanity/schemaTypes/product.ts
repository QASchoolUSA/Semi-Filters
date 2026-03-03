import { defineField, defineType } from 'sanity'

export const product = defineType({
    name: 'product',
    title: 'Product',
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
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: (Rule) => Rule.required().positive(),
        }),
        defineField({
            name: 'compareAtPrice',
            title: 'Compare at Price',
            type: 'number',
            description: 'Original price before discount (optional)',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'details',
            title: 'Detailed Description',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }],
        }),
        defineField({
            name: 'specifications',
            title: 'Specifications',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', type: 'string', title: 'Label' },
                        { name: 'value', type: 'string', title: 'Value' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'partNumber',
            title: 'Part Number',
            type: 'string',
        }),
        defineField({
            name: 'compatibility',
            title: 'Compatible Trucks',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        }),
        defineField({
            name: 'inStock',
            title: 'In Stock',
            type: 'boolean',
            initialValue: true,
        }),
        defineField({
            name: 'featured',
            title: 'Featured Product',
            type: 'boolean',
            initialValue: false,
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'images.0',
            price: 'price',
        },
        prepare({ title, media, price }) {
            return {
                title,
                media,
                subtitle: price ? `$${price}` : 'No price',
            }
        },
    },
})
