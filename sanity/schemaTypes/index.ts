import { type SchemaTypeDefinition } from 'sanity'
import { author } from './author'
import { category } from './category'
import { post } from './post'
import { page } from './page'
import { review } from './review'
import { article } from './article'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, category, post, page, review, article],
}