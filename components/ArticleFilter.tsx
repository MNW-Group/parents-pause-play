/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const themeMaps = {
  category: { pink: 'text-brand-pink', blue: 'text-brand-blue' },
  link: { pink: 'text-brand-pink opacity-80 group-hover:opacity-100', blue: 'text-brand-blue opacity-80 group-hover:opacity-100' }
};

export default function ArticleFilter({ allArticles }: { allArticles: any[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Haal alle unieke categorieën uit de artikelen, negeer de lege
  const allCategories = ["All", ...Array.from(new Set(allArticles.map(article => article.categoryName).filter(Boolean)))];

  // Filter logica
  const filteredArticles = activeCategory === "All" 
    ? allArticles 
    : allArticles.filter(article => article.categoryName === activeCategory);

  return (
    <div>
      {/* DE FILTER KNOPPEN */}
      <div className="flex flex-wrap gap-3 mb-12">
        {allCategories.map(cat => (
          <button
            key={cat as string}
            onClick={() => setActiveCategory(cat as string)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
              activeCategory === cat 
                ? "bg-brand-pink text-black shadow-[0_0_15px_rgba(234,185,188,0.4)]" 
                : "bg-brand-dark border border-gray-800 text-gray-400 hover:border-brand-pink hover:text-white"
            }`}
          >
            {cat as string}
          </button>
        ))}
      </div>

      {/* DE RESULTATEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredArticles.map((article: any, index: number) => {
          const themeKey = index % 2 === 0 ? 'pink' : 'blue';
          const categoryClass = themeMaps.category[themeKey];
          const linkClass = themeMaps.link[themeKey];

          return (
            <Link href={`/${article.slug}`} key={article._id} className="group flex flex-col bg-brand-dark rounded-3xl p-6 md:p-8 border border-gray-800/50 hover:border-gray-700 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              {article.mainImage && (
                <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden bg-[#0a0a0a]">
                  <Image src={urlFor(article.mainImage).width(600).height(338).url()} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="flex justify-between items-center mb-6 text-sm">
                <span className={`${categoryClass} font-mono tracking-wider uppercase font-bold`}>{article.label}</span>
                <time dateTime={article._updatedAt} className="text-gray-500 font-light">
                  {new Date(article._updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-white transition-colors">{article.title}</h3>
              <p className="text-gray-400 font-light leading-relaxed flex-1 line-clamp-2">{article.excerpt}</p>
              <div className={`mt-6 text-sm font-bold ${linkClass} flex items-center gap-2 transition-all`}>
                READ ARTICLE <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}