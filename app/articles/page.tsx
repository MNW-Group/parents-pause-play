/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { client } from '@/sanity/lib/client';

const themeMaps = {
  category: {
    pink: 'text-brand-pink',
    blue: 'text-brand-blue'
  },
  link: {
    pink: 'text-brand-pink opacity-80 group-hover:opacity-100',
    blue: 'text-brand-blue opacity-80 group-hover:opacity-100'
  }
};

const ALL_ARTICLES_QUERY = `
  *[_type in ["post", "article", "review"]] | order(_updatedAt desc) {
    _id,
    title,
    excerpt,
    "slug": slug.current,
    _updatedAt,
    "label": select(
      _type == "review" => "REVIEW",
      _type == "post" => "ULTIMATE GUIDE",
      coalesce(category->title, "ARTICLE")
    )
  }
`;

export default async function ArticlesPage() {
  const allArticles = await client.fetch(ALL_ARTICLES_QUERY);

  return (
    <main className="p-6 md:p-12 lg:p-16 max-w-7xl mx-auto w-full font-sans text-white">
      
      <header className="mb-16 border-b-2 border-gray-800 pb-12">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
          More <span className="animate-color-rotate">Articles</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl font-light">
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {allArticles.map((article: any, index: number) => {
          const themeKey = index % 2 === 0 ? 'pink' : 'blue';
          const categoryClass = themeMaps.category[themeKey];
          const linkClass = themeMaps.link[themeKey];

          return (
            <Link 
              href={`/${article.slug}`} 
              key={article._id}
              className="group flex flex-col bg-brand-dark rounded-3xl p-6 md:p-8 border border-gray-800/50 hover:border-gray-700 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6 text-sm">
                <span className={`${categoryClass} font-mono tracking-wider uppercase font-bold`}>
                  {article.label}
                </span>
                <time dateTime={article._updatedAt} className="text-gray-500 font-light">
                  {new Date(article._updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-white transition-colors">
                {article.title}
              </h3>
              
              <p className="text-gray-400 font-light leading-relaxed flex-1 line-clamp-2">
                {article.excerpt}
              </p>

              <div className={`mt-6 text-sm font-bold ${linkClass} flex items-center gap-2 transition-all`}>
                READ ARTICLE <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          );
        })}
      </div>

    </main>
  );
}