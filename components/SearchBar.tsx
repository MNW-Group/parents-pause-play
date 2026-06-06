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
      onClose?.();
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
    <div className="relative w-full  md:px-0" ref={containerRef}>
      <input
        type="text"
        placeholder="Search..."
        className="w-full bg-[#111] border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-pink transition-all"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {isOpen && results.length > 0 && (
        <div className="absolute left-4 right-4 md:left-0 md:right-0 top-full mt-2 bg-[#111] border border-gray-800 rounded-xl shadow-2xl z-[100] overflow-hidden">
          {results.slice(0, 5).map((item) => (
            <Link 
              href={`/${item.slug}`} 
              key={item._id}
              onClick={() => { setIsOpen(false); onClose?.(); }}
              className="flex items-center gap-4 p-4 hover:bg-gray-800/50 transition-colors border-b border-gray-800/50"
            >
              {item.mainImage && (
                <div className="w-10 h-10 relative flex-shrink-0">
                  <Image src={urlFor(item.mainImage).width(80).height(80).url()} alt={item.title} fill className="rounded object-cover" />
                </div>
              )}
              <div className="flex flex-col">
                <p className="text-sm font-bold text-white">{item.title}</p>
                <p className="text-[10px] uppercase text-brand-pink font-mono">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}