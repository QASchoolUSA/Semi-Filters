import { defineField, defineType } from 'sanity'

export const banner = defineType({
    name: 'banner',
    title: 'Banner',
    type: 'document',
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'subheading',
            title: 'Subheading',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Background Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'ctaText',
            title: 'CTA Button Text',
            type: 'string',
            initialValue: 'Shop Now',
        }),
        defineField({
            name: 'ctaLink',
            title: 'CTA Button Link',
            type: 'string',
            initialValue: '/shop',
        }),
        defineField({
            name: 'discount',
            title: 'Discount Text',
            type: 'string',
            description: 'e.g. "20% OFF" or "FREE SHIPPING"',
        }),
        defineField({
            name: 'isActive',
            title: 'Active',
            type: 'boolean',
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: 'heading',
            media: 'image',
        },
    },
})
