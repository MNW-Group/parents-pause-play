"use client"; // Maakt dit een interactieve Client Component

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // Jouw exacte links inclusief de om-en-om hover kleuren
  const navLinks = [
    { name: "Home", href: "/", hoverClass: "hover:text-brand-pink" },
    { name: "Ultimate Guides", href: "/guides", hoverClass: "hover:text-brand-blue" },
    { name: "Articles", href: "/articles", hoverClass: "hover:text-brand-pink" },
    { name: "Reviews", href: "/reviews", hoverClass: "hover:text-brand-blue" },
    { name: "Our Story", href: "/about", hoverClass: "hover:text-brand-pink" },
  ];

  return (
    <>
      {/* === 1. MOBIELE TOPBAR (Alleen zichtbaar op schermen kleiner dan 'md') === */}
      <div className="md:hidden flex items-center justify-between p-4 bg-brand-dark border-b border-gray-800 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/white-logo-clean-500x500-upscale-removebg.png" 
            alt="Logo" 
            width={40} 
            height={40} 
            className="drop-shadow-[0_0_8px_rgba(164,195,210,0.3)]"
          />
          <div className="flex flex-col">
            <span className="font-black text-brand-pink tracking-tight leading-none text-lg">PARENTS,</span>
            <span className="font-black text-brand-pink tracking-tight leading-none text-lg">PAUSE & PLAY</span>
          </div>
        </Link>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

{/* === 2. MOBIEL UITKLAPMENU === */}
      {isOpen && (
        <nav className="md:hidden bg-brand-dark/95 backdrop-blur-md border-b border-gray-800 flex flex-col p-4 z-40 fixed top-[73px] left-0 w-full h-screen">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className={`py-4 px-4 font-mono text-xl tracking-wider uppercase ${link.hoverClass} transition-colors border-b border-gray-800/50`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      )}

      
      {/* === 3. JOUW EXACTE DESKTOP SIDEBAR (Alleen zichtbaar op 'md' en groter) === */}
      {/* Opmerking: w-80, bg-brand-dark, border-r en z-50 zijn precies zoals jij ze had */}
      <aside className="hidden md:flex w-80 bg-brand-dark fixed inset-y-0 border-r border-gray-800 flex-col p-8 z-50">
        
        {/* Logo & Titel Sectie */}
        <Link href="/" className="flex items-center gap-4 group mb-12">
          <Image 
            src="/white-logo-clean-500x500-upscale-removebg.png" 
            alt="Logo" 
            width={75}  
            height={75} 
            className="drop-shadow-[0_0_8px_rgba(164,195,210,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(234,185,188,0.6)] transition-all"
          />
          <div className="flex flex-col">
            <span className="font-black text-brand-pink tracking-tight leading-tight text-2xl">PARENTS,</span>
            <span className="font-black text-brand-pink tracking-tight leading-tight text-2xl">PAUSE & PLAY</span>
          </div>
        </Link>

        {/* Navigatie Links */}
        <nav className="flex flex-col gap-4 font-mono text-lg tracking-wider uppercase flex-1">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className={`py-3 px-4 rounded-xl hover:bg-brand-black ${link.hoverClass} transition-all border border-transparent hover:border-gray-800`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto text-sm text-brand-blue/50 italic text-center">
          Gaming through parenthood
        </div>
      </aside>
    </>
  );
}