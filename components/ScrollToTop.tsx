'use client';
import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Luister of de gebruiker meer dan 300 pixels naar beneden scrolt
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Dit zorgt voor de chique glij-animatie
    });
  };

  // Laat de knop niet zien als we bovenaan zijn
  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-brand-pink/30 hover:bg-brand-pink text-white backdrop-blur-sm border border-brand-pink/50 transition-all duration-300 shadow-lg shadow-brand-pink/20"
      aria-label="Ga naar boven"
    >
      {/* Dit is een simpel pijl-omhoog icoontje */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}