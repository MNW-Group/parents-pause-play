/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Metadata } from 'next';

// Helper voor de animatie
const animateLastWord = (text: string) => {
  if (!text) return text;
  const words = text.trim().split(' ');
  const lastWord = words.pop();
  return <>{words.join(' ')} <span className="animate-color-rotate">{lastWord}</span></>;
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const q = (await searchParams).q || "";
  return { title: `Results for "${q}" | Parents, Pause & Play` };
}

export default async function SearchResultsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = (await searchParams).q || "";
  
  const results = await client.fetch(`
    *[_type in ["post", "article", "review", "page"] && (title match $q || excerpt match $q || pt::text(body) match $q)] {
      _id,
      title,
      slug,
      mainImage,
      "label": select(
        _type == "review" => "REVIEW",
        _type == "post" => "ULTIMATE GUIDE",
        _type == "page" => "PAGE",
        coalesce(category->title, "ARTICLE")
      )
    } | order(_createdAt desc)
  `, { q: `${q}*` });

  return (
    <main className="p-6 md:p-12 lg:p-16 max-w-4xl mx-auto w-full font-sans text-white">
      <Link href="/" className="text-gray-500 hover:text-white transition-colors mb-8 inline-block font-bold text-sm tracking-wider">
        ← BACK TO HOME
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          {animateLastWord(`Search results for: "${q}"`)}
        </h1>
        <p className="text-gray-400">Found {results.length} results</p>
      </header>

      <div className="grid gap-6">
        {results.length === 0 && <p className="text-gray-500">No content found matching your search.</p>}
        
        {results.map((item: any) => (
          <Link href={`/${item.slug.current}`} key={item._id} className="group flex gap-6 p-4 rounded-2xl bg-[#111] hover:bg-[#1a1a1a] transition-all border border-gray-800">
             {item.mainImage && (
                <div className="w-32 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={urlFor(item.mainImage).width(300).height(200).url()} alt={item.title} fill className="object-cover" />
                </div>
             )}
             <div className="flex flex-col justify-center">
                <span className="text-brand-pink font-mono text-xs uppercase font-bold mb-1">{item.label}</span>
                <h2 className="text-xl font-bold group-hover:text-brand-pink transition-colors">{item.title}</h2>
             </div>
          </Link>
        ))}
      </div>
    </main>
  );
}