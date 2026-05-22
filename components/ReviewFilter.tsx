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

const genreMap: Record<string, string> = {
  'action': 'Action', 'adventure': 'Adventure', 'couch-coop': 'Couch Co-op',
  'cozy': 'Cozy', 'monster-tamer': 'Monster Tamer', 'online-multiplayer': 'Online Multiplayer',
  'platformer': 'Platformer', 'puzzle': 'Puzzle', 'racing': 'Racing',
  'rpg': 'RPG', 'shooter': 'Shooter', 'simulation': 'Simulation',
  'sports': 'Sports', 'strategy': 'Strategy'
};

const platformMap: Record<string, string> = {
  'ps5': 'PS5', 'ps4': 'PS4', 'xbox-series': 'Xbox Series X|S',
  'xbox-one': 'Xbox One', 'switch': 'Switch', 'switch-2': 'Switch 2',
  'pc': 'PC', 'mobile': 'Mobile', 'emulator': 'Emulator'
};

export default function ReviewFilter({ allArticles }: { allArticles: any[] }) {
  // --- MEERVOUDIGE STATES VOOR GENRES & PLATFORMS ---
  const [activeGenres, setActiveGenres] = useState<string[]>([]);
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);
  
  // Menu uitklap states
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  
  // Stats
  const [minPausePlay, setMinPausePlay] = useState<number>(1);
  const [minContactNap, setMinContactNap] = useState<number>(1);
  const [minPickUp, setMinPickUp] = useState<number>(1);
  const [minSilent, setMinSilent] = useState<number>(1);
  const [minEnergy, setMinEnergy] = useState<number>(1);

  // Unieke lijsten genereren (Zonder "All", want leeg betekent nu All)
  const allGenres = Array.from(new Set(allArticles.flatMap(article => article.genres || [])));
  const allPlatforms = Array.from(new Set(allArticles.flatMap(article => article.platforms || [])));

  // TOGGLE FUNCTIES VOOR CHECKBOXES
  const toggleGenre = (genre: string) => {
    setActiveGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
  };

  const togglePlatform = (platform: string) => {
    setActivePlatforms(prev => prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]);
  };

  // RESET FUNCTIE
  const resetFilters = () => {
    setActiveGenres([]);
    setActivePlatforms([]);
    setMinPausePlay(1);
    setMinContactNap(1);
    setMinPickUp(1);
    setMinSilent(1);
    setMinEnergy(1);
  };

  const isFiltered = activeGenres.length > 0 || activePlatforms.length > 0 || minPausePlay > 1 || minContactNap > 1 || minPickUp > 1 || minSilent > 1 || minEnergy > 1;

  // --- FILTER LOGICA ---
  const filteredArticles = allArticles.filter(article => {
    // GENRES: De game moet ALLE aangevinkte genres bevatten (AND logica)
    const matchGenre = activeGenres.length === 0 ? true : activeGenres.every(g => article.genres?.includes(g));
    
    // PLATFORMS: De game mag op MINSTENS ÉÉN van de aangevinkte platforms staan (OR logica)
    const matchPlatform = activePlatforms.length === 0 ? true : activePlatforms.some(p => article.platforms?.includes(p));
    
    const matchPausePlay = minPausePlay === 1 ? true : (article.pausePlayFlexibility || 0) >= minPausePlay;
    const matchContactNap = minContactNap === 1 ? true : (article.contactNapFactor || 0) >= minContactNap;
    const matchPickUp = minPickUp === 1 ? true : (article.pickUpPlayFactor || 0) >= minPickUp;
    const matchSilent = minSilent === 1 ? true : (article.silentPlayability || 0) >= minSilent;
    const matchEnergy = minEnergy === 1 ? true : (article.energyLevel || 0) >= minEnergy; 

    return matchGenre && matchPlatform && matchPausePlay && matchContactNap && matchPickUp && matchSilent && matchEnergy;
  });

  return (
    <div>
      <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 md:p-8 mb-8 flex flex-col gap-6">
        
        {/* DROPDOWNS MET CHECKBOXES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          
          {/* GENRE DROPDOWN */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Genres</label>
            <button 
              onClick={() => { setIsGenreOpen(!isGenreOpen); setIsPlatformOpen(false); }}
              className="w-full bg-brand-dark border border-gray-700 hover:border-brand-blue transition-colors rounded-xl px-4 py-3 text-sm font-bold text-left flex justify-between items-center"
            >
              <span className={activeGenres.length > 0 ? "text-brand-blue" : "text-gray-300"}>
                {activeGenres.length === 0 ? "All Genres" : `${activeGenres.length} selected`}
              </span>
              <svg className="fill-current text-gray-500 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
            </button>
            
            {/* HET UITKLAPMENU (Met onzichtbare sluit-laag erachter) */}
            {isGenreOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsGenreOpen(false)} />
                <div className="absolute top-full mt-2 left-0 w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 z-20 shadow-2xl max-h-60 overflow-y-auto flex flex-col gap-2">
                  {allGenres.map(genre => (
                    <label key={genre as string} className="flex items-center gap-3 cursor-pointer group p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                      <input 
                        type="checkbox" 
                        checked={activeGenres.includes(genre as string)} 
                        onChange={() => toggleGenre(genre as string)} 
                        className="w-4 h-4 accent-brand-blue bg-gray-900 border-gray-700 rounded cursor-pointer"
                      />
                      <span className="text-sm font-bold text-gray-300 group-hover:text-white capitalize transition-colors">
                        {genreMap[genre as string] || genre}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* PLATFORM DROPDOWN */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Platforms</label>
            <button 
              onClick={() => { setIsPlatformOpen(!isPlatformOpen); setIsGenreOpen(false); }}
              className="w-full bg-brand-dark border border-gray-700 hover:border-brand-pink transition-colors rounded-xl px-4 py-3 text-sm font-bold text-left flex justify-between items-center"
            >
              <span className={activePlatforms.length > 0 ? "text-brand-pink" : "text-gray-300"}>
                {activePlatforms.length === 0 ? "All Platforms" : `${activePlatforms.length} selected`}
              </span>
              <svg className="fill-current text-gray-500 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
            </button>

            {/* HET UITKLAPMENU */}
            {isPlatformOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsPlatformOpen(false)} />
                <div className="absolute top-full mt-2 left-0 w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 z-20 shadow-2xl max-h-60 overflow-y-auto flex flex-col gap-2">
                  {allPlatforms.map(platform => (
                    <label key={platform as string} className="flex items-center gap-3 cursor-pointer group p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                      <input 
                        type="checkbox" 
                        checked={activePlatforms.includes(platform as string)} 
                        onChange={() => togglePlatform(platform as string)} 
                        className="w-4 h-4 accent-brand-pink bg-gray-900 border-gray-700 rounded cursor-pointer"
                      />
                      <span className="text-sm font-bold text-gray-300 group-hover:text-white capitalize transition-colors">
                        {platformMap[platform as string] || platform}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>

        {/* GEAVANCEERDE SLIDERS */}
        <div className="pt-4 border-t border-gray-800/60 mt-2">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between group focus:outline-none py-2"
          >
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">
              Advanced Pause & Play Stats Requirements (Optional)
            </h3>
            <span className="text-gray-500 font-mono text-lg group-hover:text-white transition-colors">
              {showAdvanced ? '−' : '+'}
            </span>
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 mt-6 animated fadeIn">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 flex justify-between">
                  <span>Pause & Play Flexibility</span>
                  <span className="text-white">{minPausePlay === 1 ? 'Any' : `Min. ${minPausePlay}/5`}</span>
                </label>
                <input type="range" min="1" max="5" step="1" value={minPausePlay} onChange={(e) => setMinPausePlay(Number(e.target.value))} className="w-full accent-brand-blue cursor-pointer" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 flex justify-between">
                  <span>Contact Nap Factor</span>
                  <span className="text-white">{minContactNap === 1 ? 'Any' : `Min. ${minContactNap}/5`}</span>
                </label>
                <input type="range" min="1" max="5" step="1" value={minContactNap} onChange={(e) => setMinContactNap(Number(e.target.value))} className="w-full accent-brand-pink cursor-pointer" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 flex justify-between">
                  <span>Pick-up & Play Factor</span>
                  <span className="text-white">{minPickUp === 1 ? 'Any' : `Min. ${minPickUp}/5`}</span>
                </label>
                <input type="range" min="1" max="5" step="1" value={minPickUp} onChange={(e) => setMinPickUp(Number(e.target.value))} className="w-full accent-brand-blue cursor-pointer" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 flex justify-between">
                  <span>Silent Playability</span>
                  <span className="text-white">{minSilent === 1 ? 'Any' : `Min. ${minSilent}/5`}</span>
                </label>
                <input type="range" min="1" max="5" step="1" value={minSilent} onChange={(e) => setMinSilent(Number(e.target.value))} className="w-full accent-brand-pink cursor-pointer" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 flex justify-between">
                  <span>Energy Level Required</span>
                  <span className="text-brand-blue">{minEnergy === 1 ? 'Any' : `Min. ${minEnergy}/5`}</span>
                </label>
                <input type="range" min="1" max="5" step="1" value={minEnergy} onChange={(e) => setMinEnergy(Number(e.target.value))} className="w-full accent-brand-blue cursor-pointer" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ACTIE BALK */}
      <div className="flex justify-between items-center mb-8 px-2">
        <span className="text-gray-400 font-bold text-sm tracking-wide">
          {filteredArticles.length} {filteredArticles.length === 1 ? 'game' : 'games'} found
        </span>
        {isFiltered && (
          <button onClick={resetFilters} className="text-sm font-bold text-brand-pink hover:text-white transition-colors flex items-center gap-1">
            ✕ Clear all filters
          </button>
        )}
      </div>

      {/* RESULTATEN */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-brand-dark/30 border border-dashed border-gray-800 rounded-3xl">
          <p className="text-2xl font-bold text-gray-400 mb-2">-</p>
          <p className="text-gray-500 font-light">No reviews found matching these strict criteria.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}