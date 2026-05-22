/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '@/sanity/lib/client';
import ArticleFilter from '@/components/ArticleFilter';

// LET OP: _type == "article" zorgt dat reviews en guides hier verdwijnen!
const ARTICLES_QUERY = `
  *[_type == "article"] | order(_updatedAt desc) {
    _id,
    title,
    excerpt,
    mainImage,
    "slug": slug.current,
    _updatedAt,
    "label": coalesce(category->title, "ARTICLE"),
    "categoryName": category->title
  }
`;

export default async function ArticlesPage() {
  const allArticles = await client.fetch(ARTICLES_QUERY);

  return (
    <main className="p-6 md:p-12 lg:p-16 max-w-7xl mx-auto w-full font-sans text-white">
      <header className="mb-16 border-b-2 border-gray-800 pb-12">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
          More <span className="animate-color-rotate">Articles</span>
        </h1>
      </header>

      {/* Het nieuwe interactieve filter component */}
      <ArticleFilter allArticles={allArticles} />
    </main>
  );
}