import { defineField, defineType } from 'sanity'

/** Server-only GSC OAuth state. Hidden from Studio desk; token is encrypted at rest. */
export const gscConnection = defineType({
  name: 'gscConnection',
  title: 'GSC Connection',
  type: 'document',
  fields: [
    defineField({
      name: 'refreshTokenEncrypted',
      title: 'Refresh token (encrypted)',
      type: 'text',
      readOnly: true,
    }),
    defineField({
      name: 'siteUrl',
      title: 'Search Console property',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'connectedAt',
      title: 'Connected at',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: { siteUrl: 'siteUrl', connectedAt: 'connectedAt' },
    prepare: ({ siteUrl, connectedAt }) => ({
      title: siteUrl || 'GSC Connection',
      subtitle: connectedAt ? `Connected ${connectedAt}` : 'Not connected',
    }),
  },
})
