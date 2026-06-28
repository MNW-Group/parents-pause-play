/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import Image from "next/image"; // Toegevoegd voor de Card Images
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image'; // Toegevoegd voor de Card Images

// We vertellen Tailwind expliciet welke klassen hij moet inladen.
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

// 1. GROQ Query voor de TOP CONTENT (Blok A)
// FIX: Aangepast naar category->title omdat we 1 op 1 relaties gebruiken
// NIEUW: mainImage toegevoegd aan de query
const FEATURED_QUERY = `
  *[_type in ["post", "article", "review"] && isFeatured == true] | order(_updatedAt desc)[0...3] {
    _id,
    title,
    excerpt,
    mainImage,
    "slug": slug.current,
    _updatedAt,
    "label": select(
      _type == "review" => "REVIEW",
      _type == "post" => "ULTIMATE GUIDE",
      coalesce(category->title, "ARTICLE")
    )
  }
`;

const LATEST_QUERY = `
  *[_type in ["post", "article", "review"] && (isFeatured != true || !defined(isFeatured))] | order(_updatedAt desc)[0...6] {
    _id,
    title,
    excerpt,
    mainImage,
    "slug": slug.current,
    _updatedAt,
    "label": select(
      _type == "review" => "REVIEW",
      _type == "post" => "ULTIMATE GUIDE",
      coalesce(category->title, "ARTICLE")
    )
  }
`;

export default async function Home() {
  const [featuredPosts, latestPosts] = await Promise.all([
    client.fetch(FEATURED_QUERY),
    client.fetch(LATEST_QUERY)
  ]);

  return (
    <main className="p-6 md:p-12 lg:p-16 max-w-7xl mx-auto w-full font-sans text-white">
      
      {/* === DE HERO BANNER === */}
      {/* FIX: Lijnkleur aangepast naar een duidelijkere border-gray-800 */}
      <header className="mb-20 pb-12 border-b-2 border-gray-800">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 break-words">
          Gaming Through 
          <span className="animate-color-rotate md:ml-3 inline-block mt-2 md:mt-0">Parenthood</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light mb-8 leading-relaxed">
          Actionable tips, parent-proof game reviews, and strategies to balance your hobbies with your new reality.
        </p>
        <Link 
          href="/the-ultimate-guide-to-gaming-first-year" 
          className="inline-block bg-brand-pink text-black hover:bg-brand-blue font-bold py-4 px-8 rounded-full transition-transform hover:-translate-y-1"
        >
          Start Here: The First Year Guide
        </Link>
      </header>

      {/* === BLOK A: TOP CONTENT (Featured) === */}
      <section className="mb-20">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8">
          TOP 
          <span className="animate-color-rotate ml-3">CONTENT</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredPosts.map((article: any, index: number) => {
            const themeKey = index % 2 === 0 ? 'pink' : 'blue';
            const categoryClass = themeMaps.category[themeKey];
            const linkClass = themeMaps.link[themeKey];

            return (
              <Link 
                // FIX: ?ref=home toegevoegd voor contextuele navigatie
                href={`/${article.slug}?ref=home`} 
                key={article._id}
                className="group flex flex-col bg-brand-dark rounded-3xl p-6 md:p-8 border border-gray-800/50 hover:border-gray-700 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* NIEUW: Afbeelding in de card ingeladen */}
                {article.mainImage && (
                  <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden bg-[#0a0a0a]">
                    <Image
                      src={urlFor(article.mainImage).width(600).height(338).url()}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

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
                
                {/* FIX: Excerpt toegevoegd met line-clamp om het na 2 regels netjes af te kappen */}
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
      </section>

      {/* === BLOK B: LATEST CONTENT (Feed) === */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            LATEST 
            <span className="animate-color-rotate ml-3">RELEASES</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {latestPosts.map((article: any, index: number) => {
            const themeKey = index % 2 === 0 ? 'blue' : 'pink';
            const categoryClass = themeMaps.category[themeKey];
            const linkClass = themeMaps.link[themeKey];

            return (
              <Link 
                // FIX: ?ref=home toegevoegd voor contextuele navigatie
                href={`/${article.slug}?ref=home`} 
                key={article._id}
                className="group flex flex-col bg-brand-dark rounded-3xl p-6 md:p-8 border border-gray-800/50 hover:border-gray-700 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* NIEUW: Afbeelding in de card ingeladen */}
                {article.mainImage && (
                  <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden bg-[#0a0a0a]">
                    <Image
                      src={urlFor(article.mainImage).width(600).height(338).url()}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

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
                
                {/* FIX: Excerpt toegevoegd */}
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

{/* NAVIGATIE KEUZES (In plaats van één View All knop) */}
        <div className="mt-12 flex flex-col sm:flex-row justify-end items-center gap-6 md:gap-8 border-t border-gray-800/50 pt-6">
          <Link href="/articles" className="text-sm font-bold text-brand-pink opacity-80 hover:opacity-100 transition-all hover:scale-105">
            ALL ARTICLES →
          </Link>
          <Link href="/reviews" className="text-sm font-bold text-brand-blue opacity-80 hover:opacity-100 transition-all hover:scale-105">
            ALL REVIEWS →
          </Link>
          <Link href="/guides" className="text-sm font-bold text-brand-pink opacity-80 hover:opacity-100 transition-all hover:scale-105">
            ULTIMATE GUIDES →
          </Link>
        </div>   
        </section>

    </main>
  );
}