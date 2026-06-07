"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export default function SearchBar({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      onClose?.(); // Sluit de mobile overlay of hamburger menu als die open staat
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 3) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        setResults(data.results || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Search fetch failed", error);
      }
    };

    const delay = setTimeout(fetchResults, 300);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="relative w-full" ref={containerRef}>
      
      {/* Input veld met icon */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-[#111] border border-gray-700 rounded-lg py-3 pl-4 pr-12 text-white focus:outline-none focus:border-brand-pink transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {/* Klikbaar zoek-icoon */}
        <button 
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-brand-pink transition-colors"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Dropdown Resultaten */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#111] border border-gray-800 rounded-xl shadow-2xl z-[100] overflow-hidden flex flex-col">
          {results.length > 0 ? (
            <>
          {results.slice(0, 4).map((item, index) => {
          // Exact dezelfde om-en-om logica als op je homepage
          const themeKey = index % 2 === 0 ? 'pink' : 'blue';
          const categoryClass = themeKey === 'pink' ? 'text-brand-pink' : 'text-brand-blue';

          return (
            <Link 
              href={`/${item.slug}`} 
              key={item._id}
              onClick={() => { setIsOpen(false); onClose?.(); }}
              className="flex items-center gap-4 p-4 hover:bg-gray-800/50 transition-colors border-b border-gray-800/50">
            {item.mainImage && (
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image src={urlFor(item.mainImage).width(80).height(80).url()} alt={item.title} fill className="rounded object-cover" />
              </div>
            )}
              <div className="flex flex-col">
                <p className="text-sm font-bold text-white">{item.title}</p>
                {/* Hier gebruiken we nu de dynamische kleur */}
                <p className={`text-[10px] uppercase ${categoryClass} font-mono font-bold tracking-wider`}>
                {item.label}
                </p>
              </div>
            </Link>
              );
            })}
              
              {/* De extra "View all" knop */}
              <button 
                onClick={handleSearch}
                className="p-4 text-xs font-mono font-bold tracking-wider text-gray-400 hover:text-white bg-[#0a0a0a] hover:bg-gray-800/80 transition-colors text-center w-full uppercase"
              >
                View all results for "{query}" →
              </button>
            </>
          ) : (
            <div className="p-5 text-sm font-light text-gray-500 text-center">
              No results found for "{query}".
            </div>
          )}
        </div>
      )}
    </div>
  );
}