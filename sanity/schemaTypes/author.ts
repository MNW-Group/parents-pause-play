import { defineField, defineType } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Avatar / Image',
      type: 'image',
      options: { hotspot: true }, // Laat je de afbeelding mooi uitsnijden
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      description: 'Een korte beschrijving over jouw expertise als gamende ouder.',
    }),
  ],
})