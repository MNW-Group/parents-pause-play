import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Pillar Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Settings & Meta' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt / Samenvatting',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Korte samenvatting (1 of 2 zinnen) die op de homepage kaartjes wordt getoond.',
      validation: (rule) => rule.max(150).warning('Houd het kort en bondig voor de perfecte kaart-layout.'),
    }),
    defineField({
      name: 'body',
      title: 'Body Content',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              // 1. De standaard Externe Hyperlink
              {
                name: 'link',
                type: 'object',
                title: 'External link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
              // 2. De nieuwe Magische INTERNE Link
              {
                name: 'internalLink',
                type: 'object',
                title: 'Internal link',
                fields: [
                  {
                    name: 'reference',
                    type: 'reference',
                    title: 'Reference',
                    to: [
                      { type: 'post' },
                      { type: 'article' },
                      { type: 'review' },
                      { type: 'category' },
                      { type: 'page' }
                    ],
                  },
                ],
              },
            ],
          },
        },
        // Bonus: Dit zorgt ervoor dat je ook afbeeldingen midden in je tekst kunt zetten!
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'meta',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
      group: 'meta',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'meta',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Zet in de Spotlight (TOP CONTENT)',
      type: 'boolean',
      group: 'meta',
      description: 'Zet dit vinkje aan om dit artikel bovenaan de homepage vast te pinnen.',
      initialValue: false,
    }),
  ],
})
