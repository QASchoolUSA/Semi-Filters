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
            type: 'array',
            of: [{ type: 'block' }],
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
        defineField({
            name: 'brand',
            title: 'Brand',
            type: 'string',
            description: 'Manufacturer or brand name (e.g. CoralFly, Fleetguard)',
        }),
        defineField({
            name: 'productType',
            title: 'Product Type',
            type: 'string',
            description: 'Type identifier (e.g. air-filter, oil-filter)',
        }),
        defineField({
            name: 'published',
            title: 'Published',
            type: 'boolean',
            initialValue: true,
            description: 'Whether this product is visible on the storefront',
        }),
        defineField({
            name: 'seoTitle',
            title: 'SEO Title',
            type: 'string',
            description: 'Custom title for search engine results',
            group: 'seo',
        }),
        defineField({
            name: 'seoDescription',
            title: 'SEO Description',
            type: 'text',
            rows: 3,
            description: 'Custom description for search engine results',
            group: 'seo',
        }),
        defineField({
            name: 'vehicleFit',
            title: 'Vehicle Fitment',
            type: 'array',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
            description: 'Vehicles this product fits (e.g. freightliner, kenworth)',
        }),
    ],
    groups: [
        { name: 'seo', title: 'SEO', icon: () => '🔍' },
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
