import { defineField, defineType } from 'sanity'

export const review = defineType({
  name: 'review',
  title: 'Game Reviews',
  type: 'document',
  groups: [
    { name: 'content', title: 'Review Content', default: true },
    { name: 'stats', title: 'Pause & Play Stats (1-5)' },
    { name: 'meta', title: 'Settings & Meta' },
  ],
  fields: [
    // --- CONTENT ---
    defineField({
      name: 'title',
      title: 'Game Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Game Cover / Screenshot',
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
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternatieve tekst (Alt Text) voor SEO',
          description: 'Beschrijf wat er op de afbeelding te zien is voor Google en schermlezers.',
          // Optioneel: hiermee verplicht je jezelf/de marketeer om het altijd in te vullen
          validation: (rule: import('sanity').Rule) => rule.required(), 
        }
      ]
        },
      ],
    }),

    // --- PAUSE & PLAY STATS ---
    defineField({
      name: 'pausePlayFlexibility',
      title: 'Pause & Play Flexibility',
      type: 'number',
      group: 'stats',
      description: '1=Slecht, 5=Uitstekend. Hoe snel kun je pauzeren/stoppen?',
      validation: (rule) => rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: 'pickUpPlayFactor',
      title: 'Pick-Up & Play Factor',
      type: 'number',
      group: 'stats',
      description: '1=Moeilijk, 5=Makkelijk. Pak je de draad zo weer op na een week?',
      validation: (rule) => rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: 'energyLevel',
      title: 'Energy Level Required',
      type: 'number',
      group: 'stats',
      description: '1=Chill, 5=Intens. Hoeveel focus heb je nodig?',
      validation: (rule) => rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: 'silentPlayability',
      title: 'Silent Playability',
      type: 'number',
      group: 'stats',
      description: '1=Geluid nodig, 5=Perfect zonder geluid.',
      validation: (rule) => rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: 'contactNapFactor',
      title: 'Contact Nap Factor',
      type: 'number',
      group: 'stats',
      description: '1=Onmogelijk, 5=Perfect met één hand/baby op schoot.',
      validation: (rule) => rule.required().min(1).max(5).integer(),
    }),

    // --- META ---
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
      name: 'platforms',
      title: 'Available on (Platforms)',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'PlayStation 5', value: 'ps5' },
          { title: 'PlayStation 4', value: 'ps4' },
          { title: 'Xbox Series X|S', value: 'xbox-series' },
          { title: 'Xbox One', value: 'xbox-one' },
          { title: 'Nintendo Switch', value: 'switch' },
          { title: 'Nintendo Switch 2', value: 'switch-2' },
          { title: 'PC', value: 'pc' },
          { title: 'Mobile (iOS/Android)', value: 'mobile' },
          { title: 'Emulator', value: 'emulator' },
        ],
      },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'genres',
      title: 'Genres',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Action', value: 'action' },
          { title: 'Adventure', value: 'adventure' },
          { title: 'Couch co-op', value: 'couch-coop' },
          { title: 'Cozy', value: 'cozy' },
          { title: 'Monster Tamer', value: 'monster-tamer' },
          { title: 'Online multiplayer', value: 'online-multiplayer' },
          { title: 'Platformer', value: 'platformer' },
          { title: 'Puzzle', value: 'puzzle' },
          { title: 'Racing', value: 'racing' },
          { title: 'RPG (Role-Playing Game)', value: 'rpg' },
          { title: 'Shooter', value: 'shooter' },
          { title: 'Simulation', value: 'simulation' },
          { title: 'Sports', value: 'sports' },
          { title: 'Strategy', value: 'strategy' },
        ],
      },
      validation: (rule) => rule.unique(),
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