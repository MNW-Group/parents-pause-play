import { defineField, defineType } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'body',
      title: 'Body Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image',
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
      ] } // Zo kun je ook foto's midden in je verhaal zetten
      ],
    }),
  ],
})